/**
 * Created by Administrator on 2017/8/28.
 */
function revoked(){
    $.ajax({
        type:'post',
        url:  server_url_repair + server_v1 + '/repair/revoked.json',
        data: {
            "id":urlParams("id"),
            "userId":userId,
            "reason":$(".the-reason").text()
        },
        dataType:'json',
        success:function(data){
            if(data.code === 0){
                if(data.data === true){
                    window.location.href = "repair_revoked_has.html";
                }
            }
        },
        error:function(data){
            ErrorReminder(data);
        }
    });
}