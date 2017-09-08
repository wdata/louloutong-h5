/**
 * Created by Administrator on 2017/8/9.
 */

//  1、如果从列表跳转进入例如：派单、填写处理页面，返回应该是列表；2、如果是详情页面跳转进入应该返回详情；
// sessionStorage.setItem("repairJump",2);
var repairJump = parseInt(sessionStorage.getItem("repairJump"));


//显示
var ww=$(window).width();
function showEdit(_this){
    $('#editor_box').show();
    $(_this).hide();
}
function receiveShow(){
    $('.p-layout').css('transform','translateX(-'+ww+'px)');
}


function returnTran(){
    $('.p-layout').css('transform','translateX(0)');
}

$(document).ready(function(){
    var ww=$(window).width();

})

//搜索相关js
$('.search-main,.p-layout').width(ww*2);
$('.main-wrap,.tran-wrap,.tap-footer').width(ww);

$('#search_btn').focus(function(){
    $('.sBox-wrapper').addClass('active');
})
//点击关键字后
$('.sBox-wrapper .list-con .list').click(function(){
    $('#search_btn').attr('placeholder',$(this).text());
    $('.search-main').css('transform','translateX(-'+ww+'px)');
    $('.sBox-wrapper .top-search').addClass('active')
})
//取消回到列表页
$('.sBox-wrapper .cancel').click(function(){
    $("#search_btn").val("");
    $('.search-main').css('transform','translateX(0)');
    $('#search_btn').attr('placeholder','搜索').val('');
    $(".sBox-wrapper").removeClass("hei").removeClass("heiA");
    // $('.sBox-wrapper,.sBox-wrapper .top-search').removeClass('active');
    // 因为重复绑定事件，会导致次事件在前，

});
//返回回到关键词页
$('.sBox-wrapper .top-search .back').click(function(){
    $('.search-main').css('transform','translateX(0)');
    $('.sBox-wrapper .top-search').removeClass('active');
    $('#search_btn').attr('placeholder','搜索');
    $(".sBox-wrapper").removeClass("hei");
})
//搜索内容输入即开始搜索
function searchList(){

}

// //  搜索框回车事件，调用搜索
//     searchId.keypress(function(e){
//         if(e.keyCode === 13) {
//             //  处理相关逻辑
//             callback();
//             //  禁止页面刷新
//             window.event.returnValue = false;
//         }
//     });



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
        url:  server_core + server_v1 + '/file/uploads.json',
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






// 微信图片上传；
wxConfig(wx);

var wxImg = new Object({
    urls:[],
    local_url:[]
})

wxImg.imgUpload = function(){
    var _this=this;
    var i=0;
    $('#pic_num').text(this.urls.length);
    wx.chooseImage({
        count: 8-this.urls.length, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            syncUpload(localIds);
        }
    })
    var syncUpload = function(localIds){
        i++;
        var localId = localIds.pop();
        _this.local_url.push({'num':i,'url':localId});
        _this.setImg(_this.local_url[0].url);
        var code=`
            <div class="img-list">
                <img src="${localId}" alt="">
                <i class="icon icon-del" onclick="wxImg.del(this)"></i>
            </div> 
            `;
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
                })
                if(localIds.length > 0){
                    syncUpload(localIds);
                }
            }
        });
    }
}
wxImg.del = function(cur){
    var _this=this;
    $(cur).parent().remove();
    var t_num;
    $.each(_this.local_url,function(index,item){
        if(item.url ==$(cur).parent().find('img').attr('src')){
            _this.local_url.splice(index,1);
            _this.urls.splice(index,1);
        }
    })
    if(_this.local_url.length>=1){
        _this.setImg(_this.local_url[0].url)
    }else{
        _this.setImg(default_img);
    }
}
wxImg.setImg = function(src){
    $('.issue .photo .img-wrap').html(`<img src="${src}" alt="" class="full">`);
}
wxImg.init = function(){
    var _this=this;
    $('.issue .photo').click(function(){
        if(_this.local_url.length>=1){
            $('.pic-wrap').show();
            $('.sBox-wrapper,.tap-footer').addClass('z0');
        }else{
            _this.imgUpload();
        }
    })
    $('.pic-wrap .pic-con .add-list').click(function(){
        if(_this.local_url.length>=8){
            showMask('最多只能上传8张！');
            return false;
        }
        _this.imgUpload();
    })

    $('.pic-wrap .return').click(function(){
        $('.pic-wrap').hide();
        $('.sBox-wrapper,.tap-footer').removeClass('z0');
    })
}
wxImg.init();
