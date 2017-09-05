/**
 * Created by Administrator on 2017/9/5.
 */
$.ajax({
    type:'get',
    url:  server_url_notice + server_v1 + '/notify/'+ urlParams("id") +'/'+ userId +'.json',
    data: null,
    dataType:'json',
    success:function(data){
        if(data.code === 0 && data.data){
            $(".title").text(data.data.title);  // 标题；
            $(".name span").text(data.data.author.name);  // 发布人；
            $(".personal time").text(data.data.createTime);  //时间；
            $(".article").text(data.data.content);     //内容；
        }
    },
    error:function(data){ErrorReminder(data);}
});