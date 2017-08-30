
//获取当前用户的权限  
var auth_sum=sessionStorage.getItem('authority');
var auth_0=false;			//显示出租/求租  
	auth_1=false;			//显示预约/发布
	auth_2=false;  			//预约显示状态_未分配/已分配 
	auth_3=false;			//预约显示状态_未处理/已处理 
	auth_4=false;			//分配接待 
	auth_5=false;			//提醒 
	auth_6=false;			//接待
	
    //if(auth_sum.indexOf('/llt/click/rent/showModel/rentorwanted')>0) 			auth_0=true;
    if(auth_sum.indexOf('/llt/click/rent/showModel/bespeakoradd')>0) 			auth_1=true;
    if(auth_sum.indexOf('/llt/click/rent/showModel/click/assignorno')>0) 		auth_2=true;
    if(auth_sum.indexOf('/llt/click/rent/showModel/click/handleorno')>0) 		auth_3=true;
    if(auth_sum.indexOf('/llt/click/rent/showModel/bespeak/distribute')>0) 		auth_4=true;
    if(auth_sum.indexOf('/llt/click/rent/showModel/bespeak/remind')>0) 			auth_5=true;
    if(auth_sum.indexOf('/llt/click/rent/showModel/bespeak/recept')>0) 			auth_6=true;

    //因权限而对页面显示控制
    if(auth_1){
    	$('.rent-tab .top .top-r1').show().siblings().hide();
    }else{
    	$('.rent-tab .top .top-r2').show().siblings().hide();
    }
    if(auth_3){
    	$('.rent-tab .bot .inner-r1').show().siblings().hide();
    }else if(auth_4){
    	$('.rent-tab .bot .inner-r2').show().siblings().hide();
    }

var no_data="已经没有更多数据了",have_data="下拉刷新数据",loading_data="数据加载中";

