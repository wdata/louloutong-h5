/**
 * Created by Administrator on 2017/8/30.
 */
var auth_1 = authMethod("/llt/repair/list/button/sendOrders");
var auth_2 = authMethod("/llt/repair/list/button/sendAgain");
var auth_3 = authMethod("/llt/repair/list/button/check");
var auth_4 = authMethod("/llt/repair/list/button/orderReceive");
var auth_5 = authMethod("/llt/repair/list/button/handover");
var auth_6 = authMethod("/llt/repair/list/button/handle");
var auth_7 = authMethod("/llt/repair/list/button/revoke");

$(document).ready(function(){
    htmlAjax.details();  //详情；
});


var htmlAjax = new HtmlAjax();

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
                    var img = '',operating = '';

                    if(data.data.repairImages){
                        $.each(data.data.repairImages,function(x,y){
                            img += '<img src="'+ server_url_img + y +'" alt="">';
                        })
                    }
                    var type = data.data.type===1?"办公区域":data.data.type===3?"公共区域":"未知";
                    // 报修类型；
                    $("#type").html('<i></i>' + type);
                    //  可进行操作；
                    $("#set").empty().append(operating);
                    //  报修人;
                    $("#people").empty().append('<img class="avatar" src="'+ server_uel_user_img + data.data.user.photo +'"> <div class="information"> <div class="name">'+ data.data.user.name +'</div> <time>'+ data.data.createTime +'</time> </div>').attr("href",headJumps(dataD.user.id));
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

                    //  撤销原因：
                    $("#revoked").text(data.data.reason);


                    //  显示
                    $("#pending").removeClass("hide");
                    $(".revoked").removeClass("hide");
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    };
}