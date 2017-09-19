var rent_modify=JSON.parse(sessionStorage.getItem('rent_modify'));

if(rent_modify.type===1){
	$('.diff-orent').hide();
    $('.diff-irent').show();
}else{
    $('.diff-orent').show();
    $('.diff-irent').hide();
}



$.ajax({
    type:'get',
    url:server_url + server_v1 + '/rents/'+ rent_modify.id + '.json',
    dataType:'json',
    success:function(data){
        if(data.code === 0){
            $(".elem-02").val(data.data.community); // 楼盘
            $(".elem-03").val(data.data.section); // 地段
            $(".elem-04").val(data.data.acreage); // 面积
            $(".elem-05").val(data.data.price); // 价格
            $(".elem-06").val(data.data.houseType); // 类型
            $('.elem-07').val(data.data.title);  // 标题
            $(".elem-08").val(data.data.content); // 描述
            $(".desc-con textarea").text(data.data.content);  // 描述
            $(".elem-09").val(data.data.contacter); // 联系人
            $(".elem-010").val(data.data.phone); //联系电话
            // 朝向;
            $.each($(".elem-11 input"),function(index,val){
                if($(val).siblings("label").text() === data.data.direction){
                    $(val).prop(true);
                }
            });
            // 交通;
            $.each($(".elem-12 input"),function(index,val){
                if($(val).siblings("label").text() === data.data.traffic){
                    $(val).prop(true);
                }
            });
            // 配套设施;
            $.each($(".elem-13 input"),function(index,val){
                if($(val).siblings("label").text() === data.data.matingFacility){
                    $(val).prop(true);
                }
            })
        }
    }
});











var modify = new Object({
	id:rent_modify.id, 
    type:rent_modify.type,                     //1出租   2求租
    userId:userId,
    acreage:null,
    price:null,
    propertyId:null,
    imgArr:[]
});
modify.update = function(){
	var p=$('.diff-orent .unit-choosed').html();
    var q=$('.diff-irent .unit-choosed').html();
    var unit=this.type==1?q:p;
    var picUrl=[];
    $.each(wxImg.urls,function(index,item){
        picUrl.push(item.url)
    });
	$.ajax({
		type:'post',
		url:server_rent+server_v1+'/rents/update.json',
		dataType:'json',
		traditional: true,  
		data:{
			'id':this.id,
			'type':this.type,
			'urls':picUrl,
            'userId':this.userId,
            'propertyId':$('#addressList li.active').data('id'),
            'community':$('.elem-02').val(),
            'section':$('.elem-03').val(),
            'acreage':this.acreage,
            'price':this.price,
            'unit':unit,
            'houseType':$('.elem-06').val(),
            'title':$('.elem-07').val(),
            'content':$('.elem-08').val(),
            'contacter':$('.elem-09').val(),
            'phone':$('.elem-10').val(),
            'direction':$(".elem-11 input[type=checkbox]:checked").siblings("label").text(),
            'traffic':$(".elem-12 input[type=checkbox]:checked").siblings("label").text(),
            'matingFacility':$(".elem-13 input[type=checkbox]:checked").siblings("label").text()
		},
		beforeSend:function(data){
            showMask('请求处理中！');
        },
        success:function(data){
            if(data.code === 0){
                closeMask();
                showMask('修改成功！');
                clearForm('#rent_form');    
            }
        }
	})
};
modify.tranBack = function(){
     $('.p-layout').css('transform','translateX(0)');
};
modify.event = function(){
	var _this=this;
	//选择单位
    $('.unit-con ul li').tap(function(){
        if(_this.type==1){
           $('.diff-irent .unit-choosed').html($(this).html()) 
        }else{
           $('.diff-orent .unit-choosed').html($(this).html())  
        }
        _this.tranBack();
    });
	$('.submit-btn').tap(function(){
	    _this.acreage=($('.diff-orent .elem-04').val())?$('.diff-orent .elem-04').val():$('.diff-irent .elem-04').val();
	    var m=$('.diff-orent .elem-05').val();
	    var n=$('.diff-irent .elem-05').val();
	    _this.price=(m)?m:n;
	    if(!$('#addressList li.active').data('id'))                                     { showMask('请选择区域！'); return false; }
	    if(!_this.acreage)                                                              { showMask('请填写面积！'); return false; }
	    if(!_this.price)                                                                { showMask('请填写租金！'); return false; }
	    if(!$('.elem-06').val())                                                        { showMask('请填写类型！'); return false; }
	    if(!($('.elem-07').val().length>=8 && $('.elem-07').val().length<=18))          { showMask('请填写标题，且在8-28个字之间！'); return false; }
	    if(!$('.elem-08').val().length>=10)                                             { showMask('请填写描述！'); return false; }
	    if(!$('.elem-09').val().length>=2)                                              { showMask('请填写联系人，且至少2字！'); return false; }
	    if(!$('.elem-10').val())                                                        { showMask('请填写手机号！'); return false; }
	    if(!checkMobile($('.elem-10').val()))                                           { showMask('手机号格式错误！'); return false; }
	    if($('.elem-02').val()){
	        if(!($('.elem-02').val().length>=2 && $('.elem-07').val().length<=30))      { showMask('所填写楼盘字数应为2-30个字'); return false; }
	    }
	    if($('.elem-03').val()){
	        if(!($('.elem-03').val().length>=2 && $('.elem-03').val().length<=12))      { showMask('所填写地段字数应为2-12个字'); return false; }
	    }
	    _this.update()
	})
};

