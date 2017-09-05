/**
 * Created by Administrator on 2017/8/18.
 */
//  显示评论和点赞按钮
$(".prompt").on("click",function(){
    $("#CLbutton").toggleClass("hide");
});
//  显示和隐藏评论输入框
$("#comment").on("click",function(){
    //  如果没有权限显示确认验收，则不修改；
    if(!$(".comment-box").is(".auth")){
        $(".confirm").toggleClass("hide");
        $(".comment-box").toggleClass("hide");
    }
});

//  1、如果从列表跳转进入例如：派单、填写处理页面，返回应该是列表；2、如果是详情页面跳转进入应该返回详情；
sessionStorage.setItem("repairJump",2);

var auth_1 = authMethod("/llt/repair/list/button/sendOrders");
var auth_2 = authMethod("/llt/repair/list/button/sendAgain");
var auth_3 = authMethod("/llt/repair/list/button/check");
var auth_4 = authMethod("/llt/repair/list/button/orderReceive");
var auth_5 = authMethod("/llt/repair/list/button/handover");
var auth_6 = authMethod("/llt/repair/list/button/handle");
var auth_7 = authMethod("/llt/repair/list/button/revoke");

$(document).ready(function(){
   htmlAjax.details();  //详情；
    htmlAjax.features(); // 接单和确认颜色操作；
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
                    var status = '',img = '',operating = '';
                    var color = ''; // 各种状态颜色；
                    var mi = '';  //  给我的；
                    var href = 'repair_details.html';
                    switch (data.data.status){
                        case 1:
                            color = "green";
                            //  如果是物业管理人员则显示未派单；如果是租户，则显示待受理；
                            if(auth_1){
                                operating += '<a href="repair_sent.html?id='+ data.data.id +'&status=1" class="repair-operating single blue">派单</a>';
                            }
                            //  有接单权限，可以接单；
                            if(auth_4){
                                operating += '<div data-id="'+ data.data.id +'" class="repair-operating orders blue">接单</div>';
                            }
                            break;
                        case 2:
                            //  判断维修ID等于登录ID，则显示“给我的”派单；
                            if(data.data.handlerId === parseInt(userId)){
                                mi = '<i class="mine-icon"></i>';
                                if(auth_1){
                                    color = "blue";
                                }else{
                                    color = "green";
                                }
                                //  有接单权限，可以接单；
                                if(auth_4){
                                    operating += '<div data-id="'+ data.data.id +'" class="repair-operating orders blue">接单</div>';
                                }
                            }else{
                                if(auth_1){
                                    color = "blue";
                                }else{
                                    color = "green";
                                }
                            }
                            break;
                        case 3:
                            color = "blue";
                            if(auth_5){
                                operating += '<a href="repair_transfer.html?id='+ data.data.id +'" class="repair-operating transfer blue">移交</a>';
                            }
                            if(auth_6){
                                operating += '<a href="repair_result.html?id='+ data.data.id +'" class="repair-operating dealWith blue">填写处理</a>';
                            }
                            break;
                        case 4:
                            color = "red";
                            //  有重新派单权限，可以派单；
                            if(auth_2){
                                operating += '<a href="repair_sent.html?id='+ data.data.id +'&status=2" class="repair-operating reappear blue">重新派单</a>';
                            }
                            //  有接单权限，可以接单；
                            if(auth_4){
                                operating += '<div data-id="'+ data.data.id +'" class="repair-operating orders blue">接单</div>';
                            }
                            break;
                        case 5:
                            color = "green";
                            if(auth_3 && parseInt(userId) === data.data.user.id){
                                //  只有在待验收情况下显示确认验收；详情中确认颜色显示在最下面；
                                // operating += '<div class="repair-operating confirm yellow">确认验收</div>';
                                $("#confirm").removeClass("hide").attr("data-id",data.data.id);
                                $(".hr-96").removeClass("hide");
                            }else if(auth_3 && data.data.type === 2 && parseInt(userId) !== data.data.handlerId){
                                // operating += '<div data-id="'+ val.id +'" class="repair-operating confirm yellow">确认验收</div>';
                                $("#confirm").removeClass("hide").attr("data-id",data.data.id);
                                $(".hr-96").removeClass("hide");
                            }else{
                                $(".comment-box").removeClass("hide").addClass("auth");
                                $(".hr-96").removeClass("hide");
                            }
                            break;
                        case 6:
                            $(".comment-box").removeClass("hide").addClass("auth");
                            $(".hr-96").removeClass("hide");
                            color = "yellow";
                            break;
                        case 7:
                            color = "gray";
                            href = 'repair_revoked_has.html';
                            $(".comment-box").removeClass("hide");
                            break;
                    }
                    //  如果有撤销权限，切登录ID和发布ID相同，则可以撤销；
                    if(auth_7 && parseInt(userId) === data.data.user.id && (data.data.status === 1 || data.data.status === 2)){
                        operating += '<a href="repair_revoked.html?id='+ data.data.id +'" class="repair-operating cancel red">撤销</a>';
                    }
                    status = '<div class="repair-status '+ color +'">'+ mi + data.data.statusName +'</div>';
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

                    var type = '';var address = "";
                    if(val.type === 1){
                        type = "办公区域";
                        address = val.address;
                    }else if(val.type === 2){
                        type = "公共区域";
                        address = val.publicAddress;
                    }
                    //  公共区域没有类型，时间等；
                    if(data.data.type ===2){
                        var ped = $("#pending ul li");
                        ped.eq(1).addClass("hide");
                        ped.eq(5).addClass("hide");
                        ped.eq(6).addClass("hide");
                    }


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

                            if(data.data.status >= 5){
                                ss.eq(2).addClass("active");
                                tr.eq(2).addClass("active");
                                su = "two";
                                //  显示点赞，评论，显示处理详情；
                                $(".result").removeClass("hide");
                                $(".con-main").removeClass("hide");

                                _this.comList();  //    评论；
                                _this.likeList();  //   点赞头像列表；
                                if(data.data.status >= 6){
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
                    $("#people").empty().append('<img class="avatar" src="'+ server_uel_user_img + data.data.user.photo +'"> <div class="information"> <div class="name">'+ data.data.user.name +'</div> <time>'+ data.data.createTime +'</time> </div>');
                    //  订单状态；
                    $("#status").empty().append(status);
                    //  报修类型；
                    $("#aspect").text(data.data.repairItem);
                    //  报修内容;
                    $("#content").text(data.data.content);
                    //  图片；
                    $("#image").empty().append(img);
                    //  地址;
                    $("#property").text(address);
                    //  预约上门时间;
                    $("#reservation").text(data.data.bespeakTime);
                    //  期待完成时间;
                    $("#carryOut").text(data.data.expectTime);





                    //  已受理；以上会有维修人头像和名字：
                    var html = '';
                    if(data.data.handlerUsers){
                        if(data.data.handlerUsers.length > 1){
                            html = '<div class="most frame '+ su +'"> ' +
                                '<a class="service over"  href="javascript:?id='+ data.data.handlerUsers[1].id +'"><img class="avatar" src="'+ server_uel_user_img + data.data.handlerUsers[1].photo +'" alt=""></a> ' +
                                '<a class="service" href="javascript:?id='+ data.data.handlerUsers[0].id +'"> <img class="avatar" src="'+ server_uel_user_img + data.data.handlerUsers[0].photo +'" alt=""> <div class="concise"><p class="career">维修员</p><p>'+ data.data.handlerUsers[0].name +'</p></div> </a> </div>'
                        }else{
                            html = '<div class="odd-number frame '+ su +'"> <a class="service" href="javascript:?id='+ data.data.handlerUsers[0].id +'"> <img class="avatar" src="'+ server_uel_user_img + data.data.handlerUsers[0].photo +'" alt=""> <div class="concise"><p class="career">维修员</p><p>'+ data.data.handlerUsers[0].name +'</p></div> </a> </div>'
                        }
                        $(".repair-man").empty().append(html);
                    }


                    //  待确认；
                    img = "";
                    if(data.data.repairRecordImages){
                        $.each(data.data.repairRecordImages,function(x,y){
                            img += '<img src="'+ server_url_img + y +'" alt="">';
                        });
                        $("#images").empty().append(img);
                    }
                    //  处理内容
                    $("#dealCon").text(data.data.remark);
                    //  处理时间；
                    $("#rRDate").text(data.data.repairRecordDate);

                    //  评论是否点赞；
                    if(data.data.isUpvote === true){
                        $(".like-btn").addClass("active");
                    }

                    //  显示
                    $("#pending").removeClass("hide");
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    };
    this.comList = function(){
        //  报修评论列表；
        var comment = 1;
        var dropload = $('.dataList').dropload({
            scrollArea : window,
            autoLoad:true,
            loadDownFn : function(me){
                //  获取报修列表
                $.ajax({
                    type:'get',
                    url:  server_url_repair + server_v1 + '/repairMessage/list.json',
                    data: {
                        "repairId":urlParams("id"),
                        "page":comment,
                        "size":5
                    },
                    dataType:'json',
                    success:function(data){
                        var html = '';
                        if(comment === 1 && data.code === 0 && data.data){
                            $(".comment").addClass("hide");   //没有评论时隐藏评论列表；
                        }
                        if(data.code === 0 && data.data){
                            $(".comment").removeClass("hide");   //有评论时显示评论列表；
                            $.each(data.data.items,function(index,val){
                                html += '<li> <a href="javascript:"><img class="small-avatar" src="'+ server_uel_user_img + val.user.photo +'" alt=""></a> <div class="inform"> <p class="name">'+ val.user.name +'</p> <time>'+ val.createTime +'</time> <div class="content">'+ val.content +'</div> </div> </li>';
                            });
                            $("#listCom").append(html);

                            comment++;
                            if(data.data.pageCount === 0){
                                me.lock();  //智能锁定，锁定上一次加载的方向
                                me.noData();      //无数据
                            }
                        }else{
                            me.lock();  //智能锁定，锁定上一次加载的方向
                            me.noData();      //无数据
                        }
                        me.resetload();    //数据加载玩重置
                    },
                    error:function(data){
                        ErrorReminder(data);
                        $(".comment").addClass("hide");   //没有评论时隐藏评论列表；
                        me.noData();      //无数据
                        me.resetload();    //数据加载玩重置
                    }
                })
            }
        });

    };
    this.releaseCom = function(){
        var _this = this;
        var con = $("#comCon").val();
        //  发布评论；
        if(!(reg.test(con)||con === "")){
            $.ajax({
                type:'post',
                url:  server_url_repair + server_v1 + '/repairMessage/add.json',
                data: {
                    "userId":userId,
                    "repairId":urlParams("id"),
                    "content":con
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 0){
                        if(data.data === true){
                            showMask("评论发布成功！");
                            $("#listCom").empty();
                            _this.comList();
                        }
                    }
                },
                error:function(data){
                    ErrorReminder(data);
                }
            })
        }else{
            showMask("评论不能为空！");
        }
    };
    this.releaseLike = function(self){
        var _this = this;
        //  判断是点赞，还是取消点赞；
        if($(self).is(".active")){
            //  取消点赞
            $.ajax({
                type:'post',
                url:  server_url_repair + server_v1 + '/repairBehaviour/delete.json',
                data: {
                    "userId":userId,
                    "repairId":urlParams("id"),
                    "type":1
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 0){
                        if(data.data === true){
                            $(self).removeClass("active");
                            _this.likeList();
                        }
                    }
                },
                error:function(data){
                    ErrorReminder(data);
                }
            })
        }else{
            //  点赞
            $.ajax({
                type:'post',
                url:  server_url_repair + server_v1 + '/repairBehaviour/add.json',
                data: {
                    "userId":userId,
                    "repairId":urlParams("id"),
                    "type":1
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 0){
                        if(data.data === true){
                            $(self).addClass("active");
                            _this.likeList();
                        }
                    }
                },
                error:function(data){
                    ErrorReminder(data);
                }
            })
        }
    };
    this.likeList = function(){
        //  点赞列表；
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/repairBehaviour/list.json',
            data: {
                "repairId":urlParams("id"),
                "page":1,
                "size":9
            },
            dataType:'json',
            success:function(data){
                var list = $("#likeList");
                var html = '';
                list.empty();
                if(data.code === 0 && data.data){
                    $(".like").removeClass("hide");   // 有点赞，显示点赞列表；
                    $.each(data.data.items,function(index,val){
                        html += '<a href="javascript:"><img class="small-avatar" src="'+ server_uel_user_img + val.user.photo +'" alt=""></a>';
                    });
                    list.append(html);
                }else{
                    $(".like").addClass("hide");   // 如果没有点赞，隐藏点赞列表；
                }
            },
            error:function(data){
                ErrorReminder(data);
                $(".like").addClass("hide");   // 如果没有点赞，隐藏点赞列表；
            }
        })
    }
    this.features = function(){
        $(document).on("click",".orders",function(){
            var self = $(this);
            //  接单；
            $.ajax({
                type:'post',
                url:  server_url_repair + server_v1 + '/repair/recept.json',
                data: {
                    "id":self.attr("data-id"),
                    "handlerId":userId
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 0){
                        if(data.data === true){
                            history.go(0); //   刷新页面；
                        }
                    }
                },
                error:function(data){
                    ErrorReminder(data);
                }
            })
        });
        $(document).on("click","#confirm",function(){
            var self = $(this);
            //  确认验收；
            $.ajax({
                type:'post',
                url:  server_url_repair + server_v1 + '/repair/checked.json',
                data: {
                    "id":self.attr("data-id")
                },
                dataType:'json',
                success:function(data){
                    if(data.code === 0){
                        if(data.data === true){
                            history.go(0); //   刷新页面；
                        }
                    }
                },
                error:function(data){
                    ErrorReminder(data);
                }
            })
        })
    }
}