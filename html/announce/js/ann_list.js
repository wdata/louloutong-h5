/**
 * Created by Administrator on 2017/8/9.
 */
$(".tap a").click(function(){
    $(this).addClass("active")
        .siblings().removeClass("active");
    //  判断是不是未读
    if($(this).is(".tap-unread")){
        $(".unread-list").removeClass("hide")
            .siblings(".have-read-list").addClass("hide");
    }
    //  判断是不是已读
    if($(this).is(".tap-have-read")){
        $(".have-read-list").removeClass("hide")
            .siblings(".unread-list").addClass("hide");
    }
});