function wxConfig() {
    console.info(location.href.split('#')[0])
    $.ajax({
        url: '/weixin/permissionValidation',
        type: 'get',
        dataType: 'json',
        async:false,
        contentType: 'application/json',
        data:{'url':location.href.split('#')[0]},
        success: function (res) {
            var data = res.data;
            //微信配置
            wx.config({
                debug: false,
                //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature,// 必填，签名，见附录1
                jsApiList: [
                    'onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ',
                    'onMenuShareWeibo','onMenuShareQZone','chooseImage','previewImage','uploadImage',
                    'downloadImage','getLocalImgData',
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            console.info(data);
            wx.ready(function () {
                //alert(1)
            });
            wx.error(function (res) {
                //throw res;
                console.log(2);
                alert(4)
            });

        },
        error: function (res) {

        }
    })
}
wxConfig();

//出租和求租
var rent = new Object({
	page:1,
	size:10,	
	genre:1,		 //类型默认 1 ：综合； 2 ：最新； 3 ：最近
	type:1,			 // 类型：1: 出租， 2: 求租
	searchType:"",   //搜索类型 1 ：标题 2 ：发布人： 3 ：租金 4 ：距离 5: 预约人
	keyword:"",
	isHaveNextPage:true
});
rent.getList = function(elem){
	var _this=this;
	$.ajax({
		type:'get',
		url:server_rent+server_v1+"/rents/search.json",
		dataType:'json',
		data:{
			'type':this.type,'page':this.page,'size':this.size,'genre':this.genre,'searchType':this.searchType,'keyword':this.keyword
		},
		success:function(data){
			var code="";
			if(data.code!=0) return false;
			if(!data.data) { $(elem).html(code); return false; }
			$.each(data.data.items,function(index,item){
				code+=`
					<div class="list" data-id=${item.id}>
                        <a class="p24" href="orent_detail.html" onclick="link('${item.id}',${_this.type})">
                            <div class="top">
                                <div class="t-l fl">
									<span class="tx" data-id=${item.user.id}><img src="${server_url_img+item.user.photo}" alt="" class="full"></span>
                                    <div class="txt">
                                        <div class="tit">${item.user.name}</div>
                                        <div class="time">${item.createTime}</div>
                                    </div>
                                </div>
                                <div class="t-r fr">
                                    距离距离
                                </div>
                                <div class="clear"></div>
                            </div>
                            <div class="mid">
                                <div class="word overhide">
                                    ${item.title}
                                </div>
                                <div class="tips price">${item.price}</div>    
                            </div>
                            <div class="bot">
                                <div class="pic-w fl">
                                        <img src="../../images/upload/tu1@2x.png" alt="" class="full">
                                </div>
                                <div class="pic-w fl">
                                        <img src="../../images/upload/tu2@2x.png" alt="" class="full">
                                </div>
                                <div class="pic-w fl">
                                        <img src="../../images/upload/tu3@2x.png" alt="" class="full">
                                </div>
                                <div class="pic-w fl">
                                        <img src="../../images/upload/tu4@2x.png" alt="" class="full">
                                </div>
                                <div class="clear"></div>
                            </div>
                        </a>
                    </div>
				`	
			})
			$(elem).html(code);
		}
	})
}
rent.getMoreList = function(elem){
	this.page++;
	var _this=this;
	$.ajax({
		type:'get',
		url:server_rent+server_v1+"/rents/search.json",
		dataType:'json',
		data:{
			'type':this.type,'page':this.page,'size':this.size,'genre':this.genre,'searchType':this.searchType,'keyword':this.keyword
		},
		success:function(data){
			var code="";
			if(data.code!=0) return false;
			if(_this.page>data.data.totalPages) { _this.isHaveNextPage=false;}  
			$.each(data.data.items,function(index,item){
				code+=`
					<div class="list" data-id=${item.id}>
                        <a class="p24" href="orent_detail.html">
                            <div class="top">
                                <div class="t-l fl">
									<span class="tx" data-id=${item.user.id}><img src="${item.user.photo}" alt="" class="full"></span>
                                    <div class="txt">
                                        <div class="tit">${item.user.name}</div>
                                        <div class="time">${item.createTime}</div>
                                    </div>
                                </div>
                                <div class="t-r fr">
                                    距离距离
                                </div>
                                <div class="clear"></div>
                            </div>
                            <div class="mid">
                                <div class="word overhide">
                                    ${item.title}
                                </div>
                                <div class="tips price">${item.price}</div>    
                            </div>
                            <div class="bot">
                                <div class="pic-w fl">
                                        <img src="../../images/upload/tu1@2x.png" alt="" class="full">
                                </div>
                                <div class="pic-w fl">
                                        <img src="../../images/upload/tu2@2x.png" alt="" class="full">
                                </div>
                                <div class="pic-w fl">
                                        <img src="../../images/upload/tu3@2x.png" alt="" class="full">
                                </div>
                                <div class="pic-w fl">
                                        <img src="../../images/upload/tu4@2x.png" alt="" class="full">
                                </div>
                                <div class="clear"></div>
                            </div>
                        </a>
                    </div>
				`	
			})
			$(elem).append(code);
		}
	})
}

rent.init = function(){
	rent.getList('.rent-list-con');
	//rent.isBot();
}
rent.init();
//预约
var order=new Object({
	page:1,
	size:1,
	userId:userId,
	status:0,    //状态， 0: 未分配或未处理， 1: 已分配或已处理
	isHaveNextPage:true
})
order.getList = function(elem){
	$.ajax({
		type:'get',
		url:server_rent+server_v1+"/rentBespeaks/list.json",
		dataType:'json',
		data:{
			'page':this.page,'size':this.size,'userId':this.userId,'status':this.status
		},
		success:function(data){
			var code="";
			if(data.code!=0) return false;
			if(!data.data) { $(elem).html(code); return false; }
			if(this.status==1){
				$.each(data.data.items,function(index,item){
					code+=`
						 <div class="item">
                            <div class="p24">
                                <div class="t-l fl">
                                    <div class="top">
                                        <a href="">
                                            <span class="tx"><img src="${item.beseakUser.photo}" alt="" class="full"></span>
                                            <div class="txt">
                                                <div class="tit">${item.beseakUser.name}</div>
                                                <span>${item.createTime}</span>
                                            </div>
                                        </a>
                                    </div>
                                    <a href="order_detail.html">
                                        <div class="mid">
                                            <p class="line2">${item.beseakUser.rentTitle}</p>
                                            <div class="time">预约时间：${item.bespeakTime}</div>
                                            <div class="tips overhide">接待者：${item.receptUser.name}|&nbsp;结果：已接待，带客户考虑清楚再回复我们</div>
                                        </div>
                                    </a>
                                </div>
                                <div class="t-r fl">
                                    <div class="oper">
                                        <button class="btn">提醒</button>
                                        <a href="recei_reasult.html" class="btn">接待</a>
                                    </div>
                                    <a href="order_detail.html">
                                        <img src="../../images/upload/tu1@2x.png" alt="" class="full">
                                    </a>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
					`;
				})
			}else{
				$.each(data.data.items,function(index,item){
					code+=`
						<div class="item">
                            <div class="p24">
                                <div class="t-l fl">
                                    <div class="top">
                                        <a href="">
                                            <span class="tx"><img src="${item.beseakUser.photo}" alt="" class="full"></span>
                                            <div class="txt">
                                                <div class="tit">${item.beseakUser.name}</div>
                                                <span>${item.createTime}</span>
                                            </div>
                                        </a>
                                    </div>
                                    <a href="order_detail.html">
                                        <div class="mid">
                                            <p class="line2">${item.rentTitle}</p>
                                            <div class="time">预约时间：${item.bespeakTime}</div>
                                        </div>
                                    </a>
                                </div>
                                <div class="t-r fl">
                                    <div class="hr-48"></div>
                                    <div class="order-area" onclick="tranShow()">
                                        <div class="mask"></div>
                                        <button class="abs">分配接待</button>
                                        <img src="../../images/upload/tu1@2x.png" alt="" class="full">
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="p24">
                                <div class="t-l fl">
                                    <div class="top">
                                        <a href="">
                                            <span class="tx"><img src="${item.beseakUser.photo}" alt="" class="full"></span>
                                            <div class="txt">
                                                <div class="tit">${item.beseakUser.name}</div>
                                                <span>${item.createTime}</span>
                                            </div>
                                        </a>
                                    </div>
                                    <a href="order_detail.html">
                                        <div class="mid">
                                            <p class="line2">${item.rentTitle}</p>
                                            <div class="time">预约时间：${item.bespeakTime}</div>
                                        </div>
                                    </a>
                                </div>
                                <div class="t-r fl">
                                    <div class="hr-48"></div>
                                    <div class="order-area" onclick="tranShow()">
                                        <div class="mask"></div>
                                        <button class="abs">分配接待</button>
                                        <img src="../../images/upload/tu1@2x.png" alt="" class="full">
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="p24">
                                <div class="t-l fl">
                                    <div class="top">
                                        <a href="">
                                            <span class="tx"><img src="${item.beseakUser.photo}" alt="" class="full"></span>
                                            <div class="txt">
                                                <div class="tit">${item.beseakUser.name}</div>
                                                <span>${item.createTime}</span>
                                            </div>
                                        </a>
                                    </div>
                                    <a href="order_detail.html">
                                        <div class="mid">
                                            <p class="line2">${item.rentTitle}</p>
                                            <div class="time">预约时间：${item.bespeakTime}</div>
                                        </div>
                                    </a>
                                </div>
                                <div class="t-r fl">
                                    <div class="hr-48"></div>
                                    <div class="order-area" onclick="tranShow()">
                                        <div class="mask"></div>
                                        <button class="abs">分配接待</button>
                                        <img src="../../images/upload/tu1@2x.png" alt="" class="full">
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
					`
				})
			}
			$(elem).html(code);
		}
	})
}
order.getMoreList = function(elem){
	var _this=this;
	this.page++;
	$.ajax({
		type:'get',
		url:server_rent+server_v1+"/rentBespeaks/list.json",
		dataType:'json',
		data:{
			'page':this.page,'size':this.size,'userId':this.userId,'status':this.status
		},
		success:function(data){
			var code="";
			if(data.code!=0) return false;
			if(_this.page>=data.data.totalPages) { _this.isHaveNextPage=false; }
			if(_this.status==1){
				$.each(data.data.items,function(index,item){
					code+=`
						 <div class="item">
                            <div class="p24">
                                <div class="t-l fl">
                                    <div class="top">
                                        <a href="">
                                            <span class="tx"><img src="${item.beseakUser.photo}" alt="" class="full"></span>
                                            <div class="txt">
                                                <div class="tit">${item.beseakUser.name}</div>
                                                <span>${item.createTime}</span>
                                            </div>
                                        </a>
                                    </div>
                                    <a href="order_detail.html">
                                        <div class="mid">
                                            <p class="line2">${item.beseakUser.rentTitle}</p>
                                            <div class="time">预约时间：${item.bespeakTime}</div>
                                            <div class="tips overhide">接待者：${item.receptUser.name}|&nbsp;结果：已接待，带客户考虑清楚再回复我们</div>
                                        </div>
                                    </a>
                                </div>
                                <div class="t-r fl">
                                    <div class="oper">
                                        <button class="btn">提醒</button>
                                        <a href="recei_reasult.html" class="btn">接待</a>
                                    </div>
                                    <a href="order_detail.html">
                                        <img src="../../images/upload/tu1@2x.png" alt="" class="full">
                                    </a>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
					`;
				})
			}else{
				$.each(data.data.items,function(index,item){
					code+=`
						<div class="item">
                            <div class="p24">
                                <div class="t-l fl">
                                    <div class="top">
                                        <a href="">
                                            <span class="tx"><img src="${item.beseakUser.photo}" alt="" class="full"></span>
                                            <div class="txt">
                                                <div class="tit">${item.beseakUser.name}</div>
                                                <span>${item.createTime}</span>
                                            </div>
                                        </a>
                                    </div>
                                    <a href="order_detail.html">
                                        <div class="mid">
                                            <p class="line2">${item.rentTitle}</p>
                                            <div class="time">预约时间：${item.bespeakTime}</div>
                                        </div>
                                    </a>
                                </div>
                                <div class="t-r fl">
                                    <div class="hr-48"></div>
                                    <div class="order-area" onclick="tranShow()">
                                        <div class="mask"></div>
                                        <button class="abs">分配接待</button>
                                        <img src="../../images/upload/tu1@2x.png" alt="" class="full">
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
					`
				})
			}
			$(elem).append(code);
		}
	})
}
//我的出租\求租
var myrent=new Object({
	page:1,
	size:10,
	userId:userId,
	type:1
})
myrent.getList = function(elem){
	$.ajax({
		type:'get',
		url:server_rent+server_v1+"/rents/user/"+this.userId+"/"+this.type+".json",
		dataType:'json',
		data:{
			'page':this.page,'size':this.size,
		},
		success:function(data){
			var code="";
			if(data.code!=0) return false;
			if(!data.data) { $(elem).html(code); return false; }
			$.each(data.data.items,function(index,item){
				code+=`
					<div class="list" data-id=${item.id}>
                        <a class="p24" href="orent_detail.html">
                            <div class="mid">
                                <div class="word overhide">
                                    ${item.title}
                                </div>
                                <div class="tips price">${item.price} <span class="fr c666">发布于${item.createTime}</span></div>    
                            </div>
                            <div class="bot">
                                <div class="pic-w fl">
                                        <img src="../../images/upload/tu1@2x.png" alt="" class="full">
                                </div>
                                <div class="pic-w fl">
                                        <img src="../../images/upload/tu2@2x.png" alt="" class="full">
                                </div>
                                <div class="pic-w fl">
                                        <img src="../../images/upload/tu3@2x.png" alt="" class="full">
                                </div>
                                <div class="pic-w fl">
                                        <img src="../../images/upload/tu4@2x.png" alt="" class="full">
                                </div>
                                <div class="clear"></div>
                            </div>
                        </a>
                    </div>
				`	
			})
			$(elem).html(code);
		}
	})
}

//发布
var propertyId=sessionStorage.getItem('propertyId');
var issue=new Object({
    isShow:false,
    type:1,                     //1出租   2求租
    userId:userId,
    acreage:null,
    price:null
});
issue.show = function(){
    if(this.isShow){
        $('.rent-list-con').hide();
        $('.issue').show();
    }else{
        $('.rent-list-con').show();
        $('.issue').hide();
    }
}
issue.scroll = function(){
    var _this=this;
    $('.mainCon-wrap').scroll(function(){
        if(!_this.isShow) return false;
        if($('.issue-editbox').offset().top<=$('.top-search').height()-10){
            $('.rent-box').removeClass('transy');
            $('.sBox-wrapper').addClass('z0');
            $('.issue-editbox').addClass('on');
        }
    })
}
issue.imgUpload = function(){
    $('.issue .photo').click(function(){
        console.info(wx)
        wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            }
        });    
    })
}
issue.add = function(){
    $.ajax({
        type:'post',
        url:server_rent+server_v1+'/rents/save.json',
        dataType:'json',
        data:{
            'type':this.type,
            'userId':this.userId,
            'propertyId':$('#addressList li.active').data('id'),
            'community':$('.elem-02').val(),
            'section':$('.elem-03').val(),
            'acreage':this.acreage,
            'price':this.price,
            'houseType':$('.elem-06').val(),
            'title':$('.elem-07').val(),
            'content':$('.elem-08').val(),
            'contacter':$('.elem-09').val(),
            'phone':$('.elem-10').val(),
            'direction':'朝南',
            'traffic':'地铁',
            'matingFacility':'花园'
        },
        success:function(data){
            showMask('添加成功！');
            clearForm('#rent_form');
        }
    })
}
issue.tranBack = function(){
     $('.p-layout').css('transform','translateX(0)');
}
issue.event = function(){
    var _this=this;
    //区域选择
    $('.header-operating').click(function(){
        var cur_name,li_name;
        li_name=$('#addressList li.active').text();
        if(li_name=="全部"){
            cur_name=$('.switch .nav li.active').prev().text();
        }else{
            cur_name=li_name;
        }
        $('.elem-01').text(cur_name);
        _this.tranBack();
    })
    //选择单位
    $('.unit-con ul li').click(function(){
        if(_this.type==1){
           $('.diff-irent .unit-choosed').html($(this).html()) 
        }else{
           $('.diff-orent .unit-choosed').html($(this).html())  
        }
        _this.tranBack();
    })
    //输入描述
    $('.desc-con textarea').focus(function(){
        if($(this).val()){
            $('#desc_oper').show();
        }
    })
    $('#desc_oper').click(function(){
        $('.elem-08').val($('.desc-con textarea').val());
        _this.tranBack();
    })
    //出租、求租切换
    $('.oper-btn .btn').click(function(){
        _this.type=$(this).index()+1;
        if($(this).index()==0){
            $('.diff-orent').hide();
            $('.diff-irent').show();
        }else{
            $('.diff-orent').show();
            $('.diff-irent').hide();
        }
        $(this).addClass('on').siblings().removeClass('on');
    })
    //提交  
    $('.submit-btn').click(function(){
        _this.acreage=($('.diff-orent .elem-04').val())?$('.diff-orent .elem-04').val():$('.diff-irent .elem-04').val();
        var m=$('.diff-orent .elem-05').val();
        var n=$('.diff-orent .unit-choosed').html();
        var p=$('.diff-irent .elem-05').val();
        var q=$('.diff-irent .unit-choosed').html();
        _this.price=(m)?m+n:p+q;
        console.info(_this.price);
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
        _this.add();
    })
}

