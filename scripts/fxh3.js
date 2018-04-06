$(document).ready(function () {
	  if ($('#indexheadad').length > 0) {
        //   var headAd01 = $('<div class="col-2" id="headAd03"><a href="https://support.huobipro.com/hc/zh-cn/articles/360000050451--%E7%AB%8B%E5%8D%B3%E4%B8%8B%E8%BD%BD-%E7%81%AB%E5%B8%81Pro%E6%A1%8C%E9%9D%A2%E5%AE%A2%E6%88%B7%E7%AB%AF-%E6%9B%B4%E5%AE%89%E5%85%A8-%E6%9B%B4%E8%BD%BB%E5%BF%AB-%E6%9B%B4%E4%B8%93%E4%B8%9A"  target="_blank"><img src="//static.feixiaohao.com/themes/default/images/vip/huobi_pc.jpg?v=1"></a></div>');
        //   $('#indexheadad .col-3').before(headAd01);
    }
	
   
    var div2 = $('<div style="height: 100px;overflow: hidden"><a   id="spread3"  href="https://jq.qq.com/?_wv=1027&k=5lq5xL3" title="非小号QQ群" target="_blank"><img src="themes/default/images/index03.png"></a></div>');
$('.outlink3').append(div2);


if($('.bannerIner').length>0)
{ 
var a = $('<a href="//robot.feixiaohao.com" id="spread2" target="_blank" page="1"><img src="//static.feixiaohao.com/themes/default/images/home_fxhrobot.png" ></a>');
 a.appendTo('.bannerIner');
}
/*
if($('.bannerPoin').length>0)
{ 
var i = $('<i class="scrollLeft"></i><i class="scrollRight"></i>');
i.appendTo('.bannerPoin');
}
var all = $('.bannerIner a').length;
var count = 0;
var banner = '';

function bannerscroll(count) {
    $('.bannerIner a').eq(0).animate({
        'margin-left': '-325px'
    }, 500, function () {
        $(this).css('margin-left', '0').appendTo('.bannerIner');
        $('.bannerPoin i').removeClass('active');
        if (count) {
            $('.bannerPoin i').eq(count).addClass('active');
        }

    })
}
function banner1() {
    banner = setInterval(function () {
        count++;
        if (count == all) {
            count = 0;
        }
        bannerscroll(count)
    }, 5000);
}
banner1();

$('.scrollRight').click(function () {
    clearInterval(banner);
    var c = $('.bannerIner a').eq(all - 1).css('margin-left', '-325px')
    $('.bannerIner').prepend(c);
    $('.bannerIner a').eq(0).animate({
        'margin-left': '0'
    }, 500)
    banner1();
});

$('.scrollLeft').click(function () {
    count++
    clearInterval(banner);
    bannerscroll(count)
    banner1();
});
*/
	
$('body').on('click', '#spread1_0,#spread1_1,#spread2,#spread2_2,#spread3', function () {
		var  thiscode=$(this).attr("id");
    $.ajax({

        url:'//api.feixiaohao.com/sitestat/?code='+thiscode,
        type: "GET",
        success:function(data){
             return;
        },
        error:function(){
            return;
        }
    })
});

});




