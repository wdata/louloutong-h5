/**
 * Created by Administrator on 2017/8/29.
 */
function carry(){
    var reason = $("#remark").text();
    if(!(reg.test(reason)||reason === "")){
        if(imgBur){
            showMask("正在处理图片，请稍等！");
            return
        }
        var urls = [];
        $.each(fileData,function(index,val){
            urls.push(val.name);
        });
        $.ajax({
            type:'post',
            url:  server_url_repair + server_v1 + '/repair/inspect.json',
            data: {
                "urls":urls,
                "id":urlParams("id"),
                "userId":userId,
                "remark":reason
            },
            dataType:'json',
            traditional:true,
            success:function(data){
                if(data.code === 0){
                    if(data.data === true){
                        window.location.href = "repair_details.html?id="+ urlParams("id") +"";
                    }
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    }else{
        showMask("填写处理不能为空！");
    }
}