issue.init = function(){
    this.show();
    this.scroll();
    this.event();
    this.imgUpload();
}


function dongSwitch(){
    this.louDong = null;       //   保存数据；
    this.addressList = $("#addressList");   //  楼栋列表父级元素
}

dongSwitch.prototype = {
    constructor:dongSwitch,
    main:function(){
        this.dongAjax();     //  ajax事件获取数据，并将数据保存；
        this.dongSelect();   //    选择楼栋
        this.superior();      //  顶部导航重新选择同级楼栋；
    },
    dongAjax:function(){
        var _this = this;
        $.ajax({
            type:'get',
            url:  server_url_repair + server_v1 + '/property/manager/'+ userId +'.json',
            data: null,
            dataType:'json',
            success:function(data){
                var html = '';
                _this.addressList.empty();
                if(data.code === 0){
                    _this.louDong = data.data;
                    var one = null;var sum = 1;
                    $.each(data.data,function(index,val){
                        //  如果parentId === null 则表示没有上一级，ajax只显示一级列表；
                        if(val.parentId === null){
                            html += '<li data-pid="'+ val.parentId +'" data-id = "'+ val.id +'"><i></i>'+ val.name +'</li>';
                            if(sum === 1){
                                one = val
                            }
                        }
                    });
                    _this.addressList.append(html);
                }
            },
            error:function(data){
                ErrorReminder(data);
            }
        });
    },
    dongSelect:function(){

        //  点击下一级；

        var _this = this;
        $(document).on("click","#addressList li",function(){

            //  提示
            $(this).addClass("active")
                .siblings().removeClass("active");

            var id = $(this).attr("data-id");


            var bur = _this.judgment(id,_this.louDong);  // 判断有没有下一级；
            if(bur){
                //  判断是不是点击的全部；
                if(!$(this).is(".all")){

                    // console.log("有下一级");
                    //  隐藏确定；
                    $("#determine").addClass("hide");


                    if($("#prompt").is(".active")){
                        //  将选择的放入顶部导航；
                        $("#prompt").before('<li data-pid="'+ $(this).attr("data-pid") +'" data-id="'+ $(this).attr("data-id") +'">'+ $(this).text() +'</li>');
                        //  位移到滚动条最后面；
                        $(".nav").scrollLeft( $('.nav')[0].scrollWidth );
                    }else{
                        $("#prompt").addClass("active")
                            .siblings().removeClass("active");

                        //  判断是不是点击了之前的元素;
                        $.each($(".switch .nav li"),function(index,val){
                            if($(val).attr("data-pid") === $(this).attr("data-id")){
                                $(val).attr({
                                    "data-id":$(this).attr("data-id"),
                                    "data-pid":$(this).attr("data-pid")
                                });
                                $(val).text($(this).text());
                            }
                        });
                    }

                    _this.nextLevel(id);
                }else{
                    // console.log("可以选择确定");
                    $("#determine").removeClass("hide");
                }

            }else{
                // console.log("没有下一级");
                $("#determine").removeClass("hide");
            }
        });
    },
    superior:function(){
        //  选择同级；
        var _this = this;
        $(document).on("click",".switch .nav li",function(){
            //  提示
            $(this).addClass("active")
                .siblings().removeClass("active");
            $("#determine").addClass("hide");

            //  如果顶部点击元素和“请选择”中间有其他元素，需要删除它；
            var index = $("#prompt").index() - $(this).index();
            if(index > 1){
                for(var x = 1 ; x < index ; x++){
                    $(".switch .nav li").eq($(this).index()+1).remove();
                }
            }
            if($(this).is("#prompt")){
                //  如果是点击“请选择”：获取子级元素；
                _this.nextLevel($(".switch .nav li").eq($(this).index()-1).attr("data-id"));
            }else{
                //  如果不是点击“请选择”：获取同级元素；
                _this.SameLevel($(this).attr("data-id"),$(this).attr("data-pid"));
            }

        });
    },
    SameLevel:function(id,pid){
        //  获取同级楼栋；
        var html = '';
        this.addressList.empty();
        if(!(pid === "null")){
            html = '<li class="all" data-id="'+ id +'"><i></i>全部</li>';
        }
        $.each(this.louDong,function(index,val){
            if(val.parentId + "" === pid){
                html += '<li data-pid="'+ val.parentId +'" data-id = "'+ val.id +'"><i></i>'+ val.name +'</li>';
            }

        });
        this.addressList.append(html);
    },
    nextLevel:function(id){
        //  获取子集楼栋；
        var html = '';
        this.addressList.empty();
        html = '<li class="all" data-id="'+ id +'"><i></i>全部</li>';
        $.each(this.louDong,function(index,val){
            if(val.parentId + "" === id){
                html += '<li data-pid="'+ val.parentId +'" data-id = "'+ val.id +'"><i></i>'+ val.name +'</li>';
            }
        });
        this.addressList.append(html);
    },
    judgment:function(id,louDong){
        //  判断是否有下一级
        var bur = false;
        $.each(louDong,function(index,val){
            if(parseInt(id) === val.parentId){
                bur = true;
            }
        });
        return bur;
    }
};
$(document).ready(function(){
    var tap = new dongSwitch();
    tap.main();  // 调用总函数；
});



