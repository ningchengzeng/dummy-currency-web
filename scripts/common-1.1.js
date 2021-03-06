﻿/**
 * Created by zfd on 2017/8/8.
 */

var apiHots = "//api.feixiaohao.com/";
var tit = $('<div class="tit"></div>');
var ul = $('<ul class="datalist"></ul>');
var s = $('<style>.autocomplete{position:absolute;border:1px solid #eaecef;background:#fff;overflow:hidden;max-width:250px;z-index:999999;box-shadow: 2px 2px 3px #999}.autocomplete ul{padding:0;margin:0;display:block;padding:5px}.autocomplete ul li{height:35px;line-height:35px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;padding:0 5px}.autocomplete ul li a{color:#676a6c;text-decoration:none;font-size:14px;display:block}.autocomplete ul li:hover{background:#3499da;color:#fff}.autocomplete ul li:hover a{color:#fff}.autocomplete .tit{border-bottom:1px solid #eaecef;padding:5px;font-size: 14px;font-family: "Microsoft YaHei",sans-serif;background: #f1f1f1;line-height: normal!important}.autocomplete ul li a img{margin-right: 5px;vertical-align: -2px;}</style>')

$('head').append(s);

function toLocaleString(n, m) {
    if (m == null || m == "") {
        m = 0;
    }

    var str = n.toLocaleString();
    if (-1 == str.lastIndexOf(".")) {
        return str;
    }
    if (m > 0) {
        str = str.substring(0, str.lastIndexOf(".") + 1 + m);
    } else {
        str = str.substring(0, str.lastIndexOf(".") + m);
    }
    return str;
}
function format_market_cap(val) {
    if (val >= 1000000000) {
        val = Math.round(val / 100000000).toLocaleString() + "亿";
    } else if (val >= 100000000) {
        val = (val / 100000000).toFixed(2).toLocaleString() + "亿";
    } else if (val >= 1000000) {
        val = (val / 100000000).toFixed(4).toLocaleString() + "亿";
    } else if (val >= 1000) {
        val = toLocaleString(val, 0);
    }
    else {
        val = toLocaleString(val, 2);
    }
    return val;
}
function formatprice(val) {

    var price = val.toString();
    var indx = price.indexOf('.');
    var priceStr = price;
    var counter = 0;
    if (indx > -1) {
        for (var i = price.length - 1; i >= 1; i--) {
            if (price[i] == "0") {
                counter++;
                if (price[i - 1] == ".") {
                    counter++;
                    break;
                }
            } else {
                break;
            }
        }
        priceStr = "";
        for (var i = 0; i < price.length - counter; i++) {
            priceStr += price[i];
        }
    }
    return priceStr;

} 
function format_crypto(val) {
   
    var result;
    if (val >= 1000) {
        result = toLocaleString(val, 2);
    } else if (val >= 1) {
        result = val.toFixed(2);
    } else {
        if (val > 0.01) {
            result = val.toPrecision(4)
        } else {
            result = val.toFixed(8);
        }
    } 
    return result;
}
function format_crypto_volume(val) {
    if (val >= 1000000) {
        val = Math.round(val / 10000).toLocaleString() + "万";
    } else if (val >= 100000) {
        val = (val / 10000).toLocaleString() + "万";
    } else if (val >= 1000) {
        val = (val / 10000).toFixed(2).toLocaleString() + "万";
    } else if (val >= 100) {
        val = val.toFixed(0).toLocaleString();
    } else if (val >= 0.1) {
        val = val.toFixed(2).toLocaleString();
    }
    else {
        val = val.toFixed(4).toLocaleString();
    }

    return formatprice(val);
}
var currencyCNName = {
    "usd": "美元",
    "eur": "€",
    "cny": "人民币",
    "gbp": "英镑",
    "cad": "加元",
    "rub": "卢布",
    "hkd": "港币",
    "jpy": "日元",
    "aud": "澳元",
    "brl": "巴西雷亚尔",
    "inr": "印尼盾",
    "krw": "韩币",
    "mxn": "比索",
    "idr": "印尼盾",
    "chf": "法郎",
    "eth": "以太坊",
    "btc": "比特币",
	 "twd": "新台币",
};

