/**
 * Created by Administrator on 2017/9/9.
 */
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
        url:  server_zuui + server_v1 + '/file/uploads.json',
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