/**
 * Created by Administrator on 2017/8/23.
 */
var page = null;   // 页数
var searchType = 1;  // 报修类型
var keyword = null;   // 搜索关键字；
var pIdRepair = propertyId;  // 物业ID；

//  1、如果从列表跳转进入例如：派单、填写处理页面，返回应该是列表；2、如果是详情页面跳转进入应该返回详情；
sessionStorage.setItem("repairJump",1);


//  权限； 报修列表按钮
// /llt/repair/list/button/sendOrders 派单
// /llt/repair/list/button/sendAgain  重新派单
// /llt/repair/list/button/check  确认验收
// /llt/repair/list/button/orderReceive   接单
// /llt/repair/list/button/handover   移交
// /llt/repair/list/button/handle 填写处理
// /llt/repair/list/button/revoke 撤销

var auth_1 = authMethod("/llt/repair/list/button/sendOrders");
var auth_2 = authMethod("/llt/repair/list/button/sendAgain");
var auth_3 = authMethod("/llt/repair/list/button/check");
var auth_4 = authMethod("/llt/repair/list/button/orderReceive");
var auth_5 = authMethod("/llt/repair/list/button/handover");
var auth_6 = authMethod("/llt/repair/list/button/handle");
var auth_7 = authMethod("/llt/repair/list/button/revoke");
// console.log(auth_1,auth_2,auth_3,auth_4,auth_5,auth_6,auth_7);



$(document).ready(function(){
    htmlAjax.repairList(pIdRepair,page,searchType,keyword);
    htmlAjax.listStatus();
    //  楼栋切换；
    tap.main();  // 调用总函数；
});