function toggle_currency(currency) {
    var currency_uppercase = currency.toUpperCase();
    var currency_lowercase = currency.toLowerCase();
    var currency_symbols = {
        "usd": "$",
        "eur": "€",
        "cny": "¥",
        "gbp": "£",
        "cad": "$",
        "rub": "<img src='/themes/default/images/ruble.gif'/>",
        "hkd": "$",
        "jpy": "¥",
        "aud": "$",
        "brl": "R$",
        "inr": "₹",
        "krw": "₩",
        "mxn": "$",
        "idr": "Rp",
        "chf": "Fr",
        "twd": "NT$"
    };
    $("#currency-switch-button").html(currencyCNName[currency_lowercase] + '(' + currency_uppercase + ')<span class="caret"></span>');

    if (currency_lowercase == "btc") {
        $.each([$('.market-cap'), $('.price'), $('.volume')], function () {
            selector_type = this.selector
            $.each(this, function (key, value) {
                amount = $(this).data("btc");

                if (amount != "?") {
                    amount = parseFloat(amount)
                    if (selector_type == ".price") {
                        amount = format_crypto(amount);
                    } else if (selector_type == ".volume") {
                        amount = format_crypto_volume(amount);
                    } else {
                        amount = format_market_cap(amount);
                    }
                }
                $(this).html(amount + " BTC")
            });
        });
    }
    else if (currency_lowercase == "cny") {
        $.each([$('.market-cap'), $('.price'), $('.volume')], function () {
            selector_type = this.selector
            $.each(this, function (key, value) {
                amount = $(this).data("cny");

                if (amount != "?") {
                    amount = parseFloat(amount)
                    if (selector_type == ".price") {
                        amount = format_crypto(amount);
                    } else if (selector_type == ".volume") {
                        amount = format_crypto_volume(amount);
                    } else {
                        amount = format_market_cap(amount);
                    }
                    $(this).html(currency_symbols[currency_lowercase] + amount)
                } else {
                    $(this).html(amount)
                }

            });
        });
    }
    else if (currency_lowercase == "eth") {
        foreign_amount = $("#currency-exchange-rates").data(currency_lowercase);
        $.each([$('.market-cap'), $('.price'), $('.volume')], function () {
            selector_type = this.selector
            $.each(this, function (key, value) {
                slug = $(this).closest('tr').attr("id");
                amount = $(this).data("usd");

                if (amount != "?") {
                    amount = parseFloat(amount) / foreign_amount
                    if (selector_type == ".price") {
                        if (slug == "id-ethereum") {
                            amount = 1;
                        }
                        amount = format_crypto(amount);
                    } else if (selector_type == ".volume") {
                        amount = format_crypto_volume(amount);
                    } else {
                        amount = format_market_cap(amount);
                    }
                }
                $(this).html(amount + " ETH")
            });
        });
    } else {
        foreign_amount = $("#currency-exchange-rates").data(currency_lowercase);
        $.each([$('.market-cap'), $('.price'), $('.volume')], function () {
            selector_type = this.selector
            $.each(this, function (key, value) {
                amount = $(this).data("usd");

                if (amount != "?") {
                    amount = parseFloat(amount) / foreign_amount
                    if (selector_type == ".price") {
                        amount = format_crypto(amount);
                    } else if (selector_type == ".volume") {
                        amount = format_crypto_volume(amount);
                    } else {
                        amount = format_market_cap(amount);
                    }
                    $(this).html(currency_symbols[currency_lowercase] + amount);
                } else {
                    $(this).html(amount);
                }

            });
        });
    }
    data_symbol = currency_lowercase
    if (currency_lowercase != "btc") {
        data_symbol = "usd"
    }
    $.each([$('.percent-1h'), $('.percent-24h'), $('.percent-7d')], function () {
        $.each(this, function (key, value) {
            slug = $(this).closest('tr').attr("id");
            if (slug == "id-ethereum" && currency_lowercase == "eth") {
                $(this).html("0.00" + "%")
            } else {
                convert_percent($(this), data_symbol)
            }
        });
    });
}
function toggle_native() {
    $("#currency-switch-button").html("平台价格" + " <span class=\"caret\"></span>");
    $.each([$('.price'), $('.volume')], function () {
        selector_type = this.selector
        $.each(this, function (key, value) {
            amount = $(this).data("native");
            if (amount == null) {
                amount = "N/A";
            }
            else if (amount != "?") {
                amount = parseFloat(amount)
                if (selector_type == ".price") {
                    amount = format_crypto(amount);
                } else if (selector_type == ".volume") {
                    amount = format_crypto_volume(amount);
                } else {
                    amount = format_market_cap(amount);
                }
            }
            $(this).html(amount);
        });
    });
}
function toggle_platform() {
    $("#currency-switch-button").html("Platform" + " <span class=\"caret\"></span>");
    $.each([$('.market-cap'), $('.price'), $('.volume')], function () {
        selector_type = this.selector
        $.each(this, function (key, value) {
            amount = $(this).data("platform");
            var platform_symbol = $(this).closest('tr').data("platformsymbol");
            if (amount == null || amount === "None") {
                amount = "?";
            }
            else if (amount != "?") {
                amount = parseFloat(amount)
                if (selector_type == ".price") {
                    amount = format_crypto(amount);
                } else {
                    amount = format_market_cap(amount);
                }
            }
            var text = amount + " " + platform_symbol
            $(this).html(text);
        });
    });
    $.each([$('.percent-1h'), $('.percent-24h'), $('.percent-7d')], function () {
        $.each(this, function (key, value) {
            convert_percent($(this), "platform")
        });
    });
}
$(document).ready(function () {
    if (window.location.hash) {
        hash = window.location.hash.substring(1);
        if (hash == "native" || hash == "BTC" || hash == "ETH" || hash == "USD" || hash == "EUR" || hash == "CNY" || hash == "GBP" || hash == "CAD" || hash == "RUB" || hash == "HKD" || hash == "JPY" || hash == "AUD" || hash == "BRL" || hash == "INR" || hash == "KRW" || hash == "MXN" || hash == "IDR" || hash == "CHF") {
            if (hash == "native") {
                toggle_native();
            } else {
                toggle_currency(hash);
            }

            if ($(".unit2").length > 0) {
                for (var i = 0; i < $(".unit2 a").length; i++) {
                    $(".unit2 a").eq(i).removeClass("active");
                    if ("#" + hash == $(".unit2 a").eq(i).attr("href")) {
                        $(".unit2 a").eq(i).addClass("active");
                    }
                }
            }
        }

    }
    $(".price-toggle").click(function () {
        var text = $(this).text();
        $(this).closest('.unit').find('button').eq(0).html(text);
        var currency = $(this).data('currency');

        if (currency == "native") {
            toggle_native();
        } else if (currency == "platform") {
            toggle_platform();
        } else {
            toggle_currency(currency);
        }
    });
});