modify.event();

// var wxImg = new Object({
//     urls:[],
//     local_url:[]
// })
// wxImg.imgUpload = function(){
//     var _this=this;
//     var i=0;
//     wx.chooseImage({
//         count: 8-this.urls.length, // 默认9
//         sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
//         sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
//         success: function (res) {
//             var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
//             syncUpload(localIds);
//         }
//     })
//     var syncUpload = function(localIds){
//         i++;
//         var localId = localIds.pop();
//         _this.local_url.push({'num':i,'url':localId});
//         _this.setImg(_this.local_url[0].url);
//         _this.setLocalImg(localId);
//         $('#pic_num').text(_this.local_url.length);
//         wx.uploadImage({
//             localId: localId,
//             isShowProgressTips: 1,
//             success: function (res) {
//                 var serverId = res.serverId; // 返回图片的服务器端ID
//                 $.ajax({
//                     type:'post',
//                     url:'/weixin/downloadImage',
//                     dataType:'json',
//                     data:{
//                         mediaIds:serverId
//                     },
//                     success:function(res){
//                         _this.urls.push({'num':i,'url':res.data.urls[0]});
//                     }
//                 })
//                 if(localIds.length > 0){
//                     syncUpload(localIds);
//                 }
//             }
//         });
//     }
// }
// wxImg.del = function(cur){
//     var _this=this;
//     $(cur).parent().remove();
//     var t_num;
//     $.each(_this.local_url,function(index,item){
//         if(item.url ==$(cur).parent().find('img').attr('src')){
//             _this.local_url.splice(index,1);
//             $.each(_this.urls,function(i,t){
//             	if(t.num==item.num){
//             		_this.urls.splice(i,1);
//             	}
//             })
//
//         }
//     })
//
//     if(_this.local_url.length>=1){
//         _this.setImg(_this.local_url[0].url)
//     }else{
//         _this.setImg(default_img);
//     }
// }
// wxImg.setImg = function(src){
//     $('.issue .photo .img-wrap').html(`<img src="${src}" alt="" class="full">`);
// }
// wxImg.setLocalImg = function(src){
// 	var code=`
//             <div class="img-list">
//                 <img src="${src}" alt="">
//                 <i class="icon icon-del" onclick="wxImg.del(this)"></i>
//             </div>
//             `;
//     $('.pic-wrap .pic-con .list-con').append(code);
// }
// wxImg.init = function(){
//     var _this=this;
//     $('.issue .photo').click(function(){
//         if(_this.local_url.length>=1){
//             $('.pic-wrap').show();
//             $('.sBox-wrapper,.tap-footer').addClass('z0');
//         }else{
//            _this.imgUpload();
//         }
//     })
//     $('.pic-wrap .pic-con .add-list').click(function(){
//         if(_this.local_url.length>=8){
//             showMask('最多只能上传8张！');
//             return false;
//         }
//         _this.imgUpload();
//     })
//
//     $('.pic-wrap .return').click(function(){
//         $('.pic-wrap').hide();
//         $('.sBox-wrapper,.tap-footer').removeClass('z0');
//     })
// }
// wxImg.init();



