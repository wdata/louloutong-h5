
//显示
var ww=$(window).width();
function showEdit(_this){
	$('#editor_box').show();
	$(_this).hide();
}
function receiveShow(){
	$('.p-layout').css('transform','translateX(-'+ww+'px)');
}
function tranShow(_this){
	$('.tran-wrap .tran-inner').eq(_this).show().siblings().hide();
	$('.p-layout').css('transform','translateX(-'+ww+'px)');
	$('.sBox-wrapper').addClass('z0');
}

function returnTran(){
	$('.p-layout').css('transform','translateX(0)');
}

function session(key,value){
	sessionStorage.setItem(key,value);
}

function clearForm(elem){
	$(elem).find('input[type=text]').text(' ');
}

function checkMobile(phone){ 
 	var sMobile = phone; 
 	if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(sMobile))){ 
  		return false; 
 	}else{
 		return true;
 	}
} 
//搜索相关js
$('.search-main,.p-layout').width(ww*2);

$('.main-wrap,.tran-wrap,.tap-footer,.issue-editbox').width(ww);

$('#search_btn').focus(function(){
	$('.sBox-wrapper').addClass('active');
})
//点击关键字后
$('.sBox-wrapper .list-con .list').tap(function(){
	$(this).addClass('active').siblings().removeClass('active');
	$('#search_btn').attr('placeholder',$(this).text());
	$('.search-main').css('transform','translateX(-'+ww+'px)');	
	$('.sBox-wrapper .top-search').addClass('active')
})
//取消回到列表页
$('.sBox-wrapper .cancel').tap(function(){
	$('.search-main').css('transform','translateX(0)');	
	$('.sBox-wrapper,.sBox-wrapper .top-search').removeClass('active');
	$('#search_btn').attr('placeholder','搜索').val('');
})
//返回回到关键词页
$('.sBox-wrapper .top-search .back').tap(function(){
    $('.search-main').css('transform','translateX(0)');
	$('.sBox-wrapper .top-search').removeClass('active');
	$('#search_btn').attr('placeholder','搜索');
})