//首页页头行情实时推送 new 2017-11-13
function preheadUpdate_New(a, data, char,ishome) {
    var old = parseInt($('.showmarket .cell').eq(a).find('.num').text());
    if (old == data) {
        return;
    }
    if (ishome&&0 == a) {
        document.title = data + ' BTC-比特币(Bitfinex) - 币小金';
    }

    if (a >= 0 && a < 3) {
        var obj = $('.showmarket .cell').eq(a);
        var old = parseInt(obj.find('.num').text());
        if (old > data) {
            if (obj.find('.num').hasClass('text-red')) {
                obj.find('.num').text(returnFloat(data))
            }
            else {
                obj.find('.num').text(returnFloat(data)).removeClass('text-green').addClass('text-red');
            }
            obj.find('.char span').text(char).peity("line", {
                width: 50,
                height: 15,
                fill: '#f5f5f5',
                strokeWidth: 1,
                stroke: '#e40101'
            });
        }
        else {
            if (obj.find('.num').hasClass('text-green')) {
                obj.find('.num').text(returnFloat(data))
            }
            else {
                obj.find('.num').text(returnFloat(returnFloat(data))).removeClass('text-red').addClass('text-green');

            }
            obj.find('.char span').text(char).peity("line", {
                width: 50,
                height: 15,
                fill: '#f5f5f5',
                strokeWidth: 1,
                stroke: '#3ca316'
            });
        }
    }
   
}

