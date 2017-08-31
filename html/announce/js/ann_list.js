/**
 * Created by Administrator on 2017/8/9.
 */
var itemIndex = 1;



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


function HtmlAjax(){
    this.main = function(){

        var comment = 1;
        var dropload = $(".list").dropload({
            scrollArea : $(".list"),
            autoLoad:true,
            loadDownFn : function(me){
                //  获取报修列表

            }
        });
    };
    this.listAjax = function(me,comment,status,tapSwitch){
        $.ajax({
            type:'get',
            url:  server_url_notice + server_v1 + '/repair/notice/list.json',
            data: {
                "userId":userId,
                "propertyId":propertyId,
                "status":status,
                "page":comment,
                "size":10
            },
            dataType:'json',
            success:function(data){
                var list = $("#list");
                var html = '';
                if(data.code === 0 && data.data){
                    $.each(data.data.items,function(index,val){

                    });
                    list.append(html);
                    comment ++;
                    if(data.data.pageCount === 0){
                        me.lock();  //智能锁定，锁定上一次加载的方向
                        me.noData();      //无数据
                        tapSwitch = true;
                    }
                }else{
                    me.lock();  //智能锁定，锁定上一次加载的方向
                    me.noData();      //无数据
                    tapSwitch = true;
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
}