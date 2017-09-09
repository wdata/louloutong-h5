var rent_modify=JSON.parse(sessionStorage.getItem('rent_modify'));

if(rent_modify.type==1){ 
	$('.diff-orent').hide();
    $('.diff-irent').show();
}else{
    $('.diff-orent').show();
    $('.diff-irent').hide();
}
wxConfig(wx);

var modify = new Object({
	id:rent_modify.id, 
    type:rent_modify.type,                     //1出租   2求租
    userId:userId,
    acreage:null,
    price:null,
    propertyId:null,
    imgArr:[]
})
modify.update = function(){
	var p=$('.diff-orent .unit-choosed').html();
    var q=$('.diff-irent .unit-choosed').html();
    var unit=this.type==1?q:p;
    var picUrl=[];
    $.each(wxImg.urls,function(index,item){
        picUrl.push(item.url)
    })
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
            'direction':'朝南',
            'traffic':'地铁',
            'matingFacility':'花园'
		},
		beforeSend:function(data){
            showMask('请求处理中！');
        },
        success:function(data){
            if(data.code==0){
                closeMask();
                showMask('添加成功！');
                clearForm('#rent_form');    
            }
        }
	})
}
modify.tranBack = function(){
     $('.p-layout').css('transform','translateX(0)');
}
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
    })
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
}



