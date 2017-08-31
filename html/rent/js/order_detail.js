var order_id=sessionStorage.getItem('order_id');

$.ajax({
	type:'get',
	url:server_url+server_v1+'/rents/'+order_id+'.json',
	dataType:'json',
	success:function(data){
		if(data.code==0){
			
		}
	}
})















