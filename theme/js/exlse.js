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
    $(".sBox-wrapper").removeClass("hei");
})
//搜索内容输入即开始搜索
function searchList(){

}

// //  搜索框回车事件，调用搜索
//     searchId.keypress(function(e){
//         if(e.keyCode === 13) {
//             //  处理相关逻辑
//             callback();
//             //  禁止页面刷新
//             window.event.returnValue = false;
//         }
//     });


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