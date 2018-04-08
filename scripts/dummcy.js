var BASE_URL = "http://192.168.99.101/";

/**
 * 工具处理
 * @type {{loadHomeNewCoin: util.loadHomeNewCoin, loadHomevolrank: util.loadHomevolrank, loadHomeCoinMaxChange: util.loadHomeCoinMaxChange, loadconcept: util.loadconcept}}
 */
var util={
    loadHomeNewCoin: function() {
        var uri = BASE_URL + "api/currency/homenewcoin";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $("#newCoin").append(data);
                $('#newCoinloadding').hide();
            }
        });
    },

    loadHomevolrank: function() {
        var uri = BASE_URL +"api/currency/homevolrank";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $('#loadlrank').hide();
                $("#vol_coin").append(data.result1);
                $("#vol_upDown").append(data.result2);
            }
        });
    },

    loadHomeCoinMaxChange: function() {
        var uri = BASE_URL +"api/currency/HomeCoinMaxChange";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $('#loadmaxchange').hide();
                $("#maxchange_up").after(data.result1);
                $("#maxchange_down").after(data.result2);
            }
        });
    },

    loadconcept: function(conceptid) {
        var uri = BASE_URL +"api/currency/hotconcept";
        $.ajax({
            url: uri,
            dataType: "json",
            data:'conceptid='+conceptid,
            success: function (data) {
                if (null != data.result1 && data.result1.length > 0) {
                    $('#loadhotconcept').hide();
                    $("#hotconcept").html("");
                    $("#hotconcept").append(data.result1);
                    coinConceptSlide();
                    $('body').on('click', "#hotconcept a", function () {
                        if ($(this).hasClass('active')) {
                            return;
                        }
                        $('#hotconcept a').removeClass('active');
                        $(this).addClass('active')

                    })
                }
                if (null != data.result2 && data.result2.length > 0) {
                    $('#loadhotconcept').hide();
                    $("#hotconceptCoinTable").html("");
                    $("#hotconceptCoinTable").append(data.result2);
                }
            }
        });
    }
};
/**
 * index.html
 * 主页处理
 * @type {{pageCount: number, pageSize: number, pageCurrent: number, row: index.row, page: {pageReader: index.page.pageReader, next: index.page.next, prev: index.page.prev}, ajaxData: index.ajaxData, process: index.process}}
 */
