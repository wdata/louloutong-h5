/**
 * Created by Administrator on 2017/8/29.
 */
function carry(){
    var reason = $("#remark").text();
    if(!(reg.test(reason)||reason === "")){
        var form = new FormData($("#newForm")[0]);       //需要是JS对象
        $.each(file,function(index,val){
            form.append("files",val);
        });
        form.append("id",urlParams("id"));
        form.append("userId",userId);
        form.append("remark",reason);
        console.log(form);
        $.ajax({
            type:'post',
            url:  server_url_repair + server_v1 + '/repair/inspect.json',
            data: form,
            contentType: false,
            processData: false,
            success:function(data){
                if(data.code === 0){
                    if(data.data === true){
                        window.location.href = 'repair_list.html';
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