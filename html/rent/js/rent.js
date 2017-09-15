


//获取当前用户的权限  
var auth_sum=sessionStorage.getItem('authority');
var auth_0=false;			//显示出租/求租  
	auth_1=true;			//显示预约/发布
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
    if(auth_2){
    	$('.rent-tab .bot .inner-r1').show().siblings().hide();
    }else if(auth_4){
    	$('.rent-tab .bot .inner-r2').show().siblings().hide();
    }

wxConfig(wx);       //微信授权
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
rent.getList = function(elem,me){
	var _this=this;
	$.ajax({
		type:'get',
		url:server_rent+server_v1+"/rents/search.json",
		dataType:'json',
		data:{
			'type':_this.type,'page':_this.page,'size':_this.size,'genre':_this.genre,'searchType':_this.searchType,'keyword':_this.keyword
		},
		success:function(data){
			var code="";
			if(!data.data || data.code!=0) {
                $(elem).html(code); 
                me.lock();  //智能锁定，锁定上一次加载的方向
                me.noData();      //无数据
                me.resetload();
                return false; 
            }
			$.each(data.data.items,function(index,item){
                var imgCode="",botCode="";
                if(item.images.length>1){
                    for(var i=0;i<item.images.length;i++){
                        imgCode+=`
                                <div class="pic-w fl">
                                    <img src="${server_url_img+item.images[i].url}" alt="">
                                </div>
                            `;
                    }
                    botCode=`<div class="bot">`+imgCode+`</div>`
                }
                var txCode=item.user.photo?server_uel_user_img+item.user.photo:default_tx;
				code+=`
					<div class="list" data-id=${item.id}>
                        <a class="p24" href="rent_detail.html" onclick="link('${item.id}',${_this.type})">
                            <div class="top">
                                <div class="t-l fl">
									<span class="tx" data-id=${item.user.id}><img src="${txCode}" alt=""></span>
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
                            ${botCode}
                        </a>
                    </div>
				`	
			})
			$(elem).append(code);
            _this.page++;
            if(data.data.pageNum*data.data.pageSize >= data.data.totalCount){
                me.lock();  //智能锁定，锁定上一次加载的方向
                me.noData();      //无数据
            }
            me.resetload();    //数据加载完重置
        },
        error:function(data){
            me.noData();      
            me.resetload();    
        }
	})
}
rent.reloadList = function(){
    $('.rent-list-con').html(' ');
    rent.page=1;
    dropload.unlock();
    dropload.noData(false);
    dropload.resetload();
}

//下拉刷新效果
var i=0;
var cur_ob=rent;     //当前列表
var conIndex=1;
var serIndex=1;
var sdropload,dropload;      //搜索下拉