var index = {
    pageCount: 1,
    pageSize: 50,
    pageCurrent: 1,
    row: function(data){
        return "<tr style='height: 20px;' id=\""+ data["code"] +"\">" +
            "<td>" +data["index"] + "</td>" +
            "<td>" +
            "<a href=\"currencies.html?currency="+ data["code"] +"\" target=\"_blank\">" +
            "<img src=\""+data["icon"]+"\" alt=\""+ data["title"] +"\">" +data["title"]+
            "</a>" +
            "</td>" +
            "<td class=\"market-cap\" data-usd=\""+data["circulation"]["usd"]+"\" data-cny=\""+data["circulation"]["cny"]+"\" data-btc=\""+data["circulation"]["btc"]+"\">"+data["circulation"]["init"]+"</td>" +
            "<td>" +
            " <a href=\"currencies.html?currency="+ data["code"] +"\" target=\"_blank\" class=\"price\" data-usd=\""+data["price"]["usd"]+"\" data-cny=\"" +data["price"]["usd"]+ "\"" +
            "   data-btc=\"" +data["price"]["btc"]+ "\">" +data["price"]["init"]+ "</a>" +
            " </td>" +
            " <td>" +data["amount"]+ "</td>" +
            " <td>" +
            " <a href=\"currencies.html?currency=" + data["code"] + "\" target=\"_blank\" class=\"volume\" " +
            "data-usd=\"" + data["circulation"]["usd"] + "\"" +
            "data-cny=\"" + data["circulation"]["usd"] + "\" " +
            "data-btc=\"" + + data["circulation"]["usd"] + + "\">" + data["circulation"]["init"] + "</a>" +
            "</td>" +
            "<td class=\"change\">" +
            "  <span class=\"text-green\">" +data["circulationRate"]+ "</span>" +
            " </td>" +
            " <td class=\"change\">" +
            "   <span class=\"text-green\">" +data["roseRate"]["day"]+ "</span>" +
            "</td>" +
            "</tr>";
    },
    page:{
        pageReader: function(){
            $("div.pageList").empty();

            if(index.pageCurrent == 1){
                $("div.pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="index.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">首页</a>'+
                    '<a class=\'btn btn-white\' onclick="index.page.next()" href=\'#\'>></a>');
            }else if(index.pageCurrent == index.pageCount -1){
                $("div.pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="index.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">尾页</a>'+
                    '<a class=\'btn btn-white\' onclick="index.page.next()" href=\'#\'>></a>');
            }else{
                $("div.pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="index.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">第' + index.pageCurrent + '页</a>'+
                    '<a class=\'btn btn-white\' onclick="index.page.next()" href=\'#\'>></a>');
            }
        },
        next: function(){
            if(index.pageCurrent < index.pageSize){
                index.pageCurrent ++;
            }
            index.page.pageReader();
            index.ajaxData();
        },
        prev: function(){
            if(index.pageCurrent > 1){
                index.pageCurrent -- ;
            }
            index.page.pageReader();
            index.ajaxData();
        }
    },
    ajaxData: function(){
        if(window.interval){
            window.clearInterval(window.interval);
            delete window.interval;
        }

        var data = function(){
            var urip = BASE_URL +"api/currency/indexAll?pageSize=" + index.pageSize+ "&page=" + index.pageCurrent;
            $.ajax({
                url: urip,
                type: "GET",
                dataType: 'json',
                success: function (data) {
                    index.pageCount = Math.ceil(data.count/index.pageSize);
                    index.page.pageReader();
                    $("div.boxContain table#table tbody").empty();
                    $(data.result).each(function (indexData, item) {
                        $("div.boxContain table#table tbody").append(index.row(item));
                    });
                }
            });
        };

        data();
        window.interval = window.setInterval(data, 1000 * 2);
    },
    process : function(){
        index.ajaxData();
        util.loadHomeNewCoin(); //新币
        util.loadHomevolrank(); //销售量排行
        util.loadHomeCoinMaxChange(); //自大交易
        util.loadconcept(0);//热门概念
    }

};

/**
 * newcoin.html
 * 最近一个月上市的虚拟币列表
 * @type {{row: newCoin.row, getNewCoin: newCoin.getNewCoin, setvalue: newCoin.setvalue, validate: newCoin.validate, process: newCoin.process}}
 */
var newCoin = {
    row: function(data){
        return '<tr>'
            + '<td><a href="currencies.html?currency='+data.code+'" target="_blank"><img src="'+newCoin.setvalue(data.icon)+'" alt="'+data.title.cn+'">'+data.title.cn+'</a></td>'
            + ' <td>'+data.title.short+'</td>'
            + ' <td class="market-cap" data-usd="'+data.marketCap.usd+'" data-cny="'+data.marketCap.cny+'" data-btc="'+data.marketCap.btc+'">￥'+data.marketCap.cny+'</td>'
            + ' <td><a href="currencies.html?currency='+data.code+'" target="_blank" class="price" data-usd="'+data.price.usd+'" data-cny="'+data.price.cny+'" data-btc="'+data.price.cny+'">￥'+data.price.cny+'</a></td>'
            + ' <td>'+data.amount+'</td>'
            + ' <td class="volume" data-usd="'+data.volume.usd+'" data-cny="'+data.volume.cny+'" data-btc="'+data.volume.btc+'"><a href="currencies.html?currency='+data.code+'#markets" target="_blank">￥'+data.volume.cny+'</a></td>'
            + '<td><div '+ newCoin.validate(data.updown.replace("%",""))+'>'+data.updown+'</div></td>'
            + '<td>'+data.date+'</td>'
            + '</tr>';
    },
    getNewCoin: function() {
        var uri = BASE_URL + "api/currency/getNewCoin";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $('#items').empty();
                $(data).each(function (indexData, item) {
                    $('#items').append(newCoin.row(item));
                });
            }
        });
    },
    setvalue: function(val){
        return val.replace(/(\/\d{8}\/)/,'/time/').replace("//static.feixiaohao.com","themes");
    },
    validate:function(num) {
        var reg = /^\d+(?=\.{0,1}\d+$|$)/
        if(reg.test(num)){
            return 'class="text-green"' ;
        }else{
            return 'class="text-red"';
        }
    },
    process: function(){
        newCoin.getNewCoin();
    }
};

