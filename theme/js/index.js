/**
 * Created by Administrator on 2017/8/10.
 */

//  头部广告轮播
var advertising = new Swiper('.advertising', {
    autoplay: 1000,//可选选项，自动滑动
    loop:true,
    autoplayDisableOnInteraction:false
});
//  通知轮播
var noticeWord = new Swiper('.notice-word', {
    autoplay: 1000,//可选选项，自动滑动
    loop:true,
    direction:'vertical',
    autoplayDisableOnInteraction:false
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
                    var one = null;var sum = 1;
                    $.each(data.data,function(index,val){
                        //  如果parentId === null 则表示没有上一级，ajax只显示一级列表；
                        if(val.parentId === null){
                            html += '<li data-pid="'+ val.parentId +'" data-id = "'+ val.id +'"><i></i>'+ val.name +'</li>';
                            if(sum === 1){
                                one = val
                            }
                        }
                    });
                    _this.addressList.append(html);
                    _this.Default(one);    // 显示本地存储内楼栋名；
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
                    //  隐藏确定；
                    $("#determine").addClass("hide");


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
                }else{
                    // console.log("可以选择确定");
                    $("#determine").removeClass("hide");
                }

            }else{
                // console.log("没有下一级");
                $("#determine").removeClass("hide");
            }
        });
    },
    animation:function(){
        var _this = this;
        // 平移动画效果
        $(document).on("click","#address",function(){
            $(".index").addClass("active");
            $(".switch").addClass("active");
        });
        $(".switch .header-return,#determine").click(function(){
            $(".index").removeClass("active");
            $(".switch").removeClass("active");

            // console.log($(this).is("#determine"));
            //  判断是确定还是返回；
            var selected = $("#addressList li.active");
            if($(this).is("#determine")){
                var text = null;
                $.each(_this.louDong,function(index,val){
                    if(selected.attr("data-id") === val.id + ""){
                        text = val.name;
                    }
                });
                //  将物业ID存入本地存储；
                sessionStorage.setItem("propertyId",selected.attr("data-id"));
                sessionStorage.setItem("propertyName",text);
                //  修改首页顶部物业名
                $("#address").text(text);
                propertyId = sessionStorage.getItem("propertyId");
                var indexAjax = new IndexAjax(propertyId);
                indexAjax.main();
            }
        });
    },
    Default:function(data){
        //  判断sessionStorage存储的ID和name是否为空;
        var propertyId = sessionStorage.getItem("propertyId");
        var propertyName = sessionStorage.getItem("propertyName");
        if(propertyId && propertyName){
            $("#address").text(propertyName);
        }else{
            sessionStorage.setItem("propertyId",data.id);
            sessionStorage.setItem("propertyName",data.name);
        }
    },
    superior:function(){
        //  选择同级；
        var _this = this;
        $(document).on("click",".switch .nav li",function(){
            //  提示
            $(this).addClass("active")
                .siblings().removeClass("active");
            $("#determine").addClass("hide");

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
};


$(document).ready(function(){
    //  首页数据；
    var indexAjax = new IndexAjax(propertyId);
    indexAjax.main();
});

// 数据获取
function IndexAjax(proPertyId){
    this.userId = userId;   // 用户ID；
    this.propertyId = proPertyId;   // 物业ID；

    this.main = function(){
      this.authority();     //权限接口；
      this.prompt();        // 五个机制是否显示红点提示；
      this.noticeIndex();   // 通知列表；
      this.rvatIndex();     // 首页预约看房；
      this.repairIndex();   // 首页报修列表；
    };
    this.authority = function(){
        // 权限；
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/usercenter/'+ userId,
            data: null,
            dataType:'json',
            success:function(data){
                if(data.code === 0){
                    sessionStorage.setItem("authority",JSON.stringify(data.data));
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    },
    this.prompt = function(){
        // console.log(this.propertyId);
        // 五个机制是否显示红点提示；
        // 报修；
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/index/repair/count.json',
            data: {
                "userId":this.userId,
                "propertyId":this.propertyId
            },
            dataType:'json',
            success:function(data){
                if(data.code === 0){
                    if(data.data >= 0){
                        $(".features a").eq(2).find(".red-icon").show();
                    }
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    },
    this.noticeIndex = function(){
        // 通知列表；
        $.ajax({
            type:'get',
            url:  server_url_notice + server_v1 + '/notify/roll.json',
            data: {
                "userId":this.userId,
                "propertyId":this.propertyId
            },
            dataType:'json',
            success:function(data){
                var noticeIndex = $("#noticeIndex");
                var html = "";
                noticeIndex.empty();
                if(data.code === 0){
                    $.each(data.data,function(index,val){
                        html += '<div class="swiper-slide box-center"><a href="html/notice/notice_details.html?id='+ val.id +'">'+ val.title +'</a></div>';
                    })
                }
                noticeIndex.append(html);
                noticeWord.reLoop();   //   这个函数是重新计算swiper个数
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    };
    this.rvatIndex = function(){
        // 首页预约看房；
        $.ajax({
            type:'get',
            url:  server_rent + server_v1 + '/rentBespeaks/index.json',
            data: {
                "userId":this.userId,
                "page":page,
                "size":2
            },
            dataType:'json',
            success:function(data){
                var showings = $("#showings");
                var html = "";
                showings.empty();
                if(data.code === 0){
                    $.each(data.data.items,function(index,val){
                        var span = '';
                        // <!--标签有两种颜色：tag-green tag-gray-->
                        switch (val.allotStatus){
                            case 0:span = '<span class="tag-green tag">未分配</span>';
                                break;
                            case 1:span = '<span class="tag-green tag tag-gray">已分配</span>';
                                break;
                        }
                        html += '<li> <a class="overall" href="html/rent/order_detail.html?id='+ val.id +'"> <div class="introduction"> <div class="personal"> <img class="avatar" src="'+ server_uel_user_img + val.beseakUser.photo +'" alt="avatar"> <div class="information"> <div class="name">'+ val.beseakUser.name + span +'</div> <time>'+ val.createTime +'</time> </div> </div> ' +
                            '<article>'+ val.rentTitle +'</article><div class="showings-time"><i class="time-icon"></i>预约时间：<span>'+ val.bespeakTime +'</span></div> </div> <img class="cover" src="'+ server_url_img + val.imageUrl +'" alt=""></a> </li>';
                    })
                }
                showings.append(html);
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    };
    this.repairIndex = function(){
        // 首页报修列表；
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/index/repair/list.json',
            data: {
                "userId":this.userId,
                "propertyId":this.propertyId,
                "page":page,
                "size":2
            },
            dataType:'json',
            success:function(data){
                var repair = $("#repair");
                var html = '';
                repair.empty();
                if(data.code === 0){
                    $.each(data.data.items,function(index,val){
                        var span = '';
                        switch (val.status){
                            case 1:span = '<span class="tag-green tag">未派单</span>';
                                break;
                            case 2:span = '<span class="tag-gray tag">已派单</span>';
                                break;
                        }
                        var name = '',color = '';
                        switch (val.type){
                            case 1:name = "办公区域";color = 'blue';
                                break;
                            case 2:name = "公共区域";color = 'pluple';
                                break;
                        }

                        html += '<li> <a class="overall" href="html/repair/repair_details.html?id='+ val.id +'"><div class="introduction"><div class="personal"> <img class="avatar" src="'+ server_uel_user_img + val.user.photo +'" alt=""> <div class="information"> <div class="name">'+ val.user.name + span +'</div> <time>'+ val.createTime +'</time> </div> </div> ' +
                            '<div class="address"><i class="position-icon"></i>地址：<span>'+ val.property +'</span><div class="address-types '+ color +'"><span>'+ name +'</span></div></div> </div> <img class="cover" src="'+ server_url_img + val.repairImages[0] +'" alt=""> </a> </li>';
                    })
                }
                repair.append(html);
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    };
}












//  点击头像跳转
$(".personal").click(function(){
    window.location.href = "html/repair/repair_list.html";
    return false;
});


