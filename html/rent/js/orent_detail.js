/*var cur_ob=JSON.parse(sessionStorage.getItem('rent_ob'));

if(cur_ob.type=1){
	$('.header-title').text('出租详情');
}else{
	$('.header-title').text('求租详情');
}*/

$.ajax({
	type:'get',
	url:server_url+server_v1+'/rents/'+cur_ob.id+'.json',
	dataType:'json',
	success:function(data){
		if(data.code==0){
			$('.detail-tit').html(data.data.title+"<div class='time'>"+data.data.createTime+"</div>");
			$('#detail_price').text(data.data.price);
			$('#detail_acreage').text(data.data.acreage);
			$('#detail_views').text(data.data.views);
			$('.detail_tips01').text(data.data.housType);
			$('.detail_tips02').text(data.data.housType);
			$('.detail_tips03').text(data.data.housType);
			$('.detail_tips04').text(data.data.housType);
			$('.detail_tips05').text(data.data.housType);



		}
	}
})


$('.rentd-box04 .tit .icon-w').click(function(){
	$('.rentd-box04 .con').css('height','auto');
})














