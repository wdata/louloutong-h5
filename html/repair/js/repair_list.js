/**
 * Created by Administrator on 2017/8/23.
 */
var page = null;   // 页数
var searchType = null;  // 报修类型
var keyword = null;   // 搜索关键字；


$(document).ready(function(){
    //  首页数据；
    var indexAjax = new IndexAjax(1);
    indexAjax.main();
});

function aHRY(string){
    var bur = false;
    $.each(authority,function(index,val){
        if(val === string){
            bur = true;
        }
    });
    return bur;
}

console.info($(window).height())

// 数据获取
function IndexAjax(propertyId,page,searchType,keyword){
    this.userId = "1977";   // 用户ID；
    this.propertyId = propertyId;   // 物业ID；
    this.page = page?page:"";   // 页数
    this.size = 2;   // 每页个数
    this.searchType = searchType?searchType:"";   // 报修类型
    this.keyword = keyword?keyword:"";   // 搜索关键字；

    this.main = function(){
        this.repairList();        // 五个机制是否显示红点提示；
    };
    this.repairList = function(){
        var _this = this;
        console.log(this.propertyId);
        var comment = 1;      //page数
        var dropload = $('.dataList').dropload({
            scrollArea : window,
            autoLoad:true,
            loadDownFn : function(me){
                console.log($(window).width());
                //  获取报修列表
                $.ajax({
                    type:'get',
                    url:  server_url_repair + server_v1 + '/repair/list.json',
                    data: {
                        "userId":_this.userId,
                        "propertyId":_this.propertyId,
                        "page":comment,
                        "size":_this.size,
                        "searchType":_this.searchType,
                        "keyword":_this.keyword
                    },
                    dataType:'json',
                    success:function(data){
                        var list = $("#list");
                        var html = '';
                        if(data.code === 0){
                            $.each(data.data.items,function(index,val){
                                var status = '',img = '',operating = '';
                                var href = 'repair_details.html';
                                switch (val.status){
                                    case 1:
                                        //  如果是物业管理人员则显示未派单；如果是租户，则显示待受理；
                                        if(aHRY("/llt/repair/list/button/sendOrders")){
                                            status = '<div class="repair-status green">未派单</div>';
                                            operating += '<a href="repair_sent.html?id='+ val.id +'" class="repair-operating single blue">派单</a>';
                                        }else{
                                            status = '<div class="repair-status green">待受理</div>';
                                        }
                                        //  有接单权限，可以接单；
                                        if(aHRY("/llt/repair/list/button/orderReceive")){
                                            operating += '<div class="repair-operating orders blue">接单</div>';
                                        }
                                        break;
                                    case 2:
                                        if(aHRY("/llt/repair/list/button/sendOrders")){
                                            //  判断维修ID等于登录ID，则显示“给我的”派单；
                                            if(val.handlerId === userId){
                                                status = '<div class="repair-status blue"><i class="mine-icon"></i>已派单</div>';
                                            }else{
                                                status = '<div class="repair-status blue">已派单</div>';
                                            }
                                        }else{
                                            status = '<div class="repair-status green">待受理</div>';
                                        }
                                        break;
                                    case 3:
                                        if(val.handlerId === null){
                                            if(aHRY("/llt/repair/list/button/sendAgain")){
                                                status = '<div class="repair-status red">被移交</div>';
                                                operating += '<a href="repair_sent.html?id='+ val.id +'" class="repair-operating reappear blue">重新派单</a>';
                                                //  有接单权限，可以接单；
                                                if(aHRY("/llt/repair/list/button/orderReceive")){
                                                    operating += '<div class="repair-operating orders blue">接单</div>';
                                                }
                                            }else{
                                                status = '<div class="repair-status blue">已受理</div>';
                                            }
                                        }else{
                                            status = '<div class="repair-status blue">已受理</div>';
                                            if(aHRY('/llt/repair/list/button/handover')){
                                                operating += '<div class="repair-operating transfer blue">移交</div>';
                                            }
                                            if(aHRY('/llt/repair/list/button/handle')){
                                                operating += '<div class="repair-operating dealWith blue">填写处理</div>';
                                            }
                                        }
                                        break;
                                    case 4:
                                        status = '<div class="repair-status green">待验收</div>';
                                        if(aHRY('/llt/repair/list/button/check')){
                                            operating += '<div class="repair-operating confirm yellow">确认验收</div>';
                                        }
                                        break;
                                    case 5:status = '<div class="repair-status yellow">已确认</div>';
                                        break;
                                    case 6:
                                        status = '<div class="repair-status gray">已撤销</div>';
                                        href = 'repair_revoked_has.html';
                                        break;
                                }
                                //  如果有撤销权限，切登录ID和发布ID相同，则可以撤销；
                                if(aHRY("/llt/repair/list/button/revoke") && parseInt(userId) === val.user.id && (val.status === 1 || val.status === 2)){
                                    operating += '<a href="repair_revoked.html?id='+ val.id +'" class="repair-operating cancel red">撤销</a>';
                                }
                                //<div class="repair-status green">未派单</div>
                                //<div class="repair-status red">被移交</div>
                                //<div class="repair-status gray">已撤销</div>
                                //<div class="repair-status green">待验收</div>
                                //<div class="repair-status blue">已派单</div>
                                //<div class="repair-status blue">已受理</div>
                                //<div class="repair-status yellow">已确认</div>

                                //<div class="repair-operating cancel red">撤销</div> 移交(transfer)
                                //<div class="repair-operating single blue">派单</div>，接单(orders)，填写处理(dealWith)
                                //<div class="repair-operating reappear blue">重新派单</div>
                                //<div class="repair-operating confirm yellow">确认验收</div>
                                if(val.repairImages){
                                    $.each(val.repairImages,function(x,y){
                                        img += '<img src="'+ server_url_img + y +'" alt="">';
                                    })
                                }
                                var type = val.type===1?"办公区域":val.type===3?"公共区域":"未知";
                                html += '<li> <a class="header"  href="javascript:"> <img class="avatar" src="'+ server_url_img + val.user.photo +'" alt="avatar"> <div class="information"> <div class="name">'+ val.user.name +'</div> <time>'+ val.createTime +'</time> </div> ' +
                                    ''+ status +' </a><a href="'+ href +'?id='+ val.id +'"> <div class="address"><i class="address-icon"></i><span>'+ val.property +'</span></div> <div class="image"> '+ img +'' +
                                    '</div> <p class="repair-types">报修类型：'+ type +'</p> </a> ' +
                                    '<footer> '+ operating +' </footer> </li>';
                            });
                            list.append(html);
                            comment ++;
                            if(data.data.pageCount === 0){
                                me.lock();  //智能锁定，锁定上一次加载的方向
                                me.noData();      //无数据
                            }
                        }else{
                            me.lock();  //智能锁定，锁定上一次加载的方向
                            me.noData();      //无数据
                        }
                        me.resetload();    //数据加载玩重置
                    },
                    error:function(data){
                        ErrorReminder(data);
                        me.noData();      //无数据
                        me.resetload();    //数据加载玩重置
                    }
                })
            }
        });
    };
    this.operating = function(){

    }
}
$('.mainCon-wrap').scroll(function(){
    var isBottom = $('.mainCon-wrap').scrollTop()>=($('.mainCon-wrap').height()-$(window).height());
    if(isBottom){
        var num=32;
        console.info(11)
        //#index 页面:
        touch.on('.rent-list-con .item','swipestart',function(e){
            console.info(0);
        });
        touch.on('.rent-list-con','swiping',function(e){
            console.info(1);
        });
        touch.on('.rent-list-con','swipeend',function(e){
            console.info(2)
        });
        /*$('.rent-list-con .item').bind('touchmove',function(){
         $('.rent-list-con').scrollTop(0);
         })*/

    }
});

