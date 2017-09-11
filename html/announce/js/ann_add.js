$(document).ready(function(){
	var u=$(window).width()>750?54:$(window).width()/10;
	var ww=$(window).width();
	var wh=$(window).height();
	$('.publish-add-box').css('height',wh-$('.return-column').height()-$('.add-bot').height());
    $('#editor_box').css('min-height',wh-$('.return-column').height()-$('.publish-add-box .tt').height()-$('.add-bot').height()-u);
	$('.receive-box .list-con').height(wh-$('.search').height()-$('.return-column').height());
	$('.publish-box,.receive-box,.return-column').width(ww);
});
// $(function () {
//     "use strict";
//     $('#editor_box').artEditor({
//         imgTar: '#imageUpload',
//         limitSize: 5,   // 兆
//         showServer: false,
//         uploadUrl: '',
//         data: {},
//         uploadField: 'image',
//         breaks: false,
//         placeholader: '添加正文',
//         validHtml: ["<br/>"],
//         formInputId: 'target',
//         uploadSuccess: function (res) {
//             // 这里是处理返回数据业务逻辑的地方
//             // `res`为服务器返回`status==200`的`response`
//             // 如果这里`return <path>`将会以`<img src='path'>`的形式插入到页面
//             // 如果发现`res`不符合业务逻辑
//             // 比如后台告诉你这张图片不对劲
//             // 麻烦返回 `false`
//             // 当然如果`showServer==false`
//             // 无所谓咯
//             var result = JSON.parse(res)
//             if (result['code'] == '100') {
//                 return result['data']['url'];
//             } else {
//                 switch (result['code']) {
//                     case '101': {
//                         alert('图片太大之类的')
//                     }
//                 }
//             }
//             return false;
//         },
//         uploadError: function (status, error) {
//             //这里做上传失败的操作
//             //也就是http返回码非200的时候
//             alert('网络异常' + status)
//         }
//     });
// });





//选择接收人之后
function rePublish(){
    $('.p-layout').css('transform','translateX(0)');
    var recei_str="";
    var recei_num=0;
    $('input[type=checkbox]:checked').each(function(){
        recei_str+=$(this).parents('.list').find('.tit').text()+',';
        recei_num++;
    })
    if(recei_str){
        $('#recei_comp').text(recei_str);
        $('.icon-wrap').addClass('cblue').html('共'+recei_num+'个接收人');
    }else{
        $('#recei_comp').text('全部企业'); 
        $('.icon-wrap').removeClass('cblue').html("选择接收人<i class='icon icon-in'></i>");
    }
}


//  多图片上传
var fileData = [];var imgBur = false;  //如果图片正在上传则禁止发送请求；
function uploadPicture(_this){
    //新增，调用新增ajax
    var form = new FormData($("#newForm")[0]);       //需要是JS对象
    var html = '';
    var shoot = $("#editor_box");
    $.each($(_this)[0].files,function(index,val){
        var img_ext = val.name.substring(val.name.length-3,val.name.length);
        var img_size = Math.floor((val.size)/1024);   //单位为KB
        if(img_ext !== "jpg" && img_ext !== "png"&& img_ext !== "gif"){
            console.log("已过滤不符合格式图片");
        }else if(img_size >  2048){
            console.log("已过滤不符合大小");
        }else{
            form.append("file",val);
        }
    });

    //  添加图片；
    $.ajax({
        type:'post',
        url:  server_zuui + server_v1 + '/file/uploads.json',
        data: form,
        contentType: false,
        processData: false,
        success:function(data){
            if(data.code === 0 && data.data){
                $.each(data.data,function(index,val){
                    fileData.push(val);
                    html += '<img src="'+ val.domain+ val.url +'" alt="">';
                });
                shoot.append(html);
            }else{
                showMask("文件太大了！");
            }
        },
        beforeSend:function(){
            imgBur = true;
        },
        complete:function(){
            imgBur = false;
        },
        error:function(data){
            ErrorReminder(data);
        }
    });


}
//  删除
$(document).on("click",".delete-icon",function(){
    var ind = $(this).parent().index();
    //  删除图片；
    $.ajax({
        type:'post',
        url:  server_core + server_v1 + '/file/delete.json',
        data: {
            "name":"name"
        },
        dataType:'json',
        success:function(data){
            if(data.code === 0 && data.message === "SUCCESS"){
                $(this).parent().remove();
                fileData.splice(ind,1); //删除呗删除图片数据；
            }
        },
        beforeSend:function(){
            imgBur = true;
        },
        complete:function(){
            imgBur = false;
        },
        error:function(data){
            ErrorReminder(data);
        }
    });
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







function release(){
    var title = $("#title").val();

    if(title.length < 4){
        showMask("请输入长度大于4个字符的标题！");
        return;
    }
    if($(".placeholader").length === 1){
        showMask("请输入正文！");
        return;
    }
    if($(".firmIds:checked").length <= 0){
        showMask("请选择接收人！");
        return;
    }

    $("#content").val($("#editor_box").html());

    var form = new FormData($("#newForm")[0]);       //需要是JS对象
    var firmIds = "";
    $.each($(".firmIds:checked"),function(x,y){
        if(x === 0){
            firmIds += $(y).attr("data-id");
        }else{
            firmIds += "," + $(y).attr("data-id");
        }
    });


    form.append("propertyId",propertyId);
    form.append("userId",userId);
    form.append("title",title);
    form.append("content",$("#editor_box").html());
    form.append("firmIds",firmIds);

    $.ajax({
        type:'post',
        url:  server_url_notice + server_v1 + '/notice.json',
        data: form,
        contentType: false,
        processData: false,
        success:function(data){
            if(data.code === 0 && data.message === "SUCCESS"){
                window.location.href = "ann_list.html";
            }
        },
        error:function(data){ErrorReminder(data);}
    });
}

//  入驻企业；
var dataList = [];
$.ajax({
    type:'get',
    url:  server_url_repair + server_v1 + '/propertyFirms/'+ 2 +'.json',
    data: null,
    dataType:'json',
    success:function(data){
        var list = $(".list-con");
        var html = '';
        $(".list-top").siblings().remove();  //清除元素
        if(data.code === 0 && data.data){
            $.each(data.data,function(index,val){
                html += '<div class="list"> <div class="tx fl"><img src="../../images/icon/photo.png" alt="" class="full"></div> <div class="tit fl">'+ val.name +'</div> <div class="check-box fr"> <input class="firmIds " data-id="'+ val.id +'" type="checkbox" /> <label for=""></label> </div> <div class="clear"></div> </div>'
            });
            dataList = data.data;
            list.append(html);
        }
    },
    error:function(data){ErrorReminder(data);}
});


// 搜索接收人
function dataFilter(_this){
    processing($(_this).val());
}
$(document).keypress(function(e){
    if(e.keyCode === 13) {
        //  处理相关逻辑
        processing($('#search').val());
        //  禁止页面刷新
        window.event.returnValue = false;
    }
});
function processing(data){
    //  如果搜索内容和公司名像匹配，则显示；其他则隐藏；
    $.each($(".list-top").siblings(),function(index,val){
        if($(val).find(".tit").text().match(data)){
            $(val).show();
        }else{
            $(val).hide();
        }
    })
}