/**
 * maxchange.html
 * 涨跌幅榜
 * @type {{}}
 */
var upDown = {
    row: function(index,data){
        return '<tr>'
            + '<td><span>' + (index + 1) + '</span></td>'
            + '<td><a href="currencies.html?currency=' + data.code + '" target="_blank"><img src="' + upDown.setvalue(data.icon) + '" alt="' + data.title.cn + '"> ' + data.title.cn + '</a></td>'
            + '<td>' + data.title.short + '</td>'
            + '<td class="volume" data-usd="' + data.volume.usd + '" data-cny="' + data.volume.cny + '" data-btc="' + data.volume.btc + '"><a href="currencies.html?currency=' + data.code + '#markets" target="_blank">' + data.volume.init + '</a></td>'
            + '<td class="price" data-usd="' + data.price.usd + '" data-cny="' + data.price.cny + '" data-btc="' + data.price.btc + '"><a href="currencies.html?currency=' + data.code + '#markets" target="_blank">' + data.price.init + '</a></td>'
            + '<td><span class="text-green">' + data.proportion + '%</span></td>'
            + '</tr>';
    },

    gettingupDown: function(){
        var uri = BASE_URL + "api/currency/getupdown";

        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (result) {
                data1 = result[0];
                data2 = result[1];
                data3 = result[2];
                data4 = result[3];
                data5 = result[4];
                data6 = result[5];

                if (data1.length != 0) {
                    $('#items1').empty();
                    $(data1).each(function(index, item){
                        $('#items1').append(upDown.row(index, item));
                    });
                }

                if (data2.length != 0) {
                    $('#items2').empty();
                    $(data2).each(function(index, item){
                        $('#items2').append(upDown.row(index, item));
                    });
                }

                if (data3.length != 0) {
                    $('#items3').empty();
                    $(data3).each(function(index, item){
                        $('#items3').append(upDown.row(index, item));
                    });
                }

                if (data4.length != 0) {
                    $('#items4').empty();
                    $(data4).each(function(index, item){
                        $('#items4').append(upDown.row(index, item));
                    });
                }

                if (data5.length != 0) {
                    $('#items5').empty();
                    $(data5).each(function(index, item){
                        $('#items5').append(upDown.row(index, item));
                    });
                }

                if (data6.length != 0) {
                    $('#items6').empty();
                    $(data6).each(function(index, item){
                        $('#items6').append(upDown.row(index, item));
                    });
                }
            }
        });
    },
    setvalue:function(val) {
        return val.replace(/(\/\d{8}\/)/, '/time/');
    },
    process: function(){
        util.loadHomeNewCoin();
        util.loadHomevolrank();
        $('#zxss').hide();
        $('#phb').hide();
        upDown.gettingupDown();
    }
};

/**
 * exchange.html
 * 交易所处理
 * @type {{process: exchange.process}}
 */