var htmlAjax = new HtmlAjax();
// 数据获取
function HtmlAjax(){
    this.repairList = function(proId,page,searchType,keyword){
        var comment = 1;      //page数
        $(".repair-list").dropload({
            scrollArea : $(".repair-list"),
            autoLoad:true,
            loadDownFn : function(me){
                //  获取报修列表
                $.ajax({
                    type:'get',
                    url:  server_url_repair + server_v1 + '/repair/list.json',
                    data: {
                        "userId":userId,
                        "propertyId":proId,
                        "page":comment,
                        "size":5,
                        "searchType":searchType,
                        "keyword":keyword
                    },
                    dataType:'json',
                    success:function(data){
                        var list = $("#list");
                        var html = '';
                        if(data.code === 0 && data.data){
                            $.each(data.data.items,function(index,val){
                                var status = '',img = '',operating = '';
                                var href = 'repair_details.html';
                                switch (val.status){
                                    case 1:
                                        //  如果是物业管理人员则显示未派单；如果是租户，则显示待受理；
                                        if(auth_1){
                                            status = '<div class="repair-status green">未派单</div>';
                                            operating += '<a href="repair_sent.html?id='+ val.id +'&status=1" class="repair-operating single blue">派单</a>';
                                        }else{
                                            status = '<div class="repair-status green">待受理</div>';
                                        }
                                        //  有接单权限，可以接单；
                                        if(auth_4){
                                            operating += '<div data-id="'+ val.id +'" class="repair-operating orders blue">接单</div>';
                                        }
                                        break;
                                    case 2:
                                        //  判断维修ID等于登录ID，则显示“给我的”派单；
                                        if(val.handlerId === parseInt(userId)){
                                            if(auth_1){
                                                status = '<div class="repair-status blue"><i class="mine-icon"></i>已派单</div>';
                                            }else{
                                                status = '<div class="repair-status green"><i class="mine-icon"></i>待受理</div>';
                                            }
                                            //  有接单权限，可以接单；
                                            if(auth_4){
                                                operating += '<div data-id="'+ val.id +'" class="repair-operating orders blue">接单</div>';
                                            }
                                        }else{
                                            if(auth_1){
                                                status = '<div class="repair-status blue">已派单</div>';
                                            }else{
                                                status = '<div class="repair-status green">待受理</div>';
                                            }
                                        }
                                        break;
                                    case 3:
                                        if(val.handlerId === null){
                                            if(auth_2){
                                                status = '<div class="repair-status red">被移交</div>';
                                                operating += '<a href="repair_sent.html?id='+ val.id +'&status=2" class="repair-operating reappear blue">重新派单</a>';
                                                //  有接单权限，可以接单；
                                                if(auth_4){
                                                    operating += '<div data-id="'+ val.id +'" class="repair-operating orders blue">接单</div>';
                                                }
                                            }else{
                                                status = '<div class="repair-status blue">已受理</div>';
                                            }
                                        }else{
                                            status = '<div class="repair-status blue">已受理</div>';
                                            if(auth_5){
                                                operating += '<a href="repair_transfer.html?id='+ val.id +'" class="repair-operating transfer blue">移交</a>';
                                            }
                                            if(auth_6){
                                                operating += '<a href="repair_result.html?id='+ val.id +'" class="repair-operating dealWith blue">填写处理</a>';
                                            }
                                        }
                                        break;
                                    case 4:
                                        status = '<div class="repair-status green">待验收</div>';
                                        if(auth_3 && parseInt(userId) === val.user.id){
                                            operating += '<div data-id="'+ val.id +'" class="repair-operating confirm yellow">确认验收</div>';
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
                                if(auth_7 && parseInt(userId) === val.user.id && (val.status === 1 || val.status === 2)){
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
                                var type = val.type===1?"办公区域":val.type===2?"公共区域":"未知";
                                html += '<li> <a class="header"  href="javascript:"> <img class="avatar" src="'+ server_uel_user_img + val.user.photo +'" alt="avatar"> <div class="information"> <div class="name">'+ val.user.name +'</div> <time>'+ val.createTime +'</time> </div> ' +
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
    this.listSearch = function(slef){
        keyword = $(slef).val();
        if($(slef).val().length > 0){
            $(".dropload-down").remove();   //清除暂无数据；
            $("#list").empty();            //清除列表数据;
            $(".sBox-wrapper").addClass("hei");

            this.repairList(pIdRepair,page,searchType,keyword);
        }else{
            $(".sBox-wrapper").removeClass("hei");
        }
    };
    this.listStatus = function(){
        var _this = this;
        $(document).on("click",".list-con div",function(){
            // 搜索类型 1：报修人 2：报修状态 3：服务地址 4：报修类型
            searchType = $(this).attr("data-id");
        });
        $(".back").click(function(){
            searchType = 1;  // 报修类型
        });
        $('.sBox-wrapper .cancel').tap(function(){
            //  清除搜索条件；
            keyword = "";
            _this.repairList();
        });
        $(document).on("click",".orders",function(){
            var self = $(this);
            //  接单；
            $.ajax({
                type:'post',
                url:  server_url_repair + server_v1 + '/repair/recept.json',
                data: {
                    "id":self.attr("data-id"),
                    "handlerId":userId
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 0){
                        if(data.data === true){
                            window.location.href = "repair_details.html?id="+ self.attr("data-id") +"";
                        }
                    }
                },
                error:function(data){
                    ErrorReminder(data);
                }
            })
        });
        $(document).on("click",".confirm",function(){
            var self = $(this);
            //  确认验收；
            $.ajax({
                type:'post',
                url:  server_url_repair + server_v1 + '/repair/checked.json',
                data: {
                    "id":self.attr("data-id")
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 0){
                        if(data.data === true){
                            window.location.href = "repair_details.html?id="+ self.attr("data-id") +"";
                        }
                    }
                },
                error:function(data){
                    ErrorReminder(data);
                }
            })
        })
    };
}




var tap = new DongSwitch();
function DongSwitch(){
    this.louDong = null;       //   保存数据；
    this.addressList = $("#addressList");   //  楼栋列表父级元素
}
DongSwitch.prototype = {
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

            var id = $("#addressList li.active").attr("data-id");
            var text = $(".statusList .active").text();
            //  如果是全部则显示为空；
            if($(".statusList .active").is(".all")){
                text = "";
            }
            //  判断id不为空；
            if(id){
                pIdRepair = id;
            }
            $(".dropload-down").remove();   //清除暂无数据；
            $("#list").empty();   //    清除列表数据;
            keyword = text;
            htmlAjax.repairList(pIdRepair,page,2,keyword);
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