var b;
//首页表格行情实时推送
function tableUpdate(tr, name, cny, usd, btc) {//a是tr的ID
    

    hash = window.location.hash.substring(1);
    if (hash == "BTC" || hash == "ETH" || hash == "USD" || hash == "EUR" || hash == "CNY" || hash == "GBP" || hash == "CAD" || hash == "RUB" || hash == "HKD" || hash == "JPY" || hash == "AUD" || hash == "BRL" || hash == "INR" || hash == "KRW" || hash == "MXN" || hash == "IDR" || hash == "CHF") {

    } else {
        hash = "CNY";
    }
    switch (name) {
        case 'P'://价格
            var priceRow = tr.find('.price');
            var lastcny = priceRow.data("cny");
            priceRow.data("usd", usd);
            priceRow.data("cny", cny);
            priceRow.data("btc", btc);

            var change = 0;

            if (lastcny > 0) {
                change = parseFloat(cny) - parseFloat(lastcny);
            }

            var showPrice = getShowcurrency("price", hash, cny, usd, btc);
            if (change > 0) {
                priceRow.text(showPrice).css('background', '#eee').animate({ backgroundColor: 'transparent' }, 1500).addClass('text-green');
            } else if (change < 0) {
                priceRow.text(showPrice).css('background', '#eee').animate({ backgroundColor: 'transparent' }, 1500).addClass('text-red');
            } else {
                priceRow.text(showPrice).css('background', '#eee').animate({ backgroundColor: 'transparent' }, 1500);
            }
         
            (function ($) {
                var b = setTimeout(function () {
                    priceRow.removeClass('text-green').removeClass('text-red');
                }, 10000);
                priceRow.closest("td").attr('data-timeid', b);

            })(jQuery);


            break;
        case 'V'://成交量
            var priceRow = tr.find('.volume');
            priceRow.data("usd", usd);
            priceRow.data("cny", cny);
            priceRow.data("btc", btc); 
            var showPrice = getShowcurrency("volume", hash, cny, usd, btc);
            priceRow.text(showPrice).css('background', '#eee').animate({ backgroundColor: 'transparent' }, 2000);
            break;
        case 'C'://市值
            var priceRow = tr.find('.market-cap');
            priceRow.data("usd", usd);
            priceRow.data("cny", cny);
            priceRow.data("btc", btc); 
            var showPrice = getShowcurrency("marketcap", hash, cny, usd, btc);

            priceRow.text(showPrice).css('background', '#eee').animate({ backgroundColor: 'transparent' }, 2000);
            break;
    }
}


function tableUpdateChange(tr, change) {//a是tr的ID
    //var tr = $('table').find(a);
    var changeSpan = tr.find('.change').find('span');
      changeSpan.removeClass('text-green').removeClass('text-red');
    var changePercent = change + "%";
    if (change > 0) {
        changeSpan.text(changePercent).css('background', '#eee').animate({ backgroundColor: 'transparent' }, 1500).addClass('text-green');
    } else if (change < 0) {
        changeSpan.text(changePercent).css('background', '#eee').animate({ backgroundColor: 'transparent' }, 1500).addClass('text-red');
    } else {
        changeSpan.text(changePercent).css('background', '#eee').animate({ backgroundColor: 'transparent' }, 1500);
    } 
    
}

function getShowcurrency(selector_type, currency, cny, usd, btc) {
    var currency_uppercase = currency.toUpperCase();
    var currency_lowercase = currency.toLowerCase();
    var currency_symbols = {
        "usd": "$",
        "eur": "€",
        "cny": "¥",
        "gbp": "£",
        "cad": "$",
        "rub": "<img src='/themes/default/images/ruble.gif'/>",
        "hkd": "$",
        "jpy": "¥",
        "aud": "$",
        "brl": "R$",
        "inr": "₹",
        "krw": "₩",
        "mxn": "$",
        "idr": "Rp",
        "chf": "Fr",
    };

    if (currency_lowercase == "btc") {
        return getAmount(selector_type, btc) + " BTC";
    } else if (currency_lowercase == "eth") {
        return getAmount(selector_type, btc) + " ETH";
    }
    else if (currency_lowercase == "cny") {
        return currency_symbols[currency_lowercase] + getAmount(selector_type, cny);
    } else if (currency_lowercase == "usd") {
        return currency_symbols[currency_lowercase] + getAmount(selector_type, usd);
    }
    else {
        foreign_amount = $("#currency-exchange-rates").data(currency_lowercase);
        amount = parseFloat(usd) / foreign_amount
        return currency_symbols[currency_lowercase] + getAmount(selector_type, amount);

    }

}

function getAmount(selector_type, amount) { 
    amount = parseFloat(amount);
    if (selector_type == "price") {
        amount = format_crypto(amount);
    } else if (selector_type == "volume") {
        amount = format_crypto_volume(amount);
    } else {
        amount = format_market_cap(amount);
    }
    return amount;
}