var exchange = {
    pageCount: 1,
    pageSize: 20,
    pageCurrent: 1,

    row: function(index, item){
        if(item.title){
            return '<li>'
                + '<div class="con"><a target="_blank" href="exchangedetails.html?currenty=' + item.code + '" class="pic"><img src="' + item.icon + '.jpg"></a>'
                + '<div class="info">'
                + '<div class="tit">'
                + '<a target="_blank" href="exchangedetails.html?currenty=' + item.code + '"><b>' + item.title + '</b></a>'
                + '<div class="star star' + item.star + ' style="float: right"></div>'
                + '</div>'
                + '<div class="des">'+item.desc+'</div>'
                + '<i class="space"></i>国家:'
                + '<a href="' + item.countryHref + '">' + item.countryTitle + '</a>'
                + '<a href=\ "{0}\"></a>'
                + '<a href=\ "{0}\"></a>'
                + '<i class="space"></i>成交额(24h):'
                + '<a href="exchangedetails.html?currenty=' + item.code + '">'+item.price.cny+'</a>支持：'
                + '<span class="tag">' + exchange.setIValue(item) + '</span>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</li>';
        }else{
            return "";
        }

    },
    setIValue: function(val) {
        var i = '';
        var tags = val.tags;
        for (var s = 0; s < tags.length; s++) {
            i += '<a href="exchangedetails.html?currenty=' + val.code + '&type=2"><i class="' + tags[s] + '"> </i></a>';
        }
        return i;
    },
    page:{
        pageReader: function(){
            $("div.pageList").empty();

            if(exchange.pageCurrent == 1){
                $("div#pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="exchange.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">首页</a>'+
                    '<a class=\'btn btn-white\' onclick="exchange.page.next()" href=\'#\'>></a>');
            }else if(exchange.pageCurrent == exchange.pageCount -1){
                $("div#pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="exchange.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">尾页</a>'+
                    '<a class=\'btn btn-white\' onclick="exchange.page.next()" href=\'#\'>></a>');
            }else{
                $("div#pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="exchange.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">第' + exchange.pageCurrent + '页</a>'+
                    '<a class=\'btn btn-white\' onclick="exchange.page.next()" href=\'#\'>></a>');
            }
        },
        next: function(){
            if(exchange.pageCurrent < exchange.pageSize){
                exchange.pageCurrent ++;
            }
            exchange.page.pageReader();
            exchange.ajaxData();
        },
        prev: function(){
            if(exchange.pageCurrent > 1){
                exchange.pageCurrent -- ;
            }
            exchange.page.pageReader();
            exchange.ajaxData();
        }
    },
    ajaxData: function(){
        var uri = BASE_URL + "api/currency/getExchange";
        exchange.page.pageReader();
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            data: "pagesize=" + exchange.pageSize + "&page=" + exchange.pageCurrent,
            success: function(data){
                exchange.pageCount = Math.ceil(data.count/index.pageSize);

                $('#itemsList').empty();
                $(data.result).each(function(index, item){
                    $('#itemsList').append(exchange.row(index, item));
                });
            }
        });
    },
    process: function(){
        util.loadHomevolrank();
        util.loadHomeNewCoin();
        util.loadHomevolrank();
        exchange.ajaxData();
    }
};

/**
 * concept.html
 * 概念行情
 * @type {{}}
 */
var concept = {
    row: function(data){
        return "<tr>" +
            "<td>" +
            "<a href=\"conceptcoin.html?id=" + data.index + "\" target=\"_blank\">" + data.title + "</a></td>" +
            "<td>"+data.price24H+"</td>" +
            "<td class=\"text-red\">" + data.avrUpDown + "</td>" +
            "<td title=\"" + data.up.title + "\">" +
            "   <a href=\"currencies.html?currency=" + data.up.code + "\" target=\"_blank\">"+data.up.title +"</a>" +
            "   <span class=\"tags-green\">" +data.up.amount+ "</span>" +
            "</td>" +
            "<td title=\"" + data.down.title + "\">" +
            "   <a href=\"currencies.html?currency=" + data.down.code + "\" target=\"_blank\">" +data.down.title+ "</a>" +
            "   <span class=\"tags-red\">" +data.down.amount+ "</span>" +
            "</td>" +
            "<td>" + data.coin.count + "</td>" +
            "<td>" +
            "   <span class=\"text-green\">" + data.coin.up + "</span>/<span class=\"text-red\">" + data.coin.down + "</span>" +
            "</td>" +
            "</tr>";
    },
    dataAjax: function() {
        var uri = BASE_URL + "api/currency/getConcept";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $('div.boxContain table.table3.ideaTabel tbody').empty();
                $(data).each(function (indexData, item) {
                    $('div.boxContain table.table3.ideaTabel tbody').append(concept.row(item));
                });
            }
        });
    },
    process: function(){
        util.loadHomeCoinMaxChange();//涨跌幅
        concept.dataAjax();
    }
};

/**
 * conceptcoin.html?id={index}
 * 概念行情 内容
 * @type {{process: coneptCoin.process}}
 */
