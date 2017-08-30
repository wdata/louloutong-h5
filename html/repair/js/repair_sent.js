/**
 * Created by Administrator on 2017/8/17.
 */
$(document).on("click",".head",function(){
    $(this).toggleClass("active")
        .siblings("ul").toggleClass("active");
});

//  获取接单人列表；
$.ajax({
    type:'get',
    url:  server_url_repair + server_v1 + '/user/list/maintainer.json',
    data: {
        "firmId":firmId
    },
    dataType:'json',
    success:function(data){
        var list = $("#sent-list");
        var html = '';
        list.empty();
        if(data.code === 0){
            $.each(data.data,function(index,val){
                html += '<li> <a href="javascript:"> <img class="avatar" src="'+ server_uel_user_img + val.photo +'" alt="avatar"> </a> <a data-id="'+ val.id +'" class="orders" href="javascript:"> <div class="information"> <div class="name">'+ val.name +'<span class="position">'+ val.duty[0] +'</span></div> <time>上班时间：08:00-23:00</time> <div class="picked-up">已有'+ val.count +'单</div> </div> </a> </li>'
            })
        }
        list.append('<div class="team"> <header class="head"><i class="shrink-icon"></i><div class="title">'+ data.data[0].orgName +'</div></header> <ul>'+ html +'</ul> </div>');
    },
    error:function(data){
        ErrorReminder(data);
    }
});


$(document).on("click",".orders",function(){
    var _this = $(this);
    var sum = '';
    if(urlParams("status") === "1"){
        sum = 'sendOrder';
    }else if(urlParams("status") === "2"){
        sum = 'sendAgain';
    }
   //   点击接单人派单；
    $.ajax({
        type:'post',
        url:  server_url_repair + server_v1 + '/repair/'+ sum +'.json',
        data: {
            "id":urlParams("id"),
            "handlerId":_this.attr("data-id")
        },
        dataType:'json',
        success:function(data){
            if(data.code === 0){
                if(data.data === true){
                    window.location.href = "repair_list.html";
                }
            }
        },
        error:function(data){
            ErrorReminder(data);
        }
    });
});