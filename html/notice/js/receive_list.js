/**
 * Created by Administrator on 2017/8/9.
 */
//  tap导航切换
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


var judgment = sessionStorage.getItem("judgment");
switch(judgment){
    case "true":
        //  tap添加active样式
        $(".tap-unread").addClass("active")
            .siblings().removeClass("active");
        //  显示未读，隐藏已读
        $(".unread-list").removeClass("hide")
            .siblings(".receive-list").addClass('hide');
        break;
    case "false":
        $(".tap-have-read").addClass("active")
            .siblings().removeClass("active");
        $(".have-read-list").removeClass("hide")
            .siblings(".receive-list").addClass('hide');
        break;
}