var coneptCoin = {
    baseReader: function(desc){
        $("#title").append(desc.title);
        $("#avrUpDown").append(desc.avrUpDown);
        $("#coinCount").append(desc.coin.count);
        $("#coinUp").append(desc.coin.up);
        $("#coinDown").append(desc.coin.down);

        $("#up").attr("title", desc.up.title);
        $("#upTitle").append(desc.up.title);
        $("#upTitle").attr("href", "currencies.html?currency=" + desc.up.code);
        $("#upAmount").append(desc.up.amount);

        $("#down").attr("title", desc.down.title);
        $("#downTitle").append(desc.down.title);
        $("#downTitle").attr("href", "currencies.html?currency=" + desc.up.code);
        $("#downAmount").append(desc.down.amount);
    },
    row: function(data){
        return '<tr id="iota">' +
            '<td>' + data['index'] +'</td>' +
            '<td>' +
            '   <a href="currencies.html?currency='+data["code"]+'" target="_blank">' +
            '   <img src="'  + data['icon'] + '" alt="'  + data['title'] + '">' + data['title'] + '</a>' +
            '</td>' +
            '<td class="market-cap" ' +
            '   data-usd="' + data['marketCap']["usd"] +'" ' +
            '   data-cny="' + data['marketCap']["cny"] +'" ' +
            '   data-btc="' + data['marketCap']["btc"] +'">' + data['marketCap']["init"] +'</td>' +
            '<td>' +
            ' <a href="details.html#markets" target="_blank" class="price" ' +
            '   data-usd="' + data['price']["usd"] +'" ' +
            '   data-cny="' + data['price']["cny"] +'"' +
            '   data-btc="' + data['price']["btc"] +'">' + data['price']["init"] +'</a>' +
            '</td>' +
            '<td>' + data['index'] +'</td>' +
            '<td>' +
            '<a href="details.html#markets" target="_blank" ' +
            '   class="volume" ' +
            '   data-usd="' + data['exchange24H']["usd"] +'" ' +
            '   data-cny="' + data['exchange24H']["cny"] +'"' +
            '   data-btc="' + data['exchange24H']["btc"] +'">' + data['exchange24H']["init"] +'</a>' +
            '</td>' +
            '<td class="change">' +
            '<span class="text-green">'+ data['updown24H'] +'</span>' +
            '</td>' +
            '<td class="char">' +
            '<span class=\'{"stroke": "#3ca316"}\'>'+ data['char7day'] +'</span>' +
            '</td>' +
            '</tr>';
    },
    dataAjax: function(index){
        var uri = BASE_URL + "api/currency/getConceptCoin?index=" + index;
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                if(data.desc){
                    coneptCoin.baseReader(data.desc);

                    $('div.boxContain table.table3 tbody').empty();
                    $(data.list).each(function (indexData, item) {
                        $('div.boxContain table.table3 tbody').append(concept.row(item));
                    });
                }
            }
        });
    },
    process: function(index){
        util.loadHomeCoinMaxChange();//涨跌幅
        coneptCoin.dataAjax(index);
    }
};

/**
 * vol.html
 * 24小时成交额排行榜人民币(CNY)
 * @type {{process: vol.process}}
 */
var vol ={
    pageIndex : 0,
    dataAjax: function(){
        vol.pageIndex ++;
        $.ajax({
            type:"GET",
            url: BASE_URL + "api/currency/getvol?page=" + vol.pageIndex,
            async:false,
            beforeSend:function(){
                $('.loading2').css("display", "block"); //显示加载时候的提示
            },
            success: function (ret) {
                if (ret.length > 0) {
                    $(".boxContain").append(ret);
                } else {
                    vol.pageIndex = 1;
                }
                $('.loading2').css("display", "none"); //显示加载时候的提示
            }  ,
            error: function(){
                if(vol.pageIndex > 0){
                    vol.pageIndex --;
                }
            }
        });
    },
    scroll: function(){
        $(window).scroll(function(){
            if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                vol.dataAjax()
            }
        });
    },
    process: function(){
        vol.dataAjax();
        vol.scroll();
    }
};

/**
 *
 * @type {{pageIndex: number, dataAjax: volexchange.dataAjax, scroll: volexchange.scroll, process: volexchange.process}}
 */
