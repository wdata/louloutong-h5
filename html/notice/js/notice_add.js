var urls = [];  // 记录file内上传；

$(document).ready(function(){
    var u=$(window).width()>750?54:$(window).width()/10;
    var ww=$(window).width();
    var wh=$(window).height();
    $('.publish-add-box').css('height',wh-$('.return-column').height()-$('.add-bot').height());
    $('#editor_box').css('min-height',wh-$('.return-column').height()-$('.publish-add-box .tt').height()-$('.add-bot').height()-u);
    $('.receive-box .list-con').height(wh-$('.search').height()-$('.return-column').height());
    $('.publish-box,.receive-box,.return-column').width(ww);
})

//选择接收人之后
function rePublish(){
    $('.p-layout').css('transform','translateX(0)');
    var recei_str="";
    var recei_num=0;
    $('input[type=checkbox]:checked').each(function(){
        recei_str+=$(this).parents('.list').find('.tit').text()+',';
        recei_num++;
    })
    if(recei_str){
        $('#recei_comp').text(recei_str);
        $('.icon-wrap').addClass('cblue').text('共'+recei_num+'个接收人');
    }else{
        $('#recei_comp').text('全部企业'); 
        $('.icon-wrap').removeClass('cblue').html("选择接收人<i class='icon icon-in'></i>");
    }
    
}


//上传附件
function getDocu(_this){
    var name=_this.value;
    var postfix=name.substring(name.lastIndexOf(".") + 1).toLowerCase();
    if(postfix!='doc' && postfix!='docx' && postfix!='docm' && postfix!='dotx' && postfix!='dotm' && postfix!='xlsx' && postfix!='xls' && postfix!='xlsm' && postfix!='xltx' && postfix!='xltm' && postfix!='pdf'){
        alert('请选择word，excel，pdf的格式文件上传！');
        _this.value==' ';
        $(_this).attr('src',' ');
        return false;
    }else{
        var icon_class=postfix.indexOf('do')!=-1?'word-icon':postfix.indexOf('xl')!=-1?'excel-icon':'pdf-icon';
        var code=`
                <li>
                    <i class="suffix-icon pdf-icon hide"></i>
                    <i class="suffix-icon ${icon_class}"></i>
                    <i class="suffix-icon word-icon hide"></i>
                    <p class=""><span>${name.substring(name.lastIndexOf("\\")+1,name.lastIndexOf(".")+1)}</span>${postfix}</p>
                    <i class="delete-icon" onclick="delDocu(this)"></i>
                </li>

            `;
        $('#up_attach').append(code);
        // console.info($('.p-layout').height());

        $.each($(_this)[0].files,function(index,val){
            urls.push(val);
        });
        console.log(urls);
    }
}
//删除附件
function delDocu(_this){
    $(_this).parent().parent().remove();
}





function release(){

    var content = $("#editor_box").html();  // 内容
    var title = $("#title").val();       //标题

    if(title.length < 4){
        showMask("请输入长度大于4个字符的标题！");
        return;
    }
    if(reg.test(content)||content === ""){
        showMask("请输入正文！");
        return;
    }
    if($(".firmIds:checked").length <= 0){
        showMask("请选择接收人！");
        return;
    }

    var form = new FormData($("#newForm")[0]);       //需要是JS对象
    var firmIds = "";             // 接收数组
    $.each($(".firmIds:checked"),function(x,y){
        if(x === 0){
            firmIds += $(y).attr("data-id");
        }else{
            firmIds += "," + $(y).attr("data-id");
        }
    });




    form.append("propertyId",propertyId);
    form.append("userId",userId);
    form.append("content",content);
    form.append("urls",urls);       // 附件数组
    form.append("requiredReceipt",1);
    form.append("firmIds",firmIds);

    $.ajax({
        type:'post',
        url:  server_url_notice + server_v1 + '/notify.json',
        data: form,
        contentType: false,
        processData: false,
        success:function(data){
            if(data.code === 0 && data.message === "SUCCESS"){
                // window.location.href = "notice_list.html";
            }
        },
        error:function(data){ErrorReminder(data);}
    });
}

//  入驻企业；
$.ajax({
    type:'get',
    url:  server_url_repair + server_v1 + '/propertyFirms/'+ 2 +'.json',
    data: null,
    dataType:'json',
    success:function(data){
        var list = $(".list-con");
        $(".list-top").siblings().remove();  // 清除其他
        var html = '';
        if(data.code === 0 && data.data){
            $.each(data.data,function(index,val){
                html += '<div class="list"> <div class="tx fl"><img src="../../images/icon/photo.png" alt="" class="full"></div> <div class="tit fl">'+ val.name +'</div> <div class="check-box fr"> <input class="firmIds " data-id="'+ val.id +'" type="checkbox" /> <label for=""></label> </div> <div class="clear"></div> </div>'
            });
            list.append(html);
        }
    },
    error:function(data){ErrorReminder(data);}
});












