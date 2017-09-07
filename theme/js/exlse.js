/**
 * Created by Administrator on 2017/8/9.
 */

//  1、如果从列表跳转进入例如：派单、填写处理页面，返回应该是列表；2、如果是详情页面跳转进入应该返回详情；
// sessionStorage.setItem("repairJump",2);
var repairJump = parseInt(sessionStorage.getItem("repairJump"));


//显示
var ww=$(window).width();
function showEdit(_this){
    $('#editor_box').show();
    $(_this).hide();
}
function receiveShow(){
    $('.p-layout').css('transform','translateX(-'+ww+'px)');
}


function returnTran(){
    $('.p-layout').css('transform','translateX(0)');
}

$(document).ready(function(){
    var ww=$(window).width();

})

//搜索相关js
$('.search-main,.p-layout').width(ww*2);
$('.main-wrap,.tran-wrap,.tap-footer').width(ww);

$('#search_btn').focus(function(){
    $('.sBox-wrapper').addClass('active');
})
//点击关键字后
$('.sBox-wrapper .list-con .list').click(function(){
    $('#search_btn').attr('placeholder',$(this).text());
    $('.search-main').css('transform','translateX(-'+ww+'px)');
    $('.sBox-wrapper .top-search').addClass('active')
})
//取消回到列表页
$('.sBox-wrapper .cancel').click(function(){

    $("#search_btn").val("");
    $('.search-main').css('transform','translateX(0)');
    $('#search_btn').attr('placeholder','搜索').val('');
    $(".sBox-wrapper").removeClass("hei");
    // $('.sBox-wrapper,.sBox-wrapper .top-search').removeClass('active');
    // 因为重复绑定事件，会导致次事件在前，

});
//返回回到关键词页
$('.sBox-wrapper .top-search .back').click(function(){
    $('.search-main').css('transform','translateX(0)');
    $('.sBox-wrapper .top-search').removeClass('active');
    $('#search_btn').attr('placeholder','搜索');
    $(".sBox-wrapper").removeClass("hei");
})
//搜索内容输入即开始搜索
function searchList(){

}

// //  搜索框回车事件，调用搜索
//     searchId.keypress(function(e){
//         if(e.keyCode === 13) {
//             //  处理相关逻辑
//             callback();
//             //  禁止页面刷新
//             window.event.returnValue = false;
//         }
//     });



//  多图片上传
var fileData = [];var imgBur = false;  //如果图片正在上传则禁止发送请求；
function uploadPicture(_this){
    //新增，调用新增ajax
    var form = new FormData($("#newForm")[0]);       //需要是JS对象
    var html = '';
    var shoot = $("#shoot");
    $.each($(_this)[0].files,function(index,val){
        var img_ext = val.name.substring(val.name.length-3,val.name.length);
        var img_size = Math.floor((val.size)/1024);   //单位为KB
        if(img_ext !== "jpg" && img_ext !== "png"&& img_ext !== "gif"){
            console.log("已过滤不符合格式图片");
        }else if(img_size >  2048){
            console.log("已过滤不符合大小");
        }else{
            form.append("file",val);
            html += '<li><img src="'+ getObjectURL(_this.files[index]) +'" alt=""><i class="delete-icon"></i></li>';
        }
    });

    //  添加图片；
    $.ajax({
        type:'post',
        url:  server_core + server_v1 + '/file/uploads.json',
        data: form,
        contentType: false,
        processData: false,
        success:function(data){
            if(data.code === 0 && data.data){
                $.each(data.data,function(index,val){
                    fileData.push(val);
                })
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


    shoot.before(html);
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