function returnFloat(value) {//保留两位
    var value = Math.round(parseFloat(value) * 100) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
		if(parseFloat(value)>=100000)
		{ 
	   value = parseInt(value).toString() ; 
		}else{
			 value = value.toString() 
		} 
        return value;
    }
    if (xsd.length > 1) {
        if(parseFloat(value)>=100000)
		{ 
	   value = parseInt(value).toString() ; 
		}else{
			 value = value.toString() ;
		} 
	 
        return value;
    }
}


//下拉菜单
$('.slideBtn').click(function (e) {
    e.stopPropagation();
    if ($(this).find('ul').css('display') !== 'block') {
        $('.slideBtn').find('ul').css('display', 'none');
        $(this).find('ul').slideDown(100);
    }
    else {
        $('.slideBtn').find('ul').slideUp(100);
    }
});
$('.unit ul li').click(function () {
    $(this).closest('.slideBtn').find('button').text($(this).text());
    $('.slideBtn').find('ul').slideUp(100);

});

//点击屏幕取消
$('html').click(
    function () {
        $('.slideBtn ul').slideUp(100);
    }
);
//固定导航
function fixedNav() {
    $(window).scroll(function () {
        if ($(window).scrollTop() > 0) {
            $('nav').addClass('fixedNav');
            /* $('body').css('padding-top','66px');*/

        }
        else {
            $('nav').removeClass('fixedNav');

        }
    });
}
fixedNav();
//分页切换
$('.tabTit .tit').click(function () {
    
    var box = $(this).closest('.box').find('.tabBody');
    var index = $(this).index();
    if (box.eq(index).css('display') !== 'block') {
        $(this).closest('.tabTit').find('.tit').removeClass('active');
        $(this).addClass('active');
        box.css('display', 'none');
        box.eq(index).fadeIn('100');
    }
});

//滚动固定fixedBox
$(window).scroll(function () {
    var fixedBox = $('.fixedBox');
    if (window.screen.width > 1400) {
        for (var i = 0; i < fixedBox.length; i++) {
            if ($(window).scrollTop() > parseInt(fixedBox.eq(i).data('fixed'))) {
                var width = fixedBox.eq(i).offset().left + 'px';
                fixedBox.eq(i).css('position', 'fixed').css({ 'left': width, 'top': '93px' });
            }
            else {
                fixedBox.eq(i).css('position', 'relative').css({ 'left': 'auto', 'top': 'auto' });
            }
        }
    }
});

$('.searchBtn').click(function () {
    var input = $(this).closest('.searchForm2').find('input')
    if (input.hasClass('open')) {
        input.removeClass('open');
    }
    else {
        input.val('').addClass('open').focus();
    }
});
//固定页脚
//(function () {
//    if ($('body>.w1200').height() < 800) {
//        $('footer').css('position', 'absolute').css('bottom', '0').css('left', '0').css('right', '0')
//    }
//})();
//网页加载进度条
/*
 * @Author: fanqian
 * @Date:   2016-06-15 12:34:55
 * @Website:   //iterabc.com/preload-js/
 * @使用请注明作者和网站
 *
 */
