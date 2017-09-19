/**
 * Created by Administrator on 2017/9/19.
 */
wxConfig(wx);       //微信授权

var wxImg = new Object({
    urls:[],
    local_url:[]
});
wxImg.imgUpload = function(){
    var _this=this;
    var i=0;
    wx.chooseImage({
        count: 8-_this.urls.length, // 默认9
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
        _this.setImg(_this.local_url[0].url);
        $('#pic_num').text(_this.urls.length);
        var code= '<div class="img-list"> <img src="'+ localId +'" alt=""> <i class="icon icon-del" onclick="wxImg.del(this)"></i> </div> ';
        $('.pic-wrap .pic-con .list-con').append(code);
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
                    success:function(res){
                        _this.urls.push({'num':i,'url':res.data.urls[0]});
                    }
                });
                if(localIds.length > 0){
                    syncUpload(localIds);
                }
            }
        });
    }
};
wxImg.del = function(cur){
    var _this=this;
    $(cur).parent().remove();
    $.each(_this.local_url,function(index,item){
        if(item.url ==$(cur).parent().find('img').attr('src')){
            _this.local_url.splice(index,1);
            $.each(_this.urls,function(i,t){
                if(t.num==item.num){
                    _this.urls.splice(i,1);
                }
            })
        }
    });
    if(_this.local_url.length>=1){
        _this.setImg(_this.local_url[0].url)
    }else{
        _this.setImg(default_img);
    }
};
wxImg.setImg = function(src){
    $('.issue .photo .img-wrap').html('<img src="'+ src +'" alt="" class="full">');
};
wxImg.init = function(){
    var _this=this;
    $('.issue .photo').click(function(){
        if(_this.local_url.length>=1){
            $('.pic-wrap').show();
            $('.sBox-wrapper,.tap-footer').addClass('z0');
        }else{
            _this.imgUpload();
        }
    });
    $('.pic-wrap .pic-con .add-list').click(function(){
        if(_this.local_url.length>=8){
            showMask('最多只能上传8张！');
            return false;
        }
        _this.imgUpload();
    });

    $('.pic-wrap .return').click(function(){
        $('.pic-wrap').hide();
        $('.sBox-wrapper,.tap-footer').removeClass('z0');
    })
};
wxImg.init();