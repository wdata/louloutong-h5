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

var auth_1 = authMethod("/llt/repair/list/button/sendOrders");
var auth_2 = authMethod("/llt/repair/list/button/sendAgain");
var auth_3 = authMethod("/llt/repair/list/button/check");
var auth_4 = authMethod("/llt/repair/list/button/orderReceive");
var auth_5 = authMethod("/llt/repair/list/button/handover");
var auth_6 = authMethod("/llt/repair/list/button/handle");
var auth_7 = authMethod("/llt/repair/list/button/revoke");

$(document).ready(function(){

   var htmlAjax = new HtmlAjax();
   htmlAjax.details();  //详情；
});


function HtmlAjax(){
    this.userId = userId;   // 用户ID；
    this.propertyId = propertyId;   // 物业ID；

    this.main = function(){
        this.details();
    };
    this.details = function(){
        var _this = this;
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/repair/'+ urlParams("id") +'.json',
            data: {
                "userId":_this.userId
            },
            dataType:'json',
            success:function(data){
                if(data.code === 0){
                    var status = '',img = '',operating = '';
                    var href = 'repair_details.html';
                    switch (data.data.status){
                        case 1:
                            //  如果是物业管理人员则显示未派单；如果是租户，则显示待受理；
                            if(auth_1){
                                status = '<div class="repair-status green">未派单</div>';
                                operating += '<a href="repair_sent.html?id='+ data.data.id +'" class="repair-operating single blue">派单</a>';
                            }else{
                                status = '<div class="repair-status green">待受理</div>';
                            }
                            //  有接单权限，可以接单；
                            if(auth_4){
                                operating += '<div class="repair-operating orders blue">接单</div>';
                            }
                            break;
                        case 2:
                            //  判断维修ID等于登录ID，则显示“给我的”派单；
                            if(data.data.handlerId === parseInt(userId)){
                                if(auth_1){
                                    status = '<div class="repair-status blue"><i class="mine-icon"></i>已派单</div>';
                                }else{
                                    status = '<div class="repair-status green">>待受理</div>';
                                }
                                //  有接单权限，可以接单；
                                if(auth_4){
                                    operating += '<div class="repair-operating orders blue">接单</div>';
                                }
                            }else{
                                if(auth_1){
                                    status = '<div class="repair-status blue">已派单</div>';
                                }else{
                                    status = '<div class="repair-status green">待受理</div>';
                                }
                            }
                            break;
                        case 3:
                            if(data.data.handlerId === null){
                                if(auth_2){
                                    status = '<div class="repair-status red">被移交</div>';
                                    operating += '<a href="repair_sent.html?id='+ data.data.id +'" class="repair-operating reappear blue">重新派单</a>';
                                    //  有接单权限，可以接单；
                                    if(auth_4){
                                        operating += '<div class="repair-operating orders blue">接单</div>';
                                    }
                                }else{
                                    status = '<div class="repair-status blue">已受理</div>';
                                }
                            }else{
                                status = '<div class="repair-status blue">已受理</div>';
                                if(auth_5){
                                    operating += '<div class="repair-operating transfer blue">移交</div>';
                                }
                                if(auth_6){
                                    operating += '<div class="repair-operating dealWith blue">填写处理</div>';
                                }
                            }
                            break;
                        case 4:
                            status = '<div class="repair-status green">待验收</div>';
                            if(auth_3){
                                operating += '<div class="repair-operating confirm yellow">确认验收</div>';
                            }
                            break;
                        case 5:status = '<div class="repair-status yellow">已确认</div>';
                            break;
                        case 6:
                            status = '<div class="repair-status gray">已撤销</div>';
                            href = 'repair_revoked_has.html';
                            break;
                    }
                    //  如果有撤销权限，切登录ID和发布ID相同，则可以撤销；
                    if(auth_7 && parseInt(userId) === data.data.user.id && (data.data.status === 1 || data.data.status === 2)){
                        operating += '<a href="repair_revoked.html?id='+ data.data.id +'" class="repair-operating cancel red">撤销</a>';
                    }
                    //<div class="repair-status green">未派单</div>
                    //<div class="repair-status red">被移交</div>
                    //<div class="repair-status gray">已撤销</div>
                    //<div class="repair-status green">待验收</div>
                    //<div class="repair-status blue">已派单</div>
                    //<div class="repair-status blue">已受理</div>
                    //<div class="repair-status yellow">已确认</div>

                    //<div class="repair-operating cancel red">撤销</div> 移交(transfer)
                    //<div class="repair-operating single blue">派单</div>，接单(orders)，填写处理(dealWith)
                    //<div class="repair-operating reappear blue">重新派单</div>
                    //<div class="repair-operating confirm yellow">确认验收</div>
                    if(data.data.repairImages){
                        $.each(data.data.repairImages,function(x,y){
                            img += '<img src="'+ server_url_img + y +'" alt="">';
                        })
                    }
                    var type = data.data.type===1?"办公区域":data.data.type===3?"公共区域":"未知";

                    var ss = $(".status>span");
                    var tr = $(".transparent");
                    var su = null; // 给顶部显示维修人员定位；
                    //  头部状态；
                    if(data.data.status >= 1){
                        ss.eq(0).addClass("active");
                        tr.eq(0).addClass("active");
                        if(data.data.status >= 3){

                            ss.eq(1).addClass("active");
                            tr.eq(1).addClass("active");
                            //  当已受理时，显示报修头像和报修人
                            $(".process").addClass("active");
                            su = "one";


                            if(data.data.status >= 4){
                                ss.eq(2).addClass("active");
                                tr.eq(2).addClass("active");
                                su = "two";
                                if(data.data.status >= 5){
                                    ss.eq(3).addClass("active");
                                    tr.eq(3).addClass("active");
                                    su = "three";
                                }
                            }
                        }
                    }
                    // 报修类型；
                    $("#type").html('<i></i>' + type);
                    //  可进行操作；
                    $("#set").empty().append(operating);
                    //  报修人;
                    $("#people").empty().append('<img class="avatar" src="'+ server_url_img + data.data.user.photo +'"> <div class="information"> <div class="name">'+ data.data.user.name +'</div> <time>'+ data.data.createTime +'</time> </div>');
                    //  订单状态；
                    $("#status").empty().append(status);
                    //  报修类型；
                    $("#aspect").text(data.data.repairItem);
                    //  报修内容;
                    $("#content").text(data.data.content);
                    //  图片；
                    $("#image").empty().append(img);
                    //  地址;
                    $("#property").text(data.data.property);
                    //  预约上门时间;
                    $("#reservation").text(data.data.bespeakTime);
                    //  期待完成时间;
                    $("#carryOut").text(data.data.expectTime);





                    //  已受理；以上会有维修人头像和名字：
                    var html = '';
                    if(data.data.handlerUsers.length > 1){
                        html = '<div class="most frame '+ su +'"> ' +
                            '<a class="service over"  href="javascript:?id='+ data.data.handlerUsers[1].id +'"><img class="avatar" src="'+ server_url_img + data.data.handlerUsers[1].photo +'" alt=""></a> ' +
                            '<a class="service" href="javascript:?id='+ data.data.handlerUsers[0].id +'"> <img class="avatar" src="'+ server_url_img + data.data.handlerUsers[0].photo +'" alt=""> <div class="concise"><p class="career">维修员</p><p>'+ data.data.handlerUsers[0].name +'</p></div> </a> </div>'
                    }else{
                        html = '<div class="odd-number frame '+ su +'"> <a class="service" href="javascript:?id='+ data.data.handlerUsers[0].id +'"> <img class="avatar" src="'+ server_url_img + data.data.handlerUsers[0].photo +'" alt=""> <div class="concise"><p class="career">维修员</p><p>'+ data.data.handlerUsers[0].name +'</p></div> </a> </div>'
                    }
                    $(".repair-man").empty().append(html);
                    //  显示
                    $("#pending").removeClass("hide");
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    }
}