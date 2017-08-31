/**
 * Created by Administrator on 2017/8/7.
 */
// var server_IP = "http://192.168.1.42:8910";
var server_IP = "";
var server_v1="/v1";
var server_url = server_IP + "/louloutong-rent/api";
var server_url_repair = server_IP + "/louloutong-repair/api";          // 物业管理
var server_url_notice = server_IP + "/louloutong-notice/api";          // 通知管理
var server_rent = server_IP + "/louloutong-rent/api";                  // 租房管理
var server_url_img = 'http://oud4j7ifk.bkt.clouddn.com/';
var server_uel_user_img = 'http://otqftko25.bkt.clouddn.com/';

var userId = "1980";
var propertyId = sessionStorage.getItem("propertyId");
// var propertyId = "1";
var authority = JSON.parse(sessionStorage.getItem("authority"));       //  权限
var firmId = "1762";                                    //  公司ID


var page = 1;
var reg = /^[\s]*$/;  //为空判断；
//  将报错提示放入公共文件，以方便后期修改；
function ErrorReminder(data){
    console.log("报错：" + data.status);
};

// GET http://ip:port/louloutong-repair/api/v1/property/manager/{userId}.json

// 用户Id	姓名	角色	所属公司
// 1977	刘玄德	物业管理员	科信物业公司
// 1978	关羽	物业管理员	科信物业公司
// 1979	张飞	物业维修人员	科信物业公司
// 1980	赵云	物业维修人员	科信物业公司
// 1981	黄忠	物业运营人员	科信物业公司
// 1982	马超	物业前台人员	科信物业公司
// 1983	李平	物业普通人员	科信物业公司
//
// 1985	荀彧	物业管理员	南山物业公司
// 1987	曹仁	物业管理员	南山物业公司
// 1984	曹操	物业维修人员	南山物业公司
// 1986	陈宇	物业维修人员	南山物业公司
// 1988	甄姬	物业运营人员	南山物业公司
// 1989	荀攸	物业前台人员	南山物业公司
// 1990	曹洪	物业普通人员	南山物业公司



//------------------------------获取网址ID，key是参数名-------------------------------
var urlParams = function (key) {
    var ret = location.search.match(new RegExp('(\\?|&)' + key + '=(.*?)(&|$)'))
    return ret && decodeURIComponent(ret[2])
};

//  将数组转化为字符串，使用.join；并使用字符串判断是否有权限；
function authMethod(data){
    var auth = authority.join("");
    var bur = null;
    if(auth.indexOf(data) > 0){
        bur = true;
    }else{
        bur = false;
    }
    return bur;
}


//选择全部
function checkAll(elem,_this){
    if($(_this).prop('checked')){
        $(elem).find('input[type=checkbox]').prop('checked',true);
    }else{
        $(elem).find('input[type=checkbox]').prop('checked',false);
    }
}


//  底部导航
$(".click-footer a").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
});



function closeMask(){
	$('.mask-bg').remove();
}

function showMask(msg){
	var code=`
		<div class="mask-bg">
		    <div class="mask-con">
		        <div class="tit">提示</div>
		        <div class="main">${msg}</div>
		        <div class="bot">
		            <button class="btn" onclick="closeMask()">确认</button>
		        </div>
		    </div>
		</div>
		`
	$('body').append(code);
}



/*$.ajax({
    url:'http://trr.ngrox.cc/demo/weixin/authorizationLogin',
    type:'get',
    async:false,
    dataType:'json',
    success:function(res){
        
    },
    error:function(res){
     
    }
});*/


function wxConfig() {
    console.info(cur_href)
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
            wx.ready(function () {
                console.log(1)
            });
            wx.error(function (res) {
                //throw res;
                console.log(2)
            });

        },
        error: function (res) {

        }
    })
}