//预约
var order=new Object({
	page:1,
	size:5,
	userId:userId,
	status:0,          //状态， 0: 未， 1: 已
	keyword:null,
    searchType:null,
    state:auth_2?0:1,        //0：分配     1：处理
    curId:null              //当前要操作的预约id
})
order.getList = function(elem,me){
    var _this=this;
    $.ajax({
        type:'get',
        url:server_rent+server_v1+"/rentBespeaks/list.json",
        dataType:'json',
        data:{
            'page':_this.page,'size':_this.size,'userId':_this.userId,'status':_this.status,'keyword':_this.keyword,'searchType':_this.searchType
        },
        success:function(data){
            var code="";
            if(data.code!=0 || !data.data ) { 
                $(elem).html(code); 
                me.lock();  //智能锁定，锁定上一次加载的方向
                me.noData();      //无数据
                me.resetload();
                return false; 
            }
            console.info(order.status+","+order.state)
            if(_this.status==0){
                $.each(data.data.items,function(index,item){
                    var txCode=item.beseakUser.photo?server_uel_user_img+item.beseakUser.photo:default_tx;
                    var imgCode=item.imageUrl?item.imageUrl:default_img;
                    var diffCode;
                    if(_this.state==1){               //未分配   可以分配接待
                        diffCode=`
                            <div class="hr-48"></div>
                            <div class="order-area">
                                <div class="mask"></div>
                                <button class="abs" onclick="order.assignLink('${item.id}')">分配接待</button>
                                <img src="${imgCode}" alt="" class="full">
                            </div>
                        `;
                    }else{
                        diffCode=`
                            <div class="oper">
                                <button class="btn" onclick="order.remind('${item.id}')">提醒</button>
                                <button class="btn" onclick="order.tranShow('${item.id}')">接待</button>
                            </div>
                            <a href="order_detail.html" onclick="session('order_id',${item.id})">
                                <img src="${imgCode}" alt="">
                            </a>
                        `;
                    }
                    code+=`
                         <div class="item">
                            <div class="p24">
                                <div class="t-l fl">
                                    <div class="top">
                                        <a href="">
                                            <span class="tx"><img src="${txCode}" alt=""></span>
                                            <div class="txt">
                                                <div class="tit">${item.beseakUser.name}</div>
                                                <span>${item.createTime}</span>
                                            </div>
                                        </a>
                                    </div>
                                    <a href="order_detail.html" onclick="session('order_id',${item.id})">
                                        <div class="mid mm">
                                            <p class="line2">${item.rentTitle}</p>
                                            <div class="time">预约时间：${item.bespeakTime}</div>
                                            <div class="tips overhide mm">接待者：${item.receptUser.name}</div>
                                        </div>
                                    </a>
                                </div>
                                <div class="t-r fl">
                                    ${diffCode}
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                    `;
                })
            }else{
                $.each(data.data.items,function(index,item){
                    var txCode=item.beseakUser.photo?server_uel_user_img+item.beseakUser.photo:default_tx;
                    var resCode="";
                    if(_this.state==1){           //已处理 有接待结果
                        resCode=`<div class="tips overhide">接待者：${item.receptUser.name}|&nbsp;结果：${item.receptUser.result}</div>`;
                    }
                    code+=`
                        <div class="item">
                            <div class="p24">
                                <div class="t-l fl">
                                    <div class="top">
                                        <a href="">
                                            <span class="tx"><img src="${default_tx}" alt=""></span>
                                            <div class="txt">
                                                <div class="tit">${item.beseakUser.name}</div>
                                                <span>${item.createTime}</span>
                                            </div>
                                        </a>
                                    </div>
                                    <a href="order_detail.html" onclick="session('order_id',${item.id})">
                                        <div class="mid">
                                            <p class="line2">${item.rentTitle+"1"}</p>
                                            <div class="time">预约时间：${item.bespeakTime}</div>
                                            <div>接待人：${item.receptUser.name}</div>
                                            ${resCode}
                                        </div>
                                    </a>
                                </div>
                                <div class="t-r fl">
                                    <div class="hr-48"></div>
                                    <div class="order-area" onclick="tranShow()">
                                        <button class="abs">分配接待</button>
                                        <img src="${server_url_img+item.imageUrl}" alt="">
                                    </div>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>
                    `
                })
            }   
            $(elem).append(code);
            _this.page++;
            if(data.data.pageNum*data.data.pageSize >= data.data.totalCount){
                me.lock();  //智能锁定，锁定上一次加载的方向
                me.noData();      //无数据
            }
            me.resetload();    //数据加载完重置
        },
        error:function(data){
        }
    })        
}
//提醒
order.remind = function(id){
    $.ajax({
        type:'post',
        url:server_rent+server_v1+"/rentBespeaks/remind/"+id+".json",
        dataType:'json',
        success:function(data){
            if(data.code==0){
                showMask('提醒成功！');
            }else{
                showMask('提醒失败！');
            }
        },
        error:function(){
            showMask('提醒失败！');
        }
    })
}
//分配接待
order.assignLink = function(id){
    /*sessionStorage.setItem('aorder_ob',{'id':id,'isOrder':true});*/
    window.location.href="rent_assign.html?id="+id;
    
}
order.tranShow = function(id){
    tranShow(4);
    this.curId=id;
}
//写接待结果
order.recept = function(){
    var _this=this;
    $.ajax({
        type:'post',
        url:server_rent+server_v1+"/rentBespeaks/recept.json",
        dataType:'json',
        data:{
            'bespeakId':this.curId,
            'content':$('.reasult-box textarea').val()
        },
        success:function(data){
            if(data.code==0){
                showMask('提交接待成功！');
                setTimeout(function(){
                    closeMask();
                    returnTran();
                    _this.reloadList();  
                },1000)
            }else{
                showMask('提交接待失败！');
            }
        },
        error:function(){
            showMask('提交接待失败！');
        }
    })
}
order.init = function(){
    var _this=this;
    $('.recept-oper').click(function(){
        _this.recept();
    })
}
order.reloadList = function(){
    $('.rent-list-con').html(' ');
    order.page=1;
    dropload.unlock();
    dropload.noData(false);
    dropload.resetload();
}
order.init();
//我的出租\求租列表
var myrent=new Object({
	page:1,
	size:10,
	userId:userId,
	type:1,
    keyword:null,
})
myrent.getList = function(elem,me){
    var _this=this;
	$.ajax({
		type:'get',
		url:server_rent+server_v1+"/rents/user/"+this.userId+"/"+this.type+".json",
		dataType:'json',
		data:{
			'page':this.page,'size':this.size,'keyword':_this.keyword
		},
		success:function(data){
			var code="";
			if(data.code!=0 || !data.data ) { 
                $(elem).html(code); 
                me.lock();  //智能锁定，锁定上一次加载的方向
                me.noData();      //无数据
                me.resetload();
                return false; 
            }
			$.each(data.data.items,function(index,item){
                var imgCode="";
                if(item.images.length>=1){
                    for(var i=0;i<item.images.length;i++){
                        imgCode+=`
                                <div class="pic-w fl">
                                    <img src="${server_url_img+item.images[i].url}" alt="">
                                </div>
                            `;
                    }
                };
                var botCode=`<div class="bot">`+imgCode+`</div>`
				code+=`
					<div class="list" data-id=${item.id}>
                        <a class="p24" href="rent_detail.html"  onclick="link('${item.id}',${_this.type})">
                            <div class="mid">
                                <div class="word overhide">
                                    ${item.title}
                                </div>
                                <div class="tips price">${item.price} <span class="fr c666">发布于${item.createTime}</span></div>    
                            </div>
                            ${botCode}
                        </a>
                        <div class="oper-bot">
                            <button onclick="myrent.refresh(${item.id})" class="btn">刷新</button>
                            <a class="btn" href="rent_edit.html" onclick="mlink('${item.id}',${_this.type},'${item.status}')">修改</a>
                            <button onclick="myrent.changeStatus(${item.id},${item.status})" class="btn">${item.status==1?'上架':'下架'}</button>
                            <button onclick="myrent.del(${item.id},${item.status})" class="btn">删除</button>
                        </div>
                    </div>
				`	
			})
			$(elem).append(code);
            _this.page++;
            if(data.data.pageNum*data.data.pageSize >= data.data.totalCount){
                me.lock();  //智能锁定，锁定上一次加载的方向
                me.noData();      //无数据
            }
            me.resetload();    //数据加载完重置
		}
	})
}
//刷新
myrent.refresh = function(id){
    var _this=this;
    $.ajax({
        type:'post',
        url:server_rent+server_v1+'/rents/refresh/'+this.userId+'/'+id+'.json',
        dataType:'json',
        success:function(res){
           $('.rent-list-con').html(' ');
            myrent.page=1;
            dropload.unlock();
            dropload.noData(false);
            dropload.resetload();
        }
    })
}
//上下架
myrent.changeStatus = function(id,status){
    var _this=this;
    var c_status=status==1?0:1
    $.ajax({
        type:'post',
        url:server_rent+server_v1+'/rents/shelfStatus/'+this.userId+'/'+id+'/'+c_status+'.json',
        dataType:'json',
        success:function(res){
            $('.rent-list-con').html(' ');
            myrent.page=1;
            dropload.unlock();
            dropload.noData(false);
            dropload.resetload();
        }
   })
}
//删除
myrent.del = function(id,status){
    var _this=this;
    if(status != 1) { showMask('该商品还未下架，不能进行删除！'); return false; }
    $.ajax({ 
        type:'post',
        url:server_rent+server_v1+'/rents/delete/'+this.userId+'/'+id+'.json',
        dataType:'json',
        success:function(res){
            $('.rent-list-con').html(' ');
            myrent.page=1;
            dropload.unlock();
            dropload.noData(false);
            dropload.resetload();
        }
   })
}
myrent.reloadList = function(){
    $('.rent-list-con').html(' ');
    myrent.page=1;
    dropload.unlock();
    dropload.noData(false);
    dropload.resetload();
}