$.QianLoad = {
    PageLoading: function (options) {
        var defaults = {
            delayTime: 3000, //页面加载完成后，加载进度条淡出速度
            sleep: 0, //设置挂起,等于0时则无需挂起
            css: '<style>*{margin:0;}.load-wrap{width:100%;height:100%;position:absolute;top:0;left:0;background:#ffffff}#pre-load{position:fixed;top:0;height:2px;background:#3499da;transition:opacity .5s linear;z-index:99999999}#pre-load span{position:absolute;width:150px;height:2px;-webkit-border-radius:100%;-webkit-box-shadow:#2085c5 1px 0 6px 1px;opacity:1;right:-10px;-webkit-animation:pulse 2s ease-out 0s infinite}@-webkit-keyframes pulse{30%{opacity:.6}60%{opacity:0}to{opacity:.6}}</style>'
            //进度条样式位置可以自己修改
        }
        var options = $.extend(defaults, options);
        //在页面未加载完毕之前显示的loading Html自定义内容
        $('head').append(defaults.css);
        var _LoadingHtml = '<div id="pre-load">' + '<span></span>' + '</div>';
        //呈现loading效果
        $("body").append(_LoadingHtml);
        //监听页面加载状态
        document.onreadystatechange = PageLoaded;
        function PageLoaded() {
            var loadingMask = $('#pre-load');
            $({
                property: 0
            }).animate({
                property: 98
            }, {
                duration: 3000,
                step: function () {
                    var percentage = Math.round(this.property);
                    loadingMask.css('width', percentage + "%");
                    //页面加载后执行
                    if (document.readyState == "complete") {
                        loadingMask.css('width', 100 + "%");
                        setTimeout(function () {
                            loadingMask.animate({
                                "opacity": 0
                            },
                                0,
                                function () {
                                    $(this).remove();
                                    $(".load-wrap").remove();
                                    console.log('Loading has been successful');
                                });
                        },
                            300);
                    }
                }
            });
        }
    }
}
$.QianLoad.PageLoading({
    sleep: 50
});
  function updateGbi(id, data) {

      var lastdata = $("#" + id).text();
      var newdata = data; 
      updateGlobalDataCss(id, lastdata, newdata, newdata);
  }
  function updateVol_MarketCap(id, data) {
     
      var lastdata = $("#" + id).text().replace("¥", "").replace("亿", "");
      var newdata = (data / 100000000).toFixed(2);
      var newValue = "¥" + newdata + "亿";
      updateGlobalDataCss(id, lastdata, newdata, newValue);
  }

  function updateGlobalDataCss(id, lastdata, newdata, newValue) {
      if (lastdata > newdata) {
          if ($("#" + id).hasClass('text-red')) {
              $("#" + id).text(newValue);
          }
          else {
              $("#" + id).text(newValue).removeClass('text-green').addClass('text-red');
          }

      }
      else {
          if ($("#" + id).hasClass('text-green')) {
              $("#" + id).text(newValue);
          }
          else {
              $("#" + id).text(newValue).removeClass('text-red').addClass('text-green');

          }
      }
  }

  //tabTit-a
  $('body').on('click', '.tabTit-a li', function () {
      var index = $(this).index();
      var table = $(this).closest('.tabBody').find('table');
      if (table.eq(index).css('display') == 'table') {

          return
      }
      else {
          table.css('display', 'none');
          table.eq(index).fadeIn('fast');
          $(this).closest('.tabTit-a').find('li').removeClass('active');
          $(this).addClass('active');
      }
  });

  var length =0
  function coinConceptSlide() {
      length = $('.hotidea a').length;
     
      var max = Math.ceil(length / 4);
      var d = 292;
      var page = 1;
      $('.slideBar .slideright').click(function () {
          if (page < max) {
              $('.hotidea>div').eq(0).animate({ 'margin-left': -292 * page + 'px' }, 500)
              page++;
          }
      });
      $('.slideBar .slideleft').click(function () {
          if (page != 1) {
              page--;
              $('.hotidea>div').eq(0).animate({ 'margin-left': -292 * (page - 1) + 'px' }, 500)
          }
      })
  }
  function search(word) {
      if (word == undefined || word == null || word.length < 1 || word.trim().length < 1) {
          alert("请输入关键词");
          return false;
      }
      else {
		      word = word.trim();
          window.location.href = "/search?word=" + encodeURIComponent(word);
          //alert(window.location.href = "/search?word=" + encodeURIComponent(word));
      }
  }

  function getUserInfo() {
      $.ajax({
          type: "POST",
          url: apiHots+ "/loginapi/getlogininfo",
          xhrFields: {
              withCredentials: true
          },
          success: function (data) {
              var result = eval("(" + data + ")");

              if (result.status == "success") {
                  if (result.username.length > 0 || result.userid.length > 0) {
                      $(".userinfo").css('display', 'block');
                      $(".unlogin").css('display', 'none');
                      if (result.username.length > 0) {
                          $(".userLinks .username").html(result.username);
                      } else {
                          $(".userLinks .username").html(result.userid);
                      }

                      return;
                  } else {
                      $(".userLinks .username").html(result.userid);
                  }

              }

              $(".userinfo").css('display', 'none');
              $(".unlogin").css('display', 'block');


          }
      })
  };
  function logout() {
      if (confirm("确认退出吗？")) {
          var parms = new Object();
          $.ajax({
              url: apiHots + "user/logout",
              data: parms,
              type: "post",
              async: true,
              xhrFields: {
                  withCredentials: true
              },
              success: function (data) {
                  logoutResponse(data);
              }
          });
         
      }
  }
  //处理logout反馈信息
  function logoutResponse(data) {

      var result = eval("(" + data + ")");
      if (result.status == "success") {
          DelCookie("fxhuid");
          DelCookie("distinctuid");
          window.location.href = '/';
      }
      else {
          alert(result.content);
      }
  }

  function DelCookie(name) {
      var exp = new Date();
      exp.setTime(exp.getTime() + (-1 * 24 * 60 * 60 * 1000));
      var cval = GetCookieValue(name);
      document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
  }
  function GetCookieValue(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
              var cookie = jQuery.trim(cookies[i]);
              //PYYH=USERNAME=steven&PASSWORD=111111&UserID=1&UserType=1
              if (cookie.substring(0, name.length + 1) == (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  //USERNAME=steven&PASSWORD=111111&UserID=1&UserType=1
                  break;
              }
          }
      }
      return cookieValue;
  }

  //*******************************************搜索结果
