var order_id=sessionStorage.getItem('order_id');
var auth_sum=sessionStorage.getItem('authority');
var auth_2=false;  			                  //预约显示状态_未分配/已分配 
if(auth_sum.indexOf('/llt/click/rent/showModel/click/assignorno')>0) 		auth_2=true;

function dayTran(date){
	if(date){
		return date.substring(2,9).replace('-','/').replace('-','/');
	}else{
		return null;
	}
}
	
function hourTran(date){
	if(date){
		return date.substring(11,date.length);
	}else{
		return null;
	}
}
$.ajax({
	type:'get',
	url:server_url+server_v1+'/rents/bespeak/'+18+'.json',
	dataType:'json',
	success:function(res){
		if(res.code==0){ 
            $('.rent-list-con .top .t-l .tx img').attr('src',imgDefault(res.data.user.photo,default_tx));
            $('.rent-list-con .top .t-l .txt .tit').text(res.data.user.name);
            $('.rent-list-con .top .t-l .txt .time').text(res.data.createTime);
            $('.rent-list-con .list .mid .word').text(res.data.title);
            $('.rent-list-con .list .mid .price').text(res.data.price+res.data.unit);
            var imgCode="";
            if(res.data.images.length>1){
                for(var i=0;i<res.data.images.length;i++){
                    imgCode+=`
                            <div class="pic-w fl">
                                <img src="${server_url_img+res.data.images[i].url}" alt="">
                            </div>
                        `;
                }
            }
           	$('.rent-list-con .list .bot').html(imgCode);
           	var beCode="";
           	if(res.data.rentBespeaks){
	           	$.each(res.data.rentBespeaks,function(index,item){
	           		var tipsCode="",operCode="";
	           		if(auth_2){
	           			operCode=`<button>分配接待</button><br>`;
	           			tipsCode=`
	           				<div class="tips tips01">
	                            <div class="tip">
	                                <span>预约日期</span>
	                                <div>${dayTran(item.bespeakTime)}</div>
	                            </div>
	                            <div class="tip">
	                                <span>预约时间</span>
	                                <div>${hourTran(item.bespeakTime)}</div>
	                            </div>
	                            <div class="clear"></div>
	                        </div>
	           				`;
	           		}else{
	           			operCode=`<button>提醒</button><br>`;
		           		tipsCode=`
	           				<div class="tips ">
	                            <div class="tip">
	                                <span>预约日期</span>
	                                <div>${dayTran(item.bespeakTime)}</div>
	                            </div>
	                            <div class="tip">
	                                <span>预约时间</span>
	                                <div>${hourTran(item.bespeakTime)}</div>
	                            </div>
	                            <div class="tip">
	                                <span>接待人员</span>
	                                <div>
	                                   <img src="../../images/upload/touxiang@2x.png" alt=""> 
	                                   <span class="cblue">秀一</span>
	                                </div>
	                            </div>
	                            <div class="clear"></div>
	                        </div>
	           				`;
	           		}
	           		console.info(imgDefault(item.beseakUser.photo,default_tx));
	           		console.info(item.beseakUser.photo)
	           		beCode+=`
	           				<div class="item">
			                    <div class="inner">
			                        <div class="t-l fl">
			                            <div class="tx">
			                                <img src="${imgDefault(item.beseakUser.photo,default_tx)}" alt="">
			                                ${item.beseakUser.name}
			                            </div>
			                            ${tipsCode}
			                        </div>
			                        <div class="bgline fl"></div>
			                        <div class="t-r fr">
			                            <div class="inner">
			                                ${operCode}
			                                <a href="to:13123568956">
			                                    <i class="icon icon-phone"></i>
			                                    <div>13123568956</div>
			                                </a>
			                            </div>
			                        </div>
			                        <div class="clear"></div> 
			                    </div>
			                    <div class="bot">
			                       <i class="icon icon-resault"></i> 
			                       结果：房价太高高高高高高高高高高高高高高高高高高高高高
			                       高高高高高高。
			                    </div>
			                </div>
		           			`;	
	           	})	
           	}
           	
			$('.order-item-con').append(beCode);
          


		}
	}
})















