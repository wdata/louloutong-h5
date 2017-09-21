/**
 * Created by Administrator on 2017/9/9.
 */
/*
*  微信上传图片接口，主要用在：报修模块；
* */


// 微信图片上传；
wxConfig(wx);

var wxImg = new Object({
    "fileData":[],          // 记录返回的图片名；
    "local_url":[],    // 记录上传给微信的数据；
    "imgBur":false
});

wxImg.imgUpload = function(){
    var _this = this;
    var i = 0;
    $('#pic_num').text(this.fileData.length);
    console.log(8 - this.fileData.length);
    wx.chooseImage({
        count: 8 - this.fileData.length, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            syncUpload(localIds);
        }
    });
    var syncUpload = function(localIds){
        i++;
        var localId = localIds.pop();
        _this.local_url.push({'num':i,'url':localId});

        wx.uploadImage({
            localId: localId,
            isShowProgressTips: 1,
            success: function (res) {
                var serverId = res.serverId; // 返回图片的服务器端ID
                $.ajax({
                    type:'post',
                    url:'/weixin/downloadImage',
                    dataType:'json',
                    data:{
                        mediaIds:serverId
                    },
                    success:function(data){
                        _this.fileData.push({'num':i,'url':data.data.urls[0]});
                        // 显示图片
                        var code = '<li><img src="'+ localId +'" alt=""><i data-name="'+ data.data.urls[0] +'" class="delete-icon"></i></li>';
                        $('#shoot').parent().prepend(code);

                        // 公告添加图片有所不同
                        var box = $("#editor_box");
                        if(box.length > 0){
                          var bxHtml =  '<img src="'+ data.data.domain + data.data.urls[0] +'" alt="">';
                          box.append(bxHtml);
                        }

                    },
                    beforeSend:function(){
                        wxImg.imgBur = true;
                    },
                    complete:function(){
                        wxImg.imgBur = false;
                    },
                    error:function(data){
                        ErrorReminder(data);
                    }
                });
                if(localIds.length > 0){
                    syncUpload(localIds);
                }
            }
        });
    };
};
wxImg.init = function(){
    var _this = this;
    //  上传图片；
    $('.imgUploadWX').click(function(){
        _this.imgUpload();  // 调用微信接口，选择图片，上传图片；
    });
    //  删除图片
    $(document).on("click",".delete-icon",function(){
        var self = this;
        var ind = $(this).parent().index();
        var name = $(this).attr("data-name");
        if(wxImg.imgBur){
            showMask("正在处理中！");
            return
        }
        //  删除图片；
        $.ajax({
            type:'post',
            url:  server_core + server_v1 + '/file/delete.json',
            data: {
                "name":name
            },
            dataType:'json',
            success:function(data){
                if(data.code === 0 && data.message === "SUCCESS"){
                    $(self).parent().remove();
                    _this.fileData.splice(ind,1); //删除呗删除图片数据；
                }
            },
            beforeSend:function(){
                wxImg.imgBur = true;
            },
            complete:function(){
                wxImg.imgBur = false;
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    });
};
wxImg.init();