//搜索结果--添加自选(全网)
function addsearchchose(keys) {

    var id = keys.attr("id");

    keys.attr("disabled", "disabled");
    keys.html("提交中...");
    var parms = new Object();
    var coincode = id.split("#")[1];
    var symbolpair = id.split("#")[2];
    parms["coincode"] = coincode;
    parms["symbolpair"] = symbolpair;
    parms["type"] = "1";

    $.ajax({
        url: apiHots + "user/CoinSearchFocus",
        data: parms,
        type: "post",
        async: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            addsearchfocusResponse(data);
        }
    });
    function addsearchfocusResponse(data) {

        var result = eval("(" + data + ")");
        if (result.status == "success") {
            keys.attr("onclick", "cancelsearchchose($(this))");
            keys.attr("class", "hasaddto disactive");

            keys.removeAttr("disabled");
            keys.html("移除自选");
        }
        else {
            alert(result.content);
            keys.removeAttr("disabled");
            keys.attr("class", "addto disactive");
            keys.html("添加自选");
        }

    }
}

//搜索结果--取消自选（全网）
function cancelsearchchose(keys) {

    var id = keys.attr("id");

    keys.attr("disabled", "disabled");
    keys.html("提交中...");
    var parms = new Object();
    var coincode = id.split("#")[1];
    var symbolpair = id.split("#")[2];
    parms["coincode"] = coincode;
    parms["symbolpair"] = symbolpair;
    parms["type"] = "2";
    $.ajax({
        url: apiHots + "user/CoinSearchFocus",
        data: parms,
        type: "post",
        async: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            cancelsearchfocusResponse(data);
        }
    });


    function cancelsearchfocusResponse(data) {


        var result = eval("(" + data + ")");
        if (result.status == "success") {
            keys.attr("onclick", "addsearchchose($(this))");
            keys.attr("class", "addto disactive");
            keys.removeAttr("disabled");
            keys.html("添加自选");
        }
        else {
            alert(result.content);
            keys.removeAttr("disabled");
            keys.attr("class", "hasaddto disactive");
            keys.html("移除自选");
        }
    }
}
function MoreSearchCoin(btn, url, obj) {
      url = apiHots + url;
      page = parseInt(btn.attr('page')) + 1;

      var urlparam = "";
      if (url.indexOf("?") > -1) {
          urlparam = "&page=" + page;
      } else {
          urlparam = "?page=" + page;
      }
      info = $.ajax({
          url: url + urlparam,
          async: false,
          xhrFields: {
              withCredentials: true
          },
          success: function (data) {
              if (data == '') {
                  btn.css("display", "none");
              }
              else {
                  if (data != 'error') {
                      $("#table").append(data);
                      btn.attr("page", page);
                  }
              }
          }
      });

  }

  function MoreSearchExchange(btn, url, obj) {
      url = apiHots + url;
      page = parseInt(btn.attr('page')) + 1;

      var urlparam = "";
      if (url.indexOf("?") > -1) {
          urlparam = "&page=" + page;
      } else {
          urlparam = "?page=" + page;
      }
      info = $.ajax({
          url: url + urlparam,
          async: false,
          xhrFields: {
              withCredentials: true
          },
          success: function (data) {
              if (data == '') {
                  btn.css("display", "none");
              }
              else {
                  if (data != 'error') {
                      $("#liEx").append(data);
                      btn.attr("page", page);
                  }
              }
          }
      });

  }
//*******************************************