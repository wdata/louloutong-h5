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
    operating.OPevent();  // DOM事件；
    operating.OPtime();   // 时间插件；
});

var operating = new Operating();
function Operating(){

    this.OPevent = function(){
        //  报修类型和报修项目选择
        $(".repair-type li").click(function(){
            $(this).addClass("active").siblings("li").removeClass("active");
        });
        //  服务地址默认地址切换
        $(document).on("click",".service li",function(){
            $(this).addClass("active")
                .siblings().removeClass("active");
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
        });
        //  下一步
        $(".next-step").on("click",function(){
            $(".first").addClass("active");
            $(".second").addClass("active");
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
            startYear: currYear - 10, //开始年份
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