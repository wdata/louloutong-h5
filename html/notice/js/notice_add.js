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
        console.info($('.p-layout').height())
    }
}
//删除附件
function delDocu(_this){
    $(_this).parent().parent().remove();
}

















