/**
 * Created by Administrator on 2017/8/18.
 */
//  显示评论和点赞按钮
$(".prompt").on("click",function(){
    $("#CLbutton").toggleClass("hide");
});
//  显示和隐藏评论输入框
$("#comment").on("click",function(){
    $(".confirm").toggleClass("hide");
    $(".comment-box").toggleClass("hide");
});
//  点赞和未点赞
$(".like-btn").on("click",function(){
    $(this).toggleClass("active");
});