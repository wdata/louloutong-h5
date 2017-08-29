/**
 * Created by Administrator on 2017/8/9.
 */
//显示
var ww=$(window).width();
function showEdit(_this){
    $('#editor_box').show();
    $(_this).hide();
}
function receiveShow(){
    $('.p-layout').css('transform','translateX(-'+ww+'px)');
}


function returnTran(){
    $('.p-layout').css('transform','translateX(0)');
}

$(document).ready(function(){
    var ww=$(window).width();

})

//搜索相关js
$('.search-main,.p-layout').width(ww*2);
$('.main-wrap,.tran-wrap,.tap-footer').width(ww);

$('#search_btn').focus(function(){
    $('.sBox-wrapper').addClass('active');
})
//点击关键字后
$('.sBox-wrapper .list-con .list').tap(function(){
    $('#search_btn').attr('placeholder',$(this).text());
    $('.search-main').css('transform','translateX(-'+ww+'px)');
    $('.sBox-wrapper .top-search').addClass('active')
})
//取消回到列表页
$('.sBox-wrapper .cancel').tap(function(){
    $('.search-main').css('transform','translateX(0)');
    $('.sBox-wrapper,.sBox-wrapper .top-search').removeClass('active');
    $('#search_btn').attr('placeholder','搜索').val('');
    $(".sBox-wrapper").removeClass("hei");
})
//返回回到关键词页
$('.sBox-wrapper .top-search .back').tap(function(){
    $('.search-main').css('transform','translateX(0)');
    $('.sBox-wrapper .top-search').removeClass('active');
    $('#search_btn').attr('placeholder','搜索');
})
//搜索内容输入即开始搜索
function searchList(){

}


//
// search(function(){
//     $(".list-ul").removeClass("hide");
//     $(".searching-range").addClass("hide");
//     $(".secondary").addClass("hide");
// });
//
// function search(callback){
//     var searchId = $(".search-enter");
// //  点击搜索，出现搜索页面
//     $("#search-btn").click(function(){
//         $(".level").addClass("active");
//         //  动画后执行
//         var time = setTimeout(function(){
//             //  动画执行玩后都要隐藏
//             $(".original").addClass("hide");
//             searchId.focus();  //   获取焦点
//             clearTimeout(time);
//         },600);
//     });
// //   点击隐藏隐藏搜索页面，并刷新列表数据！！！
//     $(".search-pop .features").click(function(){
//         // 判断是一级还是二级
//         if($(this).is(".range")){
//             //  先显示，在动画；
//             $(".original").removeClass("hide");
//             $(".search-module.level").removeClass("trans active");
//         }else{
//             $(".original").removeClass("hide");
//             $(".secondary").removeClass("active");
//             $(".search-module.level").addClass("hide");
//             $(".search-module.level").removeClass("trans active");
//             var time = setTimeout(function(){
//                 $(".search-module.level").removeClass("hide");
//                 $(".secondary").removeClass("trans");
//                 clearTimeout(time);
//             },600);
//         }
//         //  清空值
//         $(".search-enter").val("");
//         $(".search-module").find(".list-ul").addClass("hide");
//     });
// //  点击搜索指定范围，隐藏指定范围，并修改placeholder
//     $(".searching-range ul li").click(function(){
//         //  动画效果
//         $(".search-module.level").addClass("trans");
//         $(".search-module.secondary").addClass("trans active");
//
//         //  动画后执行
//         var time = setTimeout(function(){
//             searchId.focus();  //   获取焦点
//             clearTimeout(time);
//         },600);
//         searchId.attr("placeholder","搜索" + $(this).text());
//     });
//     $(".search-return").click(function(){
//         // 动画效果
//         $(".search-module.level").removeClass("trans");
//         $(".search-module.secondary").removeClass("trans");
//         //  动画后执行
//         var time = setTimeout(function(){
//             searchId.attr("placeholder","搜索");
//             clearTimeout(time);
//         },300);
//     });
// //  监听搜索框内容,并判断是显示搜索范围
//     searchId.on("input porpertychange",function(){
//         //    判断是全局搜索，还是范围搜索
//         if($(this).is(".range")){
//             if($(this).val().length <= 0){
//                 $(".searching-range").removeClass("hide");
//                 $(this).parents(".search-pop").siblings(".list-ul").addClass("hide");
//                 $(".secondary").removeClass("hide");
//             }else{
//                 $(".searching-range").addClass("hide");
//                 $(this).parents(".search-pop").siblings(".list-ul").removeClass("hide");
//                 $(".secondary").addClass("hide");
//             }
//         }else{
//             if($(this).val().length <= 0){
//                 $(".level").addClass("hide");
//                 $(this).parents(".search-pop").siblings(".list-ul").addClass("hide");
//             }else{
//                 $(".level").removeClass("hide");
//                 $(this).parents(".search-pop").siblings(".list-ul").removeClass("hide");
//             }
//         }
//     });
// //  搜索框回车事件，调用搜索
//     searchId.keypress(function(e){
//         if(e.keyCode === 13) {
//             //  处理相关逻辑
//             callback();
//             //  禁止页面刷新
//             window.event.returnValue = false;
//         }
//     });
// }


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