var volexchange={
    pageIndex: 0,
    dataAjax: function(){
        volexchange.pageIndex ++;
        $.ajax({
            url: BASE_URL + "api/currency/getvolexchange?page=" +  volexchange.pageIndex,
            type: "GET",
            dataType: 'json',
            async:false,
            beforeSend: function () {
                $('.loading2').css("display", "block"); //显示加载时候的提示
            },
            success: function (data) {
                if (data.length > 0) {
                    $(".boxContain").append(data);
                } else {
                    volexchange.pageIndex = 1;
                }
                $('.loading2').css("display", "none"); //显示加载时候的提示
            },
            error: function(){
                if(volexchange.pageIndex > 0){
                    volexchange.pageIndex --;
                }
            }
        });
    },
    scroll: function(){
        $(window).scroll(function(){
            if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                volexchange.dataAjax();
            }
        })
    },
    process: function(){
        volexchange.dataAjax();
        volexchange.scroll();
    }
};

/**
 *
 * @type {{}}
 */
var monthrank={
    row: function(item){
        if(item.title.cn){
            return '<tr>' +
                '<td>' +item.index+ '</td>' +
                '<td>' +
                '   <a href="currencies.html?currency='+ item["code"] +' target="_blank">' +
                '   <img src="'+item.icon+'" alt="'+item.title.cn+'"/> ' +item.title.cn+ '</a>' +
                '</td>' +
                '<td>'+item.title.short+'</td>' +
                '<td class="volume" ' +
                '   data-usd="'+item.oneday.usd+'" ' +
                '   data-cny="'+item.oneday.cny+'" ' +
                '   data-btc="'+item.oneday.btc+'">' +
                '   <a href="currencies.html?currency='+ item["code"] +'#markets" target="_blank">'+item.oneday.init+'</a>' +
                '</td>' +
                '<td class="volume" ' +
                '   data-usd="'+item.siveday.usd+'" ' +
                '   data-cny="'+item.siveday.cny+'" ' +
                '   data-btc="'+item.siveday.btc+'">' +
                '   <a href="currencies.html?currency='+ item["code"] +'#markets" target="_blank">'+item.siveday.init+'</a>' +
                '</td>' +
                '<td class="volume" ' +
                '   data-usd="'+item.month.usd+'" ' +
                '   data-cny="'+item.month.cny+'" ' +
                '   data-btc="'+item.month.btc+'">' +
                '   <a href="currencies.html?currency='+ item["code"] +'#markets" target="_blank">'+item.month.init+'</a>' +
                '</td>' +
                '</tr>';
        }else{
            return "";
        }
    },
    dataAjax: function(){
        var uri = BASE_URL + "api/currency/getMonthMxchange";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $('table#table-data tbody').empty();
                $(data).each(function (indexData, item) {
                    $('table#table-data tbody').append(monthrank.row(item));
                });
            }
        });
    },
    process: function(){
        monthrank.dataAjax();
    }
};


