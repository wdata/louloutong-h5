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
//  未读和已读跳转
$(".notice-list footer a").click(function(){
    if($(this).is(".unread")){
        sessionStorage.setItem("judgment",true);
    }
    if($(this).is(".have-read")){
        sessionStorage.setItem("judgment",false);
    }
});

//获取列表 状态 0->未读 1->已读
// function getList(status,page,size){
//     $.ajax({
//         type:'get',
//         url:'/api/v1/notify/list.json',
//         dataType:'json',
//         data:{'userId':'','propertyId':'','status':status,'page':1,'size':10;},
//         success:function(data){
//
//         }
//     })
// }






























