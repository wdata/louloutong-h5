$(document).ready(function(){
	var u=$(window).width()>750?54:$(window).width()/10;
	var ww=$(window).width();
	var wh=$(window).height();
	$('.publish-add-box').css('height',wh-$('.return-column').height()-$('.add-bot').height());
    $('#editor_box').css('min-height',wh-$('.return-column').height()-$('.publish-add-box .tt').height()-$('.add-bot').height()-u);
	$('.receive-box .list-con').height(wh-$('.search').height()-$('.return-column').height());
	$('.publish-box,.receive-box,.return-column').width(ww);
})
$(function () {
    "use strict";
    $('#editor_box').artEditor({
        imgTar: '#imageUpload',
        limitSize: 5,   // 兆
        showServer: false,
        uploadUrl: '',
        data: {},
        uploadField: 'image',
        breaks: false,
        placeholader: '添加正文',
        validHtml: ["<br/>"],
        formInputId: 'target',
        uploadSuccess: function (res) {
            // 这里是处理返回数据业务逻辑的地方
            // `res`为服务器返回`status==200`的`response`
            // 如果这里`return <path>`将会以`<img src='path'>`的形式插入到页面
            // 如果发现`res`不符合业务逻辑
            // 比如后台告诉你这张图片不对劲
            // 麻烦返回 `false`
            // 当然如果`showServer==false`
            // 无所谓咯
            var result = JSON.parse(res)
            if (result['code'] == '100') {
                return result['data']['url'];
            } else {
                switch (result['code']) {
                    case '101': {
                        alert('图片太大之类的')
                    }
                }
            }
            return false;
        },
        uploadError: function (status, error) {
            //这里做上传失败的操作
            //也就是http返回码非200的时候
            alert('网络异常' + status)
        }
    });
});
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

function sub(){
    var elem=new FormData($('#form')[0]);
    $.ajax({
        type:'post',
        url:'/im/user/upload',
        processData:false,
        contentType:false,
        data:elem,
        success:function(data){

        }
    })   
}




/*var form = new FormData($("#newForm")[0]);
        $.ajax({
            type:'post',
            url:  DMBserver_image_url + '/party-app-server/web/api/activity/add.json',
            data:form,
            contentType: false,
            processData: false,
            success:function(data){
                if(data.code === 0){
                    returnMessage(1,'添加成功');
                }else{
                    returnMessage(2,data.message);
                }
            },*/


