//下拉刷新效果
var i=0;
var cur_ob=rent;  //当前列表
$('.mainCon-wrap').scroll(function(){
    var isBottom = $('.mainCon-wrap').scrollTop()>=($('.mainCon-wrap').height()-$(window).height())-50;
    i++;
    if(isBottom & i<=1){
        var num=32;
        touch.on('.rent-list-con','swipestart',function(e){
        	if(!cur_ob.isHaveNextPage) $('.data-tips').text(no_data).show();
        });
        touch.on('.rent-list-con','swiping',function(e){
            if(cur_ob.isHaveNextPage) $('.data-tips').text(loading_data).show();
        });
        touch.on('.rent-list-con','swipeend',function(e){
        	$('.data-tips').hide();
        	if(cur_ob.isHaveNextPage){ 
        		cur_ob.getMoreList('.rent-list-con',true);
        		
        	}
        });
    }
});


$('#search_btn').on("input porpertychange",function(){
	if($('#search_btn').val()){
		$('.search-main').css('transform','translateX(-'+ww+'px)');	
	}else{
		$('.search-main').css('transform','translateX(0)');
	}
	var tIndex=$('.rent-tab .top .list.active').index();
	var bIndex=$('.rent-tab .bot .list.active').index();
	var _val=$('#search_btn').val();
	var _type=$('.search-main .list-con .list.active').index()>0?$('.search-main .list-con .list.active').index():' ';
	switch(tIndex){
		case 2:
			break;
		default:
			rent.keyword=$('#search_btn').val();
			rent.searchType=_type;
			rent.getList('#searchCon');
			break;
	}
})