modify.event();

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
        _this.setLocalImg(localId);
        $('#pic_num').text(_this.local_url.length);
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
wxImg.setLocalImg = function(src){
	var code=`
            <div class="img-list">
                <img src="${src}" alt="">
                <i class="icon icon-del" onclick="wxImg.del(this)"></i>
            </div> 
            `;
    $('.pic-wrap .pic-con .list-con').append(code);
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


function modify(){	
}

function dongSwitch(){
    this.louDong = null;       //   保存数据；
    this.addressList = $("#addressList");   //  楼栋列表父级元素
}
dongSwitch.prototype = {
    constructor:dongSwitch,
    main:function(){
        this.animation();    //  确定功能；和动画切换效果；（这个是可以随意编辑的，）
        this.dongAjax();     //  ajax事件获取数据，并将数据保存；（这个是获取数据）
        this.dongSelect();   //  选择下一级
        this.superior();     //  顶部导航重新选择同级楼栋；
    },
    animation:function(){
        var _this = this;
        // 平移动画效果
        $(document).on("tap","#address",function(){
            $(".index").addClass("active");
            $(".switch").addClass("active");
        });
        $(".switch .header-return,#determine").tap(function(){
            $(".index").removeClass("active");
            $(".switch").removeClass("active");

            //  判断是确定还是返回；
            var selected = $("#addressList li.active");
            if($(this).is("#determine")){
                var text = null;
                $.each(_this.louDong,function(index,val){
                    if(selected.attr("data-id") === val.id + ""){
                        text = val.name;
                    }
                });
            }
        });
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
                            sum++;
                        }
                    });
                    _this.addressList.append(html);
					modify.getInfo = function(){
							$.ajax({
								type:'get',
								url:server_rent+server_v1+'/rents/'+rent_modify.id+'.json',
								dataType:'json',
								success:function(res){
									if(res.code==0){
										//this.propertyId=res.data.propertyId;
										$('.elem-02').val(res.data.community);
										$('.elem-03').val(res.data.section);
										$('.elem-04').val(res.data.acreage);
										$('.elem-05').val(res.data.price);
										$('.elem-06').val(res.data.houseType);
										$('.elem-07').val(res.data.title);
										$('.elem-08').val(res.data.content);
										$('.elem-09').val(res.data.contacter);
										$('.elem-10').val(res.data.phone);
										$('.unit-choosed').text(res.data.unit);
										_this.Default(res.data.propertyId);
										$.each(res.data.images,function(index,item){
											modify.imgArr.push(item.url);
										})
										wxImg.setImg(res.data.images[0].url);
                                        $('#pic_num').text(res.data.images.length);
										$.each(res.data.images,function(index,item){
											wxImg.urls.push({'num':index,'url':item.url.substring(item.url.indexOf('com/')+3,item.url.length) })
											wxImg.local_url.push({'num':index,'url':item.url});
											wxImg.setLocalImg(item.url);
										})
									}
								}
							})
					}
					modify.getInfo();
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
        $(document).on("tap","#addressList li",function(){
            var self = this;
            //  提示
            $(this).addClass("active")
                .siblings().removeClass("active");

            var id = $(this).attr("data-id");


            var bur = _this.judgment(id);  // 判断有没有下一级；
            if(bur){
                //  判断是不是点击的全部；
                if(!$(this).is(".all")){

                    // console.log("有下一级");
                    //  隐藏确定；
                    $("#determine").addClass("hide");


                    if($("#prompt").is(".active")){

                        _this.topApend($(this).attr("data-id"),$(this).attr("data-pid"),$(this).text());
                        //  位移到滚动条最后面；
                        $(".nav").scrollLeft( $('.nav')[0].scrollWidth );
                    }else{
                        $("#prompt").addClass("active")
                            .siblings().removeClass("active");

                        //  判断是不是点击了之前的元素;
                        $.each($("#prompt").siblings(),function(index,val){
                            if($(val).attr("data-pid") === $(self).attr("data-pid")){
                                $(val).attr({
                                    "data-id":$(self).attr("data-id"),
                                    "data-pid":$(self).attr("data-pid")
                                });
                                $(val).text($(self).text());
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
    Default:function(data){
        var _this = this;

        //  判断sessionStorage存储的ID和name是否为空;

        $.each(_this.louDong,function(index,val){
            if(parseInt(data) === val.id){
                _this.SameLevel(val.id,val.parentId + "");
                //  如果父级ID为不为空，则添加父级ID到顶部导航；
                _this.repeatAdd(val.parentId);  // 重复添加父级，一直到父级ID为null
            }
        })
    },
    superior:function(){
        //  选择同级；
        var _this = this;
        $(document).on("tap",".switch .nav li",function(){
            //  提示
            $(this).addClass("active")
                .siblings().removeClass("active");

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
        //  获取同级楼栋；pid使用的是字符串
        var html = '';
        this.addressList.empty();
        if(!(pid === "null")){
            html = '<li class="all" data-id="'+ pid +'"><i></i>全部</li>';
        }
        $.each(this.louDong,function(index,val){
            var IndexActive = "";
            if(val.parentId + "" === pid){
                //  保证刷新后突出显示
                if(id === val.id){
                    IndexActive = "active";
                    $('.elem-01 span').text(val.name);
                }
                html += '<li class="'+ IndexActive +'" data-pid="'+ val.parentId +'" data-id = "'+ val.id +'"><i></i>'+ val.name +'</li>';
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
    repeatAdd:function(pid){
        var ParData = this.topSuperior(pid);
        var pidData = ParData?ParData.parentId:"null";
        if(ParData){
            //  如果父级ID不为"null"，则重复添加；   ****** 此操作在前，以此让顶部菜单排列正确！*********
            if(!(pidData === "null")){
                this.repeatAdd(pidData);
            }
            this.topApend(ParData.id,pidData,ParData.name);
        }
    },
    topApend:function(id,pid,text){
        //  将选择的放入顶部导航；id:当前ID ， pid：当前父级ID， text：当前名
        $("#prompt").before('<li data-pid="'+ pid +'" data-id="'+ id +'">'+ text +'</li>');
    },
    topSuperior:function(pid){
        //  判断是否有上一级,如果有上一级则返回数据，如果没有则返回null
        var bur = null;
        //  pid为null时，不遍历；
        if(parseInt(pid)){
            $.each(this.louDong,function(index,val){
                if(parseInt(pid) === val.id){
                    bur = val;
                }
            });
        }
        return bur;

    },
    judgment:function(id){
        //  判断是否有下一级
        var bur = false;
        $.each(this.louDong,function(index,val){
            if(parseInt(id) === val.parentId){
                bur = true;
            }
        });
        return bur;
    }
};
var tap = new dongSwitch();
tap.main();  // 调用总函数；