var wxImg = new Object({
    urls:[],
    local_url:[]
})
wxImg.imgUpload = function(){
    var _this=this;
    var i=0;
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
        $('#pic_num').text(this.urls.length);
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
            $.each(_this.urls,function(i,t){
                if(t.num==item.num){
                    _this.urls.splice(i,1);
                }
            })
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

//发布
var issue=new Object({
    isShow:false,
    type:1,                     //1出租   2求租
    userId:userId,
    acreage:null,
    price:null,
    picId:null,
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
issue.add = function(){
    var p=$('.diff-orent .unit-choosed').html();
    var q=$('.diff-irent .unit-choosed').html();
    var unit=this.type==1?q:p
    //  wxImg.urls  /api/v1/rents/save.json
    /*alert(wxImg.urls);*/
    var picUrl=[];
    $.each(wxImg.urls,function(index,item){
        picUrl.push(item.url)
    });
    var title = $('.elem-07').val();
    var content = $('.elem-08').val();

    if(title.length <= 8 && title.length >= 32){
        showMask('标题不能为空,其长度在8-28之间！');
        return ;
    }
    if(content.length <= 10){
        showMask('内容不能为空，其长度大于10！');
        return ;
    }

    $.ajax({
        type:'post',
        url:server_rent + server_v1+'/rents/save.json',
        dataType:'json',
        traditional: true,  
        data:{
            'type':this.type,
            'userId':this.userId,
            'urls':picUrl,
            'propertyId':$('#addressList li.active').data('id'),
            'community':$('.elem-02').val(),
            'section':$('.elem-03').val(),
            'acreage':this.acreage,
            'price':this.price,
            'unit':unit,
            'houseType':$('.elem-06').val(),
            'title':title,
            'content':content,
            'contacter':$('.elem-09').val(),
            'phone':$('.elem-10').val(),
            'direction':'朝南',
            'traffic':'地铁',
            'matingFacility':'花园'
        },
        success:function(data){
            if(data.code===0){
                closeMask();
                showMask('添加成功！');
                clearForm('#rent_form');    
            }else{
                showMask(data.message);
            }
        }
    })
}
issue.tranBack = function(){
     $('.p-layout').css('transform','translateX(0)');
}
issue.event = function(){
    var _this=this;
    //区域选择
    $('.header-operating').tap(function(){
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
    $('.unit-con ul li').tap(function(){
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
    $('#desc_oper').tap(function(){
        $('.elem-08').val($('.desc-con textarea').val());
        _this.tranBack();
    })
    //出租、求租切换
    $('.oper-btn .btn').tap(function(){
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
    // 朝向
    $(".fell .check-wrap").tap(function(){
       $(this).siblings().find("input").prop("checked",false);
    });
    //提交  
    $('.submit-btn').click(function(){
        _this.acreage=($('.diff-orent .elem-04').val())?$('.diff-orent .elem-04').val():$('.diff-irent .elem-04').val();
        var m=$('.diff-orent .elem-05').val();
        var n=$('.diff-irent .elem-05').val();
        _this.price=(m)?m:n;
        //if(_this.type==1 && wxImg.urls.length<=0)                                       { showMask('请至少上传一张图片！'); return false; }
        //if(!$('#addressList li.active').data('id'))                                     { showMask('请选择区域！'); return false; }
        /*if(!_this.acreage)                                                              { showMask('请填写面积！'); return false; }
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
        }*/
        _this.add();
    })
}
issue.init = function(){
    this.show();
    this.scroll();
    this.event();
}


$('#search_btn').on("input porpertychange",function(){
	if($('#search_btn').val()){
		$('.search-main').css('transform','translateX(-'+ww+'px)');	
        $('.top-search').addClass('active');
	}else{
		$('.search-main').css('transform','translateX(0)');
        $('.top-search').removeClass('active');
        return false;
	}
    if(i==0){
        sdropload = $('.serCon-wrap').dropload({
                scrollArea : $(".serCon-wrap"),
                autoLoad:true,
                loadDownFn:function(me){
                    switch(serIndex){
                        case 3:
                            myrent.getList('#searchCon',me);
                            break;
                        case 2:
                            order.getList('#searchCon',me);
                            break;
                        default:
                            rent.getList('#searchCon',me);
                            break;
                    }
                    
                }
        })
    }
    i++;
	var tIndex=$('.rent-tab .top .list.active').index();
	var bIndex=$('.rent-tab .bot .list.active').index();
	var _val=$('#search_btn').val();
	var _type=$('.search-main .list-con .list.active').index()>0?$('.search-main .list-con .list.active').index():' ';
	switch(tIndex){
        case 3:
            myrent.keyword=$('#search_btn').val();
            serIndex=3;
            myrent.page=1;
            sdropload.unlock();
            sdropload.noData(false);
            sdropload.resetload();
            break; 
		case 2:
            order.keyword=$('#search_btn').val();
            order.searchType=_type+1;
            serIndex=2;
            order.page=1;
            sdropload.unlock();
            sdropload.noData(false);
            sdropload.resetload();
            break;
		default:
			rent.keyword=$('#search_btn').val();
			rent.searchType=_type+1;
            serIndex=1;
            rent.page=1;
            sdropload.unlock();
            sdropload.noData(false);
            sdropload.resetload();
			break;
	}
})

$('.rent-tab .top .list').tap(function(){
	if($(this).hasClass('active')) return false;
	$(this).addClass('active').siblings().removeClass('active');
	var tIndex=$(this).index();
	$('.mainCon-wrap').scrollTop('0px');
	$('.rent-tab .bot .inner').eq(tIndex).show().siblings().hide();
	$('.search-main .list-con .inner').eq(tIndex).show().siblings().hide();
	switch(tIndex){
		case 2:
            conIndex=tIndex+1;
			cur_ob=order;
			$('.rent-list-con').show();
			$('.issue').hide();
            order.reloadList();
			break;
		case 3:
            conIndex=4;
            issue.isShow=true;
            issue.init();
			break;
		default:
			cur_ob=rent;
			$('.rent-list-con').show();
			$('.issue').hide();
			rent.type=tIndex+1;
            conIndex=tIndex+1;
            rent.reloadList();
	}
})			

$('.rent-tab .bot .list').tap(function(){
	if($(this).hasClass('active')) return false;
	$(this).addClass('active').siblings().removeClass('active');
	var bIndex=$(this).index();
	var tIndex=$('.rent-tab .top .list.active').index();
	switch(tIndex){
		case 2:
			order.status=bIndex;
			conIndex=tIndex+1;
            order.reloadList();
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
                    conIndex=tIndex+1;
                    myrent.reloadList();
					break;
			}
			break;
		default:
			rent.genre=bIndex+1;
			rent.type=tIndex+1;
			conIndex=tIndex+1;
            rent.reloadList();
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
function mlink(id,type,status){
    var elem=JSON.stringify({'id':id,'type':type,'status':status})
    sessionStorage.setItem('rent_modify',elem)
}

//点击关键字后
$('.sBox-wrapper .list-con .list').tap(function(){
    $(this).addClass('active').siblings().removeClass('active');
    $('#search_btn').attr('placeholder',$(this).text());
    $('.search-main').css('transform','translateX(-'+ww+'px)'); 
    $('.sBox-wrapper .top-search').addClass('active')
    $('#searchCon').html(' ');
})
//取消回到列表页
$('.sBox-wrapper .cancel').tap(function(){
    $('.search-main').css('transform','translateX(0)'); 
    $('.sBox-wrapper,.sBox-wrapper .top-search').removeClass('active');
    $('#search_btn').attr('placeholder','搜索').val('');
    rent.searchType=null;
    rent.keyword=null;
    rent.genre=1;
})

$('.reasult-editer').focus(function(){
    $('.placeholder').remove();
})
$('.reasult-editer').blur(function(){
    if($.trim($(this).val()).length<=0){
        $('.reasult-box').append(`<div class="placeholder">请填写接待结果<span>(30个字以内)</span></div>`);
    }
})

//根据url的show参数来确定初始化哪个tab
var j=0;
function rentInit(){
    var cur_show=parseInt(urlParams('show'));
    $('.rent-tab .top .list').eq(cur_show).addClass('active').siblings().removeClass('active');
    $('.rent-tab .bot .inner').eq(cur_show).show().siblings().hide();
    if(cur_show<=1){                   //出租求租情况下
        rent.type=cur_show+1;
        conIndex=cur_show+1;
    }
    if(j==0){
        dropload= $('.mainCon-wrap').dropload({
                scrollArea : $(".mainCon-wrap"),
                autoLoad:true,
                loadDownFn:function(me){
                    switch(conIndex){
                        case 4:
                            myrent.getList('.rent-list-con',me)
                            break;
                        case 3:
                            order.getList('.rent-list-con',me);
                            break;
                        default:
                            rent.getList('.rent-list-con',me);  
                            break;
                    }
                }
        })
    }
    j++;
    switch(cur_show){
        case 2:
            conIndex=cur_show+1;
            order.reloadList();
            break;
        case 3:
            issue.isShow=true;
            issue.init(); 
            break;
        default:
            break;
    } 
}
rentInit();
