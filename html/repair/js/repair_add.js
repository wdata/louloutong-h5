/**
 * Created by Administrator on 2017/8/15.
 */



//  多图片上传
var file = [];
function uploadPicture(_this){
    var html = '';
    var shoot = $("#shoot");
    $.each($(_this)[0].files,function(index,val){
        var img_ext = val.name.substring(val.name.length-3,val.name.length);
        var img_size = Math.floor((val.size)/1024);   //单位为KB
        if(img_ext !== "jpg" && img_ext !== "png"&& img_ext !== "gif"){
            console.log("已过滤不符合格式图片");
        }else if(img_size >  2048){
            console.log("已过滤不符合大小");
        }else{
            file.push(val);
            html += '<li><img src="'+ getObjectURL(_this.files[index]) +'" alt=""><i class="delete-icon"></i></li>';
        }
    });
    shoot.before(html);
}
//  删除
$(document).on("click",".delete-icon",function(){
    var ind = $(this).parent().index();
    $(this).parent().remove();
    file.splice(ind, 1);//修改fileLists
    console.log(file);
});
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

//  下一步
function sumber(){
    // //新增，调用新增ajax
    // var form = new FormData($("#newForm")[0]);       //需要是JS对象
    // $.each(file,function(index,val){
    //     form.append("file",val);
    // });
    // $.ajax({
    //     type:'post',
    //     url: '/party-server-core/web/api/menus.json',
    //     data: form,
    //     contentType: false,
    //     processData: false,
    //     success:function(data){
    //
    //     },
    //     error:function(data){
    //         //报错提醒框
    //     }
    // });
}


