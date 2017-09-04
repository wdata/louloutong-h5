/**
 * Created by Administrator on 2017/8/28.
 */
//  移交；
$(".carry").on("click",function(){
    var remark = $("#remark").text();
    var reason = $("#reason").text();
    if(!(reg.test(remark)|| remark === "") || !(reg.test(reason)|| reason === "")){
        var form = new FormData($("#newForm")[0]);       //需要是JS对象
        $.each(file,function(index,val){
            form.append("file",val);
        });
        form.append("id",urlParams("id"));
        form.append("userId",userId);
        form.append("reason",$("#reason").text());
        form.append("remark",remark);
        console.log(form);
        $.ajax({
            type:'post',
            url:  server_url_repair + server_v1 + '/repair/transferred.json',
            data: form,
            contentType: false,
            processData: false,
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
        showMask("移交原因,移交说明不能为空！");
    }
});