var exchangedetails={
    detail:function(detail){
        $("div.cover img").attr("src", detail.icon + ".jpg");
        $("div.cover img").attr("alt", detail.title);

        $("div.boxContain div.info h1").text(detail.title);
        $("div.boxContain div.info div.star").addClass("star" + detail.star);
        $("div.boxContain div.info div.text").append(detail.desc);

        $(detail.tags).each(function(index,tag){
            $("div.boxContain div.info div.tag").append("<i class=\"" +tag+ "\"></i>");
        });

        $("div.boxContain div.info div.web span:eq(0) a").attr("href", detail.wetsitHref);
        $("div.boxContain div.info div.web span:eq(0) a").append(detail.wetsitTitle);

        $("div.boxContain div.info div.web span:eq(1) a").attr("href",detail.countryHref);
        $("div.boxContain div.info div.web span:eq(1) a").append(detail.countryTitle);

        $("div.tabBody:eq(1) section.artBox").append(detail.description);
        $("div.tabBody:eq(2) section.artBox").append(detail.costDescription);

        $("div.vol div.num").text(detail.price.cny);
        $("div.vol div.num2 span:eq(0)").text(detail.price.usd);
        $("div.vol div.num2 span:eq(1)").text(detail.price.btc);
    },
    coin: function(list){
        $("table.table.noBg tbody").empty();
        $(list).each(function(index, item){
            $("table.table.noBg tbody").append("<tr>" +
                "    <td>" +
                "        <a href=\"currencies.html?currency=\" target=\"_blank\">" +
                "            <img src=\"" + item.coinIcon + "\" alt=\"" +item.title+ "\"/> " +item.title+
                "    </td>" +
                "    <td>" +
                "        <a href=\"" + item.transaction.href + "\" target=\"_blank\"> "+ item.transaction.title +"</a>" +
                "    </td>" +
                "    <td class=\"price\" " +
                "         data-usd=\""+item.price.usd+"\" data-cny=\""+item.price.cny+"\" " +
                "         data-btc=\""+item.price.btc+"\" " +
                "         data-native=\""+item.price.native+"\">" +item.price.init+ "</td>" +
                "    <td>38万</td>" +
                "    <td class=\"volume\" " +
                "             data-usd=\""+item.volume.usd+"\" data-cny=\""+item.volume.cny+"\" " +
                "         data-btc=\""+item.volume.btc+"\" " +
                "         data-native=\""+item.volume.native+"\">" +item.volume.init+ "</td>" +
                "    <td>"+ item.proportion+"</td>" +
                "    <td>" + item.time + "</td>" +
                "    <td>" +
                "        <div class=\"addto disactive\" onclick=\"addfocus();\">添加自选</div>" +
                "    </td>" +
                "</tr>");
        });
    },
    dataAjax: function(code){
        $.ajax({
            url: BASE_URL + "api/currency/getExchangeDetail?currenty=" + code,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                exchangedetails.detail(data.detail);
                exchangedetails.coin(data.coin);
            }
        });
    },
    process: function(){
        var currenty = GetRequest().currenty.split('/')[0];
        exchangedetails.dataAjax(currenty);
    }
};

/**
 * currencies.html
 * @type {{process: currencies.process}}
 */