$(document).ready(function(){

    htmlAjax.project();   //  获取报修项目；

    operating.OPevent();  // DOM事件；
    operating.OPtime();   // 时间插件；
    //  楼栋切换；
    var tap = new dongSwitch();
    tap.main();  // 调用总函数；
});
//  ajax请求获取数据和发布报修；
var htmlAjax = new HtmlAjax();
function HtmlAjax(){
    this.releaseRpr = function(){
        var form = new FormData($("#newForm")[0]);       //需要是JS对象
        $.each(file,function(index,val){
            form.append("files",val);
        });

        var type = $(".addType .active").attr("data-id");  //类型;
        var content = $("#box").html();                     //报修内容
        var bespeakTime = '',expectTime = '',repairItemId = '',repairAddressId = '';
        if(type === "1"){
            bespeakTime = $("#reservation").val();
            expectTime = $("#expected").val();
            repairItemId = $("#projectList .active").attr("data-id");
            repairAddressId = $("#ads").attr("data-id");

            form.append("bespeakTime",bespeakTime);              //   预约时间 当类型为2时，不必传
            form.append("expectTime",expectTime);                //   期望时间 当类型为2时，不必传
            form.append("repairItemId",repairItemId);            //   报修项目ID 当类型为2时，不必传
        }else if(type === "2"){
            repairAddressId = $("#service-address").attr("data-id");
        }
        //  判断是否为空！
        if(type === "1" && (!bespeakTime || !expectTime)){
            showMask("请选择预约和期望时间！");
            return;
        }
        if(!repairAddressId){
            showMask("请选择服务地址！");
            return;
        }
        console.log();
        if(reg.test(content) || content === ""){
            showMask("请输入报修内容！");
            return;
        }

        form.append("userId",userId);
        form.append("propertyId",propertyId);
        form.append("type",type);                             //   类型 1：办公区域 2：公共区域
        form.append("repairAddressId",repairAddressId);     //   报修地址ID
        form.append("content",content);                       //   报修内容


        $.ajax({
            type:'post',
            url:  server_url_repair + server_v1 + '/repair/add.json',
            data: form,
            contentType: false,
            processData: false,
            success:function(data){
                if(data.code === 0){
                    if(data.data === true){

                    }
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    };
    this.project = function(){
        //  获取报修项目；
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/repairItem/list.json',
            data: null,
            dataType:'json',
            success:function(data){
                var html = '';
                var pList = $("#projectList");
                pList.empty();
                if(data.code === 0){
                    $.each(data.data,function(index,val){
                        //  添加必选；
                        if(index === 0){
                            html += '<li class="active" data-id="'+ val.id +'">'+ val.name +'</li>';
                        }else{
                            html += '<li data-id="'+ val.id +'">'+ val.name +'</li>';
                        }
                    });
                    pList.append(html);
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
        //  服务地址;
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/repairAddress/list.json',
            data: {
                "userId":userId,
                "propertyId":propertyId
            },
            dataType:'json',
            success:function(data){
                var html = '';
                var aList = $(".addressList");
                aList.empty();
                if(data.code === 0){
                    $.each(data.data,function(index,val){
                        //  添加必选；
                        if(val.isDefault === 1){
                            html += '<li class="active"> <div data-id="'+ val.id +'" class="address">'+ val.address +'</div><div class="select"><i class="select-icon"></i>设为默认</div> </li>';
                            //  如果为默认，则默认显示在列表中；
                            $("#ads").text(val.address).attr("data-id",val.id);
                        }else{
                            html += '<li> <div data-id="'+ val.id +'" class="address">'+ val.address +'</div><div class="select"><i class="select-icon"></i>设为默认</div> </li>';
                        }
                    });
                    aList.append(html);
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        })
    };
    this.upDefault = function(self){
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/repairAddress/update.json',
            data: {
                "id":$(self).attr("data-id"),
                "isDefault":1
            },
            dataType:'json',
            success:function(data){
                if(data.code === 0){
                    if(data.data === true){
                        console.log("修改默认成功！");
                    }
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    }
}


//  HTML中DOM事件和时间插件；
var operating = new Operating();
function Operating(){

    this.OPevent = function(){
        //  报修类型和报修项目选择
        $(document).on("click",".repair-type li",function(){
            $(this).addClass("active").siblings("li").removeClass("active");

            //  如果为公共区域和办公区域
            if($(this).is(".office-area")){
                $(".officeArea").removeClass("hide");
                $(".next-step").removeClass("hide");
                $(".publicSub").addClass("hide");
                $(".publicArea").addClass("hide");
            }else if($(this).is(".public-area")){
                $(".officeArea").addClass("hide");
                $(".next-step").addClass("hide");
                $(".publicSub").removeClass("hide");
                $(".publicArea").removeClass("hide");
            }
        });
        //  请选择服务地址；
        $(".service-address").click(function(){
           $(".repair-add-switch").addClass("active");
        });

        //  服务地址默认地址切换
        $(document).on("click",".service li",function(){
            $(this).addClass("active")
                .siblings().removeClass("active");
            //  修改默认地址；
            if(!$(this).is(".ative")){
                htmlAjax.upDefault();
            }
        });
        //  服务地址选择；
        $("#address").on("click",function(){
            $(".repair-add").addClass("active");
            $(".service").addClass("active");
        });
        //  从服务页面返回输入页面；
        $("#addressReturn").on("click",function(){
            $(".repair-add").removeClass("active");
            $(".service").removeClass("active");

            $("#ads").text($(".addressList li.active .address").text()
                .attr("data-id",$(".addressList li.active").attr("data-id")));
        });
        //  下一步
        $(".next-step").on("click",function(){
            $(".first").addClass("active");
            $(".second").addClass("active");
            $(".project").text($("#projectList li.active").text());

        });
        //  返回上一步选择报修类型；
        $(".modify-icon").on("click",function(){
            $(".first").removeClass("active");
            $(".second").removeClass("active");
        });
    }
    this.OPtime = function(){
        //  时间插件
        var currYear = (new Date()).getFullYear();
        var opt={};
        opt.date = {preset : 'date'};
        opt.datetime = {preset : 'datetime'};
        opt.time = {preset : 'time'};
        opt.default = {
            theme: 'android-ics light', //皮肤样式
            display: 'modal', //显示方式
            mode: 'scroller', //日期选择模式
            dateFormat: 'yyyy-mm-dd',
            lang: 'zh',
            showNow: true,
            nowText: "今天",
            startYear: currYear, //开始年份
            endYear: currYear + 10 //结束年份
        };
        var optDateTime = $.extend(opt['datetime'], opt['default']);
        $("#reservation").mobiscroll(optDateTime).datetime(optDateTime);
        $("#expected").mobiscroll(optDateTime).datetime(optDateTime);
        //  自适应问题，所以根据HTML上的font-size来判断增加的padding
        var fontSize = parseInt($("html").css("font-size"));
        if(fontSize <= 32){
            $("body").addClass("active1")
        }
    }
}

function dongSwitch(){
    this.louDong = null;       //   保存数据；
    this.addressList = $("#addressList");   //  楼栋列表父级元素
}
dongSwitch.prototype = {
    constructor:dongSwitch,
    main:function(){
        this.dongAjax();     //  ajax事件获取数据，并将数据保存；
        this.dongSelect();   //  选择楼栋
        this.superior();      // 顶部导航重新选择同级楼栋；
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

            var a = $("#addressList li.active");
            var id = a.attr("data-id");
            var address = '';   //  服务地址；

            //  判断id不为空；
            if(id){
                $.each($("#prompt").siblings(),function(index,val){
                    address += $(val).text() + " ";
                });
                if(!(a.text() === "全部")){
                    address += a.text() + " ";
                }
                $(".service-address").addClass("active");
                $("#service-address").text(address).attr("data-id",id);
            }
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