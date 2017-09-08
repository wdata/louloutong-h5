var cur_ob=JSON.parse(sessionStorage.getItem('rent_ob'));

if(cur_ob.type=1){
	$('.header-title').text('出租详情');
}else{
	$('.header-title').text('求租详情');
}

var mySwiper = new Swiper ('.rent-swiper', {
        loop: true,
        pagination: '.swiper-pagination',
        autoplay: 1500,
        autoplayDisableOnInteraction: false
})        

$.ajax({
	type:'get',
	url:server_url+server_v1+'/rents/'+cur_ob.id+'.json',
	dataType:'json',
	success:function(data){
		if(data.code==0){
			$('.detail-tit').html(data.data.title+"<div class='time'>"+data.data.createTime+"</div>");
			$('#detail_price').text(data.data.price+data.data.unit);
			$('#detail_acreage').html(data.data.acreage+"m<sup>2</sup>");
			$('#detail_views').text(data.data.views);
			$('.detail_tips01').text(data.data.houseType);
			$('.detail_tips02').text(data.data.community);
			$('.detail_tips03').text(data.data.direction);
			$('.detail_tips04').text(data.data.traffic);
			$('.detail_tips05').text(data.data.matingFacility);
			$('.detail_tips06').text(data.data.section);
			$('.rentd-box04 .con').text(data.data.content);
			$('#name').text(data.data.contacter);
			if(data.data.phone){
				$('#phone').text(data.data.phone);
			}else{
				 $('.rent-bot .t-r a').addClass('gray');
			}
			if(data.data.status==1){                       //0为正常 1为下架
				$('.rent-bot').hide().siblings('.rent-bot-xj').show();
			}
			if(data.data.images.length>=1){
				$('.orent-swiper').show();
				var imgCode="";
				$.each(data.data.images,function(index,item){
					imgCode+=`
							<div class="swiper-slide"><a href=""><img src="${item.url}" alt=""></a></div>
							`;
				})
				$('.orent-swiper .swiper-wrapper').html(imgCode);
				mySwiper.init()
			}else{
				$('.orent-swiper').hide();
			}
		}
	}
})

var i=0;
$('.rentd-box04 .tit .icon-w').click(function(){
	if(i%2==0){
		$('.rentd-box04 .con').css('height','auto');
	}else{
		$('.rentd-box04 .con').css('max-height','2.4rem');
	}
	i++;
})














