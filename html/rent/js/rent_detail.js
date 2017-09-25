

var mySwiper = new Swiper ('.rent-swiper', {
        loop: true,
        pagination: '.swiper-pagination',
        autoplay: 1500,
        autoplayDisableOnInteraction: false
})        

$.ajax({
	type:'get',
	url:server_url+server_v1+'/rents/'+ obtain("rent_id") +'.json',
	dataType:'json',
	success:function(data){
		if(data.code === 0){
			$('.detail-tit span').text(data.data.title);
			$(".time").text(data.data.createTime.split(" ")[0]);
			$('#detail_price').text(data.data.price+data.data.unit);
			$('#detail_acreage').html(data.data.acreage+"m<sup>2</sup>");
			$('#detail_views').text(data.data.views);
			$('.detail_tips01').text(noTdA(data.data.houseType));
			$('.detail_tips02').text(noTdA(data.data.community));
			$('.detail_tips03').text(noTdA(data.data.direction));
			$('.detail_tips04').text(noTdA(data.data.traffic));
			$('.detail_tips05').text(noTdA(data.data.matingFacility));
			$('.detail_tips06').text(noTdA(data.data.section));
			$('.rentd-box04 .con').text(data.data.content);
			$('#name').text(data.data.contacter);
			if(data.data.phone){
				$('#phone').text(data.data.phone);
			}else{
				 $('.rent-bot .t-r a').addClass('gray');
			}
			if(data.data.status===1){                       //0为正常 1为下架
				$('.rent-bot').hide().siblings('.rent-bot-xj').show();
			}
			if(data.data.images.length>=1){
				$('.orent-swiper').show();
				var imgCode="";
				$.each(data.data.images,function(index,item){
					imgCode+= '<div class="swiper-slide"><figure><a href="'+ item.url +'" data-size="1024x1024" ><img src="'+ item.url +'" ></a><figcaption >rent pictures '+ (index + 1) +'</figcaption></figure></div>';

				});
				$('.orent-swiper .swiper-wrapper').html(imgCode);
				mySwiper.init()
			}else{
				$('.orent-swiper').hide();
			}

			// 求组和出租的不同；类型，1:出租，2:求租
			if(data.data.type === 2){
				$(".rentd-box03 ul li").eq(1).hide();
                $(".rentd-box03 ul li").eq(5).hide();
			}
			$(".main").removeClass("hide");
		}
	}
});

var i=0;
$('.rentd-box04 .tit .icon-w').click(function(){
	if(i%2==0){
		$('.rentd-box04 .con').css('height','auto');
	}else{
		$('.rentd-box04 .con').css('max-height','2.4rem');
	}
	i++;
})



function noTdA(elem){
    return elem?elem:"--";
}