var currencies = {
    exchageRow: function(data){
      return "<tr class=\"adList\">" +
          "    <td>* </td>" +
          "    <td>" +
          "        <a href=\""+ data.exchangeHref + "\" target=\"_blank\">" +
          "            <img height='15' width='18' src=\"" +data.exchangeIcon+ ".jpg\" alt=\"" + data.exchangeTitle + "\">" + data.exchangeTitle + "</a>" +
          "    </td>" +
          "    <td class=\"price\" " +
          "         data-usd=\""+data.price.usd+"\" data-cny=\""+data.price.cny+"\" " +
          "         data-btc=\""+data.price.btc+"\" " +
          "         data-native=\""+data.price.native+"\">" +data.price.init+ "</td>" +
          "    <td>" +data.ammount+ "</td>" +
          "    <td class=\"volume\" " +
          "             data-usd=\""+data.volume.usd+"\" data-cny=\""+data.volume.cny+"\" " +
          "         data-btc=\""+data.volume.btc+"\" " +
          "         data-native=\""+data.volume.native+"\">" +data.volume.init+ "</td>" +
          "    <td>"+data.proportion+"</td>" +
          "    <td>" + data.time + "</td>" +
          "    <td>" +
          "        <div class=\"addto disactive\" onclick=\"\">添加自选</div>" +
          "    </td>" +
          "</tr>"
    },
    exchage: function(list){
        $("div.boxContain table.table3 tbody").empty();
        $(list).each(function(index, item){
            $("div.boxContain table.table3 tbody").append(currencies.exchageRow(item));
        });
    },
    details: function(data){
        $('#coinnameCN').html(data["title"]["en"] + " " + data["title"]["cn"]);
        $('#coinLogo').attr('src',data.icon);
        $('#24Max').text(data.twenty.price.max);
        $('#24Min').text(data.twenty.price.min);

        $('#mainy').text(data.price.usd);
        $('#price').text(data.price.cny);
        $('#mainbtc').text(data.price.btc);
        ;
        $('#ltinit').text(data.circulation.price.cny);
        $('#lty').text(data.circulation.price.usd);
        $('#ltbtc').text(data.circulation.price.btc);
        $('#ltlevel').text(data.circulation.ranking);

        $('#ltlltcz').text(data.amount.issue);
        $('#ltlltc').text(data.amount.circulation);

        $('#cjmoney').text(data.twenty.turnover.price.cny)
        $('#cjy').text(data.twenty.turnover.price.usd);
        $('#cjbtc').text(data.twenty.turnover.price.btc);
        $('#upOrDown').text(data.floatRate);
        $('#remark').text('');

        if(data.describe.length>80){
            $('#remark').append(data.describe.substr(0,80)+"...");
            $('#remark').append('<a href="coindetails.html?currenty='+data.code+'" target="_blank">查看全部</a>');
        }else{
            $('#remark').append(data.describe);
        }

        $('#cnName').text(data.title.en);
        $('#enName').text(data.title.cn);
        $('#level3').text("第" + data.circulation.ranking + "名");
        $('#sjjys').text(data.ticker.count+"家");// 交易所
        $('#fxtime').text(data.date); // 上架时间

        $('#qqzsz').text(data.marketCapitalization);
        $('#ltl').text(data.amount.circulationRate);
        $('#hsl').text(data.twenty.turnover.rate);

        $('#bbook').text(data.whitePage.title);
        $('#bbook').attr('href',data.whitePage.title);
        if(data.webSite.length!=0){
            var res='';
            for(var i=0;i<data.webSite.length;i++){
                res+="<a href="+data.webSite[0].href+" rel='nofollow' target='_blank'>"+data.webSite[0].title+"</a>,";
            }
            $('#net').append(res.substr(0,res.length-1));
        }

        if(data.blockStation.length!=0){
            var res='';
            for(var i=0;i<data.blockStation.length;i++){
                res+="<a href="+data.blockStation[0].href+" rel='nofollow' target='_blank'>"+data.blockStation[0].title+"</a>,";
            }
            $('#qknet').append(res.substr(0,res.length-1));
        }
    },
    dataAjax: function(code){
        $.ajax({
            url: BASE_URL + "api/currency/getCurrencies",
            type: "GET",
            dataType: 'json',
            data: "currency=" + code,
            success: function (data) {
                currencies.details(data.detail);
                currencies.exchage(data.exchange);
            }
        });
    },
    loadCoinEvent: function(code){
        var uri = BASE_URL + "api/currency/getCoinevent";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            data: "currency=" + code,
            success: function (data) {
                if (data.length > 0) {
                    $("#coineventtimeline").append(data);
                    $("#timeLineBox").css("display", "block");
                }
            }
        });
    },
    loadPiechartCoinvol: function(code){
        $.ajax({
            url: BASE_URL + "api/currency/getCointradesPercent",
            type: "GET",
            dataType: 'json',
            data: "currency=" + code,
            success: function (data) {
                var pieArr = [];
                $(data).each(function (index, item) {
                    pieArr.push([item.name, item.y]);
                });
                $('#piechart_coinvol').highcharts().series[0].setData(pieArr);
            }
        });
    },
    chart:function(){
        new Chartist.Pie('.ct-chart3', {
            series: [5, 95]
        }, {
            donut: true,
            donutWidth: 40,
            startAngle: 270,
            total: 200,
            showLabel: false
        });
        new Chartist.Pie('.ct-chart2', {
            series: [66, 34]
        }, {
            donut: true,
            donutWidth: 40,
            startAngle: 270,
            total: 200,
            showLabel: false
        });
        new Chartist.Pie('.ct-chart1', {
            series: [2.814545, 97.18546]
        }, {
            donut: true,
            donutWidth: 40,
            startAngle: 270,
            total: 200,
            showLabel: false
        });

        $('#piechart_coinvol').highcharts({
            legend: {
                itemStyle: {
                    color: '#666',
                    fontWeight: 'normal',
                },
                itemWidth: 120,
                symbolRadius: 0
            },
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            tooltip: {
                headerFormat: '{series.name}<br>',
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: '交易对成交量占比'
            }]

        });

    },
    process: function(){
        currencies.chart();
        var coinCode = GetRequest().currency.split('/')[0];
        currencies.loadCoinEvent(coinCode);
        currencies.loadPiechartCoinvol(coinCode);
        currencies.dataAjax(coinCode);
    }
};