$(document).ready(function(){
    //  楼栋切换；
    var tap = new dongSwitch();
    tap.main();  // 调用总函数；
});

function dongSwitch(){
    this.louDong = null;       //   保存数据；
    this.addressList = $("#addressList");   //  楼栋列表父级元素
}


dongSwitch.prototype = {
    constructor:dongSwitch,
    main:function(){
        this.dongAjax();     //  ajax事件获取数据，并将数据保存；
        this.dongSelect();   //    选择楼栋
        this.superior();      //  顶部导航重新选择同级楼栋；
        this.animation();     // 首页到切换页面动画；
    },
    dongAjax:function(){
        var _this = this;
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/property/manager/'+ userId +'.json',
            data: null,
            dataType:'json',
            success:function(data){
                var html = '';
                _this.addressList.empty();
                if(data.code === 0){
                    _this.louDong = data.data;
                    $.each(data.data,function(index,val){
                        //  如果parentId === null 则表示没有上一级，ajax只显示一级列表；
                        if(val.parentId === null){
                            html += '<li data-pid="'+ val.parentId +'" data-id = "'+ val.id +'"><i></i>'+ val.name +'</li>';
                        }
                    });
                    _this.addressList.append(html);
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    },
    dongSelect:function(){

        //  点击下一级；

        var _this = this;
        $(document).on("click","#addressList li",function(){

            //  提示
            $(this).addClass("active")
                .siblings().removeClass("active");

            var id = $(this).attr("data-id");


            var bur = _this.judgment(id,_this.louDong);  // 判断有没有下一级；
            if(bur){
                //  判断是不是点击的全部；
                if(!$(this).is(".all")){

                    // console.log("有下一级");

                    if($("#prompt").is(".active")){
                        //  将选择的放入顶部导航；
                        $("#prompt").before('<li data-pid="'+ $(this).attr("data-pid") +'" data-id="'+ $(this).attr("data-id") +'">'+ $(this).text() +'</li>');
                        //  位移到滚动条最后面；
                        $(".nav").scrollLeft( $('.nav')[0].scrollWidth );
                    }else{
                        $("#prompt").addClass("active")
                            .siblings().removeClass("active");

                        //  判断是不是点击了之前的元素;
                        $.each($(".switch .nav li"),function(index,val){
                            if($(val).attr("data-pid") === $(this).attr("data-id")){
                                $(val).attr({
                                    "data-id":$(this).attr("data-id"),
                                    "data-pid":$(this).attr("data-pid")
                                });
                                $(val).text($(this).text());
                            }
                        });
                    }

                    _this.nextLevel(id);
                }
            }
        });
    },
    animation:function(){
        var _this = this;
        // 平移动画效果
        $(document).on("click","#filter",function(){
            $(".index").addClass("active");
            $(".repair-switch").addClass("active");
        });
        //  选择订单报修状态
        $(".repair-switch .status li").click(function(){
            $(this).addClass("active").siblings().removeClass("active");
        });

        //  确定
        $("#determine").click(function(){
            $(".index").removeClass("active");
            $(".repair-switch").removeClass("active");

        });
        //  重置
        var _this = this;
        $("#reset").click(function(){
            //  重置订单报修状态；
          $(".repair-switch .status li:first-child").addClass("active").siblings().removeClass("active");
            //   重置楼栋
            _this.dongAjax();     //  ajax事件获取数据，并将数据保存；
            //  删除顶部选择楼栋；
            $("#prompt").siblings().remove();
        })
    },
    superior:function(){
        //  选择同级；
        var _this = this;
        $(document).on("click",".switch .nav li",function(){
            //  提示
            $(this).addClass("active")
                .siblings().removeClass("active");

            //  如果顶部点击元素和“请选择”中间有其他元素，需要删除它；
            var index = $("#prompt").index() - $(this).index();
            if(index > 1){
                for(var x = 1 ; x < index ; x++){
                    $(".switch .nav li").eq($(this).index()+1).remove();
                }
            }
            if($(this).is("#prompt")){
                //  如果是点击“请选择”：获取子级元素；
                _this.nextLevel($(".switch .nav li").eq($(this).index()-1).attr("data-id"));
            }else{
                //  如果不是点击“请选择”：获取同级元素；
                _this.SameLevel($(this).attr("data-id"),$(this).attr("data-pid"));
            }

        });
    },
    SameLevel:function(id,pid){
        //  获取同级楼栋；
        var html = '';
        this.addressList.empty();
        if(!(pid === "null")){
            html = '<li class="all" data-id="'+ id +'"><i></i>全部</li>';
        }
        $.each(this.louDong,function(index,val){
            if(val.parentId + "" === pid){
                html += '<li data-pid="'+ val.parentId +'" data-id = "'+ val.id +'"><i></i>'+ val.name +'</li>';
            }

        });
        this.addressList.append(html);
    },
    nextLevel:function(id){
        //  获取子集楼栋；
        var html = '';
        this.addressList.empty();
        html = '<li class="all" data-id="'+ id +'"><i></i>全部</li>';
        $.each(this.louDong,function(index,val){
            if(val.parentId + "" === id){
                html += '<li data-pid="'+ val.parentId +'" data-id = "'+ val.id +'"><i></i>'+ val.name +'</li>';
            }
        });
        this.addressList.append(html);
    },
    judgment:function(id,louDong){
        //  判断是否有下一级
        var bur = false;
        $.each(louDong,function(index,val){
            if(parseInt(id) === val.parentId){
                bur = true;
            }
        });
        return bur;
    }
}