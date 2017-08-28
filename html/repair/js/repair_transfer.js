/**
 * Created by Administrator on 2017/8/28.
 */
//  移交；
$(".carry").on("click",function(){
    var form = new FormData($("#newForm")[0]);       //需要是JS对象
    $.each(file,function(index,val){
        form.append("file",val);
    });
    form.append("id",urlParams("id"));
    form.append("userId",userId);
    form.append("reason",$("#reason").text());
    form.append("remark",$("#remark").text());
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
                    // window.location.href = 'repair_list.html';
                }
            }
        },
        error:function(data){
            ErrorReminder(data);
        }
    });
});