$('.rent-tab .top .list').click(function(){
	if($(this).hasClass('active')) return false;
	$(this).addClass('active').siblings().removeClass('active');
	var tIndex=$(this).index();
	$('.mainCon-wrap').scrollTop('0px');
	$('.rent-tab .bot .inner').eq(tIndex).show().siblings().hide();
	$('.search-main .list-con .inner').eq(tIndex).show().siblings().hide();
	switch(tIndex){
		case 2:
			cur_ob=order;
			order.getList('.rent-list-con');
			$('.rent-list-con').show();
			$('.issue').hide();
			break;
		case 3:
			issue.isShow=true;
			issue.init();
			break;
		default:
			cur_ob=rent;
			$('.rent-list-con').show();
			$('.issue').hide();
			rent.type=tIndex+1;
			rent.getList('.rent-list-con');
	}
})			

$('.rent-tab .bot .list').click(function(){
	if($(this).hasClass('active')) return false;
	$(this).addClass('active').siblings().removeClass('active');
	var bIndex=$(this).index();
	var tIndex=$('.rent-tab .top .list.active').index();
	switch(tIndex){
		case 2:
			order.status=bIndex;
			order.getList('.rent-list-con');
			break;
		case 3:
			switch(bIndex){
				case 0:
					issue.isShow=true;
					issue.init();
					break;
				default:
					issue.isShow=false;
					issue.init();
					myrent.type=bIndex;
					myrent.getList('.rent-list-con');
					break;
			}
			break;
		default:
			rent.genre=bIndex+1;
			rent.type=tIndex+1;
			rent.getList('.rent-list-con');
			break;
	}
})


//我要出租/我要求租返回列表页
function returnList(){
	$('.issue-editbox,.sBox-wrapper').removeClass('on z0');
	$('.rent-box').addClass('transy');
}

function link(id,type){
    var elem=JSON.stringify({'id':id,'type':type})
    sessionStorage.setItem('rent_ob',elem)
}

