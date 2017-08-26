
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
	$('.tran-wrap .tran-inner').eq(_this-1).show().siblings().hide();
	$('.p-layout').css('transform','translateX(-'+ww+'px)');
}

function returnTran(){
	$('.p-layout').css('transform','translateX(0)');
}

function session(key,value){
	sessionStorage.setItem(key,value);
}

//搜索相关js
$('.search-main,.p-layout').width(ww*2);

$('.main-wrap,.tran-wrap,.tap-footer').width(ww);

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



