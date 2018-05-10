var BASE_URL = "http://139.162.90.234:81/";

document.write("<script src=\"scripts/autocomplete.js\"></script>");

function getUserInfo() {
    $.ajax({
        type: "POST",
        url: BASE_URL+ "user/getUserInfo",
        dataType: "json",
        data: {
            "psession": localStorage.getItem("psession")
        },
        success: function (data) {
            if (data.status == "success") {
                if (data.username.length > 0 || data.userid.length > 0) {
                    $(".userinfo").css('display', 'block');
                    $(".unlogin").css('display', 'none');
                    if (data.username.length > 0) {
                        $(".userLinks .username").html(data.username);
                    } else {
                        $(".userLinks .username").html(data.userid);
                    }
                    return;
                } else {
                    $(".userLinks .username").html(data.userid);
                }
            }

            $(".userinfo").css('display', 'none');
            $(".unlogin").css('display', 'block');
        }
    });
};
function logout() {
    if (confirm("确认退出吗？")) {
        localStorage.removeItem("psession");
        window.location.reload();
    }
}

function addfocus(self) {
    if(localStorage.getItem("psession")){
        var currency = $(self).attr("currency");
        if($(self).attr("focus") == "true"){
            return;
        }

        if(currency){
            $.ajax({
                type: "POST",
                url: BASE_URL+ "user/addfocus",
                dataType: "json",
                data: {
                    "psession": localStorage.getItem("psession"),
                    "currency": currency
                },
                success: function (data) {
                    if (data.status == "success") {
                        $(self).attr("focus", true).html("已经关注");
                    }
                    else{
                        $(".login").click();
                    }
                }
            });
        }
        else{
            alert("关注失败!");
        }
    }
    else{
        $(".login").click();
    }
}

function unfocus(self){
    var currency = $(self).attr("currency");
    $.ajax({
        type: "POST",
        url: BASE_URL+ "user/unfocus",
        dataType: "json",
        data: {
            "psession": localStorage.getItem("psession"),
            "currency": currency
        },
        success: function (data) {
            alert(data.context)
            if(data.status == "success"){
                location.reload();
            }
        }
    });
}

function totop(){
    $("<div class=\"totop\" style=\"bottom: 50px;\">" +
        "<div class=\"wCat2\"><div class=\"detal\" style=\"display: none;width: auto;\">" +
        "<img src=\"img/qrcode_01.jpg\" alt=\"币小金微信服务号\"> " +
        "<div style=\"text-align:center;width:116px;float:left;color:#fff\">币小金微信服务号</div>" +
        "</div>" +
        "</div>" +
        "   <a class=\"qq2\" href=\"//wpa.qq.com/msgrd?v=3&amp;uin=3145899467&amp;site=qq&amp;menu=yes\" target=\"_blank\"> </a> " +

        "<div class=\"top\"></div>" +
        "</div>").appendTo("body");

    $(window).scroll(function () {
        if ($(window).scrollTop() > $(document).height() - 100 - $(window).height()) {
            $('.totop').css('bottom', '150px')
        }
        else {
            $('.totop').css('bottom', '50px')
        }
    });

    $(".totop .top").click(function () {
        $('body,html').animate({ scrollTop: 0 }, 500);
    });

    $('.totop>div').hover(function () {
        $(this).find('.detal').fadeIn('fast');
    }, function () {
        $(this).find('.detal').hide();
    });
}

/**
 * 分页处理
 * @param pageIndex 当前页
 * @param page 页面数目
 * @param callback 回调函数
 * @returns {string}
 */
function getPageHtml(content, pageIndex, page, callbackFunction) {
    var prev = $("<a href=\"javascript:void(0)\" data-prev='true' class=\"btn btn-white\">&lt;</a>");
    var next = $("<a href=\"javascript:void(0)\" data-next='true' class=\"btn btn-white\">&gt;</a>");
    var node = $("<a class=\"btn btn-white\" data-node='true' href=\"javascript:void(0)\"></a>");
    var dot = $("<a class=\"btn btn-white\" data-more='true' href=\"javascript:void(0)\">...</a>");

    $(content).empty();
    var callback = function(self){
        var currentIndex = parseInt($("a.active", content).first().attr("index"));
        if($(self).data("prev")){
            if(currentIndex > 1){
                callbackFunction(currentIndex - 1);
                getPageHtml(content, currentIndex - 1, page, callbackFunction);
            }
        }
        if($(self).data("next")){
            if(currentIndex < page){
                callbackFunction(currentIndex + 1);
                getPageHtml(content, currentIndex + 1, page, callbackFunction);
            }
        }

        if($(self).data("node")){
            var index = parseInt($(self).attr("index"));
            callbackFunction(index);
            getPageHtml(content, index, page, callbackFunction);
        }

        if($(self).data("more")){
            var index = currentIndex;
            var nextIndex = $(self).next().attr("index");
            if(nextIndex > currentIndex){
                index = parseInt((page - currentIndex) / 2) + currentIndex;
            }
            else{
                index = parseInt(currentIndex / 2);
            }

            callbackFunction(index);
            getPageHtml(content, index, page, callbackFunction);
        }
    };

    if (page == 1) { //页数为1
        content.append(prev.clone()).attr("index", 1).append(node.clone().text("1").click(function(){
            callback(this);
        })).append(next);
    } else {
        if (page > 1) {
            if (pageIndex > 1) {    //上一步
                content.append(prev.clone().click(function(){
                    callback(this);
                }));
            } else {
                content.append(prev.clone());
            }

            if ((pageIndex - 3) > 1) { //页数-3大于1
                content.append(node.clone().attr("index", 1).text("1").click(function(){
                    callback(this);
                }));

                content.append(dot.clone().click(function(){
                    callback(this);
                }));

                if (pageIndex <= (page - 3)) {
                    for (var i = (pageIndex - 2); i < pageIndex; i++) {
                        content.append(node.clone().attr("index", i).text(i).click(function(){
                            callback(this);
                        }));
                    }

                    content.append(node.clone().attr("index", pageIndex).text(pageIndex).click(function(){
                        callback(this);
                    }));
                }
            } else if (pageIndex - 3 <= 1) {
                for (var i = 1; i <= 5; i++) {
                    if (i == pageIndex) {
                        content.append(node.clone().attr("index", pageIndex).text(pageIndex).click(function(){
                            callback(this);
                        }));
                    } else {
                        content.append(node.clone().attr("index", i).text(i).click(function(){
                            callback(this);
                        }));
                    }
                }

            }

            if ((pageIndex + 5) < page) {
                if (pageIndex >= 5) {
                    content.append(node.clone().attr("index", pageIndex + 1).text(pageIndex+1).click(function(){
                        callback(this);
                    }));
                }
                content.append(dot.clone().click(function(){
                    callback(this);
                }));
            } else {
                if (pageIndex <= (page - 3)) {
                    if (pageIndex >= 5) {
                        content.append(node.clone().attr("index", pageIndex + 1).text(pageIndex+1).click(function(){
                            callback(this);
                        }));
                    }
                    content.append(dot.clone().click(function(){
                        callback(this);
                    }));
                } else {
                    for (var i = (page - 4); i <= page; i++) {
                        if (i == pageIndex) {
                            content.append(node.clone().attr("index", pageIndex).text(pageIndex).click(function(){
                                callback(this);
                            }));
                        } else {
                            content.append(node.clone().attr("index", i).text(i).click(function(){
                                callback(this);
                            }));
                        }

                    }
                }
            }
        }
    }
    if ((pageIndex + 2) < page) {
        content.append(node.clone().attr("index", page).text(page).click(function(){
            callback(this);
        }));
    }
    if (page > 1) {
        if (pageIndex != page) {
            content.append(next.clone().click(function(){
                callback(this);
            }));
        } else {
            content.append(next.clone());
        }
    }

    $("a[index="+pageIndex+"]", content).addClass("active");
}

/**
 * 工具处理
 * @type {{loadHomeNewCoin: util.loadHomeNewCoin, loadHomevolrank: util.loadHomevolrank, loadHomeCoinMaxChange: util.loadHomeCoinMaxChange, loadconcept: util.loadconcept}}
 */
var util={
    //最新上市
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
    //首页成交量排行榜
    loadHomevolrank: function() {
        var uri = BASE_URL +"api/currency/homevolrank";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $('#loadlrank').hide();
                $("#vol_coin").append(data.result1);
                $("#vol_exchange").append(data.result2);
            }
        });
    },
    //涨跌幅
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
    //热门概念
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
    },
    //公告
    loadnotes: function(){
        var uri = BASE_URL +"api/currency/loadnotes";
        $.ajax({
            url: uri,
            dataType: "json",
            success: function (data) {
                $("div#artList ul.artList").append(data.result1);
                $("div#artList ul.artList").append(data.result2);
                $("div#artList div.spiner-example").hide();
            }
        });
    },
    //头信息
    loadhander: function(){
        var uri = BASE_URL +"api/currency/loadhander";
        $.ajax({
            url: uri,
            dataType: "json",
            success: function (data) {
                $("div#globalinfo").append(data.result);
            }
        });
    },
    //
    hostconceptList: function(){
        var uri = BASE_URL +"api/currency/hostconceptList";
        $.ajax({
            url: uri,
            dataType: "json",
            success: function (data) {
                $("div#conceptHost").append(data.result);
            }
        });
    },
    showmarket: function(){
        var uri = BASE_URL +"api/currency/showmarket";
        $.ajax({
            url: uri,
            dataType: "json",
            success: function (data) {
                $("ul.rightNav li.showmarket").append(data.result);
                $('.line').peity("line", { width: 50, height: 15, fill: '#f5f5f5', min: 99999, strokeWidth: 1 });
            }
        });
    },

    toThousands: function(value) {
        if(value == 0){
            return "?"
        }

        function scientificToNumber(num) {
            var str = num.toString();
            var reg = /^(\d+)(e)([\-]?\d+)$/;
            var arr, len,
                zero = '';

            /*6e7或6e+7 都会自动转换数值*/
            if (!reg.test(str)) {
                return num;
            } else {
                /*6e-7 需要手动转换*/
                arr = reg.exec(str);
                len = Math.abs(arr[3]) - 1;
                for (var i = 0; i < len; i++) {
                    zero += '0';
                }

                return '0.' + zero + arr[1];
            }
        }

        if(value < 1){
            value = scientificToNumber(value);
        }

        var all = "" + value;
        var numbs = all.split(".");
        var num = numbs[0], result = '';

        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) { result = num + result; }
        if(numbs.length == 2){
            return result + "." + numbs[1]
        }
        return result;
    },
    format_crypto_volume :function(val) {
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

        return util.formatprice(val);
    },
    formatprice:function(val) {
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
        var updown24HColor = "text-green";
        if(data["updown24H"]<0){
            updown24HColor = "text-red";
        }

        return "<tr style='height: 20px;' id=\""+ data["code"] +"\">" +
            "<td>" +data["index"] + "</td>" +
            "<td>" +
            "   <a href=\"currencies.html?currency="+ data["code"] +"\" target=\"_blank\">" +
            "   <img src=\""+data["icon"]+"\" alt=\""+ data["title"] +"\">" +data["title"]+
            "</a>" +
            "</td>" +
            "<td class=\"market-cap\" data-usd=\""+data["marketCap"]["usd"]+"\" data-cny=\""+data["marketCap"]["cny"]+"\" data-btc=\""+data["marketCap"]["btc"]+"\">"+data["marketCap"]["init"]+"</td>" +
            "<td>" +
            "   <a href=\"currencies.html?currency="+ data["code"] +"\" target=\"_blank\" class=\"price\" data-usd=\""+data["price"]["usd"]+"\" data-cny=\"" +data["price"]["cny"]+ "\"" +
            "   data-btc=\"" +data["price"]["btc"]+ "\">" + data["price"]["init"]+ "</a>" +
            " </td>" +
            " <td>" +data["amount"]+ "</td>" +
            " <td>" +
            " <a href=\"currencies.html?currency=" + data["code"] + "\" target=\"_blank\" class=\"volume\" " +
            "data-usd=\"" + data["volume"]["usd"] + "\"" +
            "data-cny=\"" + data["volume"]["usd"] + "\" " +
            "data-btc=\"" + data["volume"]["usd"] + "\">" + data["volume"]["init"] + "</a>" +
            "</td>" +
            "<td class=\"change\">" +
            "  <span class=\"" +updown24HColor+ "\">" +data["updown24H"]+ "%</span>" +
            " </td>" +
            " <td class=\"char\">" +
            "   <span class=\"line2\">" +data["char"]+ "</span>" +
            "</td>" +
            "</tr>";
    },
    pageReader: function(){
        getPageHtml($("div.pageList"), index.pageCurrent, index.pageCount,function(currentIndex){
            index.pageCurrent = currentIndex;
            index.ajaxData();
        });
    },
    type: GetRequest().type,
    limit: GetRequest().limit,
    volume: GetRequest().volume,
    price: GetRequest().price,
    ajaxData: function(){
        if(window.interval){
            window.clearInterval(window.interval);
            delete window.interval;
        }

        var data = function(){
            var urip = BASE_URL +"api/currency/indexAll?pageSize=" + index.pageSize+ "&page=" + index.pageCurrent;
            if(index.type){
                urip +="&type="+ index.type;
            }
            if(index.limit){
                urip +="&limit="+ index.limit;
            }
            if(index.volume){
                urip +="&volume="+ index.volume;
            }
            if(index.price){
                urip +="&price="+ index.price;
            }

            $.ajax({
                url: urip,
                type: "GET",
                dataType: 'json',
                success: function (data) {
                    index.pageCount = Math.ceil(data.count/index.pageSize);
                    index.pageReader();
                    $("div.boxContain table#table tbody").empty();
                    $(data.result).each(function (indexData, item) {
                        $("div.boxContain table#table tbody").append(index.row(item));
                    });
                    $('.line2').peity('line', { width: 80, height: 20, fill: 'none', strokeWidth: 1, min: 2500, stroke: '#3499da' });
                }
            });
        };

        data();
        window.interval = window.setInterval(data, 1000 * 30);
    },
    process: function(){
        totop();
        index.ajaxData();
        util.loadhander();
        util.showmarket();
        util.loadnotes(); //公告
        util.loadHomeNewCoin(); //新币
        util.loadHomevolrank(); //销售量排行
        util.loadHomeCoinMaxChange(); //个贷大交易
        util.loadconcept(0);//热门概念
    },
    download: function(){
        var type = GetRequest().type;
        if(type){
            window.open(BASE_URL + "api/currency/exportIndex?type=" + type, "_blank");
        }else{
            window.open(BASE_URL + "api/currency/exportIndex", "_blank");
        }
    }
};

/**
 * currencies.html
 * @type {{process: currencies.process}}
 */
var currencies = {
    exchageRow: function(data){
        var transaction ="";
        if(data.transaction.href != ""){
            transaction = "<a href=\""+data.transaction.href+"\" target=\"_blank\"> "+data.transaction.title+" </a>";
        }else{
            transaction = data.transaction.title;
        }

        return "<tr>" +
            "    <td>"+data.index+"</td>" +
            "    <td>" +
            "        <a href=\""+ data.exchangeHref + "\" target=\"_blank\">" +
            "            <img height='15' width='18' src=\"" +data.exchangeIcon+ ".jpg\" alt=\"" + data.exchangeTitle + "\">" + data.exchangeTitle + "</a>" +
            "    </td>" +
            "    <td>" +transaction+ "</td>" +
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
            "</tr>"
    },
    exchage: function(list){
        $("div#tickerlist div.boxContain table.table3.tableMaxWidth tbody:eq(0)").empty();
        $(list).each(function(index, item){
            $("div#tickerlist div.boxContain table.table3.tableMaxWidth tbody:eq(0)").append(currencies.exchageRow(item));
        });
    },
    details: function(data, focus){
        $('#coinnameCN').html(data["title"]["en"] + " " + data["title"]["cn"]);
        $('#coinLogo').attr('src',data.icon);
        $('#24Max').text("￥" + util.toThousands(data.twenty.price.max));
        $('#24Min').text("￥" + util.toThousands(data.twenty.price.min));

        $("#currency").attr("currency", data.code);
        $("#currency").attr("focus", focus);
        if(focus){
            $("#currency").text("已关注");
        }

        $('#mainy').text("≈$" + util.toThousands(data.price.usd));
        $('#price').text("￥" + util.toThousands(data.price.cny));
        $('#mainbtc').text("≈" +util.toThousands(data.price.btc) + " BTC");
        ;
        $('#ltinit').text("￥" +util.toThousands(data.circulationPrice.cny));
        $('#lty').text("≈$" +util.toThousands(data.circulationPrice.usd));
        $('#ltbtc').text("≈" +util.toThousands(data.circulationPrice.btc)+ " BTC");
        $('#ltlevel').text("第" + data.circulationRanking + "名");

        $('#ltlltcz').text(util.toThousands(data.amount.issue) + " " + data.unit);
        $('#ltlltc').text(util.toThousands(data.amount.circulation) + " " + data.unit);

        $('#cjmoney').text("￥" + util.toThousands(data.twentyPrice.cny));
        $('#cjy').text("≈$" + util.toThousands(data.twentyPrice.usd));
        $('#cjbtc').text("≈" + util.toThousands(data.twentyPrice.btc) + " " + data.unit);
        $('#cjlevel').text("第" + data.twenty.price.ranking + "名");

        $('#upOrDown').text(data.floatRate + "%");

        $('#remark span').append(data.desc);
        $('#remark div.describe').append(data.describe);

        $('#cnName').text(data.title.en);
        $('#enName').text(data.title.cn);
        $('#sjjys').text(data.ticker.count+"家");// 交易所
        $('#fxtime').text(data.date); // 上架时间

        $('#qqzsz').text(data.marketCapitalization + "%");
        $('#ltl').text(data.amount.circulationRate + "%");
        $('#hsl').text(data.twenty.price.rate + "%");

        //白皮书
        if(data.whitePaper.title==""){
            $('#bbook').text("-");
        }else{
            $('#bbook').text(data.whitePaper.title);
            $('#bbook').attr('href',data.whitePaper.title);
        }

        if(data.webSite.length!=0){
            var res='';
            for(var i=0;i<data.webSite.length;i++){
                res+="<a href="+data.webSite[0].href+" rel='nofollow' target='_blank'>"+data.webSite[0].title+"</a>,";
            }
            $('#net').append(res.substr(0,res.length-1));
        }else{
            $('#net').append("-");
        }

        if(data.blockStation.length!=0){
            var res='';
            for(var i=0;i<data.blockStation.length;i++){
                res+="<a href="+data.blockStation[0].href+" rel='nofollow' target='_blank'>"+data.blockStation[0].title+"</a>,";
            }
            $('#qknet').append(res.substr(0,res.length-1));
        }else{
            $('#qknet').append("-");
        }

        //相关概念
        if(data.concept){
            $(data.concept).each(function(index,item){
                $("li#concept span.value").append("<a href=\"conceptcoin.html?id=" +item.index+ "\" target=\"_blank\">" +item.title+ "</a>");
            });
        }else{
            $("li#concept").hide();
        }

        if(data.funding){
            $("li#funding span.value").append('<a href="#ico">'+data.funding.price+'</a>');
            if(data.funding.up != ""){
                $("li#funding span.value").append('<span class="tags-ico">'+data.funding.up+'</span>');
            }

            currencies.icoAjax(data.code, function(data){
                if(data){
                    console.log(data);
                    $("div#icotable table")
                        .append('<tr>' +
                            '    <th>状态</th>' +
                            '    <th>代币平台</th>' +
                            '    <th>ICO分配<div class="toolTips"><div class="text">T：团队/合作伙伴/贡献者，B:赏金，C：基金会，O:其他</div></div></th>' +
                            '    <th>投资者占比(%)<div class="toolTips"><div class="text">众筹目标的百分比，不是货币总量的百分比</div></div></th>' +
                            '    <th>ICO总量</th>' +
                            '    <th>ICO发售量</th>' +
                            '</tr>' +
                            '<tr>' +
                            '    <td>'+data.state+'</td>' +
                            '    <td>'+data.amount+'</td>' +
                            '    <td>'+data.distribution+'</td>' +
                            '    <td>'+data.proportion+'</td>' +
                            '    <td>'+data.volume+'</td>' +
                            '    <td>'+data.salesVolume+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '    <th>众筹起始时间</th>' +
                            '    <th>众筹结束时间</th>' +
                            '    <th>开售价格</th>' +
                            '    <th>众筹方式</th>' +
                            '    <th>众筹目标</th>' +
                            '    <th>众筹金额</th>' +
                            '</tr>' +
                            '<tr>' +
                            '    <td>'+data.startDate+'</td>' +
                            '    <td>'+data.endDate+'</td>' +
                            '    <td>'+data.price+'</td>' +
                            '    <td>'+data.method+'</td>' +
                            '    <td>'+data.object+'</td>' +
                            '    <td>'+data.platform+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '    <th>众筹均价</th>' +
                            '    <th>成功众筹数量</th>' +
                            '    <th>成功众筹金额</th>' +
                            '    <th>特点</th>' +
                            '    <th>安全审计</th>' +
                            '    <th>法律形式</th>' +
                            '</tr>' +
                            '<tr>' +
                            '    <td>'+data.argPrice+'</td>' +
                            '    <td>'+data.successAmount+'</td>' +
                            '    <td>'+data.successPrice+'</td>' +
                            '    <td>'+data.characteristic+'</td>' +
                            '    <td>'+data.audit+'</td>' +
                            '    <td>'+data.law+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '    <th>管辖区域</th>' +
                            '    <th>法律顾问</th>' +
                            '    <th>代售网址</th>' +
                            '    <th>Blog地址</th>' +
                            '    <th></th>' +
                            '    <th></th>' +
                            '</tr>' +
                            '<tr>' +
                            '    <td>'+data.area+'</td>' +
                            '    <td>'+data.lawer+'</td>' +
                            '    <td><a href=\''+data.website+'\' target=\'_blank\' rel=\'nofollow\'>'+data.website+'</a></td>' +
                            '    <td><a href=\''+data.blogSite+'\' target=\'_blank\' rel=\'nofollow\'>'+data.blogSite+'</a></td>' +
                            '    <td></td>' +
                            '    <td></td>' +
                            '  </tr>');
                    $("div#icotable").show();
                }
            });

        }else{
            $("li#funding").hide();
        }

        if(data.assets){
            $("li#assets span.value").append(data.assets);
        }else{
            $("li#assets").hide();
        }

        if(data.assetsPlatform){
            $("li#assetsPlatform span.value").append(data.assetsPlatform);
        }else{
            $("li#assetsPlatform").hide();
        }
    },
    icoAjax: function(code,callback){
        $.ajax({
            url: BASE_URL + "api/currency/getICO",
            type: "GET",
            dataType: 'json',
            data: "currency=" + code,
            success: function (data) {
                callback(data.result);
            }
        });
    },
    dataAjax: function(code){
        $.ajax({
            url: BASE_URL + "api/currency/getCurrencies",
            type: "POST",
            dataType: 'json',
            data:{
                "currency":  code,
                "psession": localStorage.getItem("psession")
            },
            success: function (data) {
                currencies.details(data.detail, data.focus);
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
        totop();
        currencies.chart();
        var coinCode = GetRequest().currency.split('/')[0];
        currencies.loadCoinEvent(coinCode);
        currencies.loadPiechartCoinvol(coinCode);
        currencies.dataAjax(coinCode);

        util.loadhander();
        util.showmarket();
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
            + '<td><a href="currencies.html?currency='+data.code+'" target="_blank"><img src="'+data.icon+'" alt="'+data.title.cn+'">'+data.title.cn+'</a></td>'
            + ' <td>'+data.title.short+'</td>'
            + ' <td class="market-cap" data-usd="'+data.marketCap.usd+'" data-cny="'+data.marketCap.cny+'" data-btc="'+data.marketCap.btc+'">'+data.marketCap.init+'</td>'
            + ' <td><a href="currencies.html?currency='+data.code+'" target="_blank" class="price" data-usd="'+data.price.usd+'" data-cny="'+data.price.cny+'" data-btc="'+data.price.cny+'">'+data.price.init+'</a></td>'
            + ' <td>'+data.amount+'</td>'
            + ' <td class="volume" data-usd="'+data.volume.usd+'" data-cny="'+data.volume.cny+'" data-btc="'+data.volume.btc+'"><a href="currencies.html?currency='+data.code+'#markets" target="_blank">'+data.volume.init+'</a></td>'
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
    validate:function(num) {
        var reg = /^\d+(?=\.{0,1}\d+$|$)/
        if(reg.test(num)){
            return 'class="text-green"' ;
        }else{
            return 'class="text-red"';
        }
    },
    process: function(){
        totop();
        newCoin.getNewCoin();
        util.loadhander();
        util.showmarket();
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
        totop();
        upDown.gettingupDown();

        util.loadhander();
        util.showmarket();
        util.loadHomeNewCoin();
        util.loadHomevolrank();
        $('#zxss').hide();
        $('#phb').hide();
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
                + '<a href="javascript:javascript:exchange.filter=\''+item.country.code+'\';exchange.ajaxData();">' + item.country.title + '</a>'
                + '<a href=\ "{0}\"></a>'
                + '<a href=\ "{0}\"></a>'
                + '<i class="space"></i>交易币种:'
                + '<a href="javascript:void(0)">'+ item.coinCount+'</a>'
                + '<i class="space"></i>成交额(24h):'
                + '<a href="exchangedetails.html?currenty=' + item.code + '">'+util.format_crypto_volume(item.price.cny)+'</a>支持：'
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
    pageReader: function(){
        getPageHtml($("div#pageList"), exchange.pageCurrent, exchange.pageCount,function(currentIndex){
            exchange.pageCurrent = currentIndex;
            exchange.ajaxData();
        });
    },
    filter: "",
    code: "",
    type: "",
    ajaxData: function(){
        var uri = BASE_URL + "api/currency/getExchange";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            data: "pagesize=" + exchange.pageSize +
            "&page=" + exchange.pageCurrent +
            "&filter=" + exchange.filter +
            "&code=" + exchange.code+
            "&type=" + exchange.type,
            success: function(data){
                exchange.pageCount = Math.ceil(data.count/index.pageSize);
                exchange.pageReader();

                $('#itemsList').empty();
                $(data.result).each(function(index, item){
                    $('#itemsList').append(exchange.row(index, item));
                });
            }
        });
    },
    process: function(){
        totop();
        exchange.ajaxData();

        util.loadhander();
        util.showmarket();
        util.loadnotes();
        util.loadHomevolrank();
        util.loadHomeNewCoin();
    }
};

/**
 *
 * @type {{detail: exchangedetails.detail, coin: exchangedetails.coin, dataAjax: exchangedetails.dataAjax, process: exchangedetails.process}}
 */
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

        $("div.boxContain div.info div.web span:eq(1) a").append(detail.country.title);

        $("div.tabBody:eq(1) section.artBox").append(detail.description);
        $("div.tabBody:eq(2) section.artBox").append(detail.costDescription);

        $("div.vol div.num").html("¥" + util.toThousands(detail.price.cny) +"<span class=\"tag-rank\">排名<b>NO."+ detail.rank + "</b></span>");
        $("div.vol div.num2 span:eq(0)").text("$" + util.toThousands(detail.price.usd));
        $("div.vol div.num2 span:eq(1)").text("BTC" + util.toThousands(detail.price.btc));
    },
    coin: function(list){
        $("table.table.noBg tbody").empty();
        $(list).each(function(index, item){
            $("table.table.noBg tbody").append("<tr>" +
                "    <td>" +
                "        <a href=\"currencies.html?currency="+item.coinCode+"\" target=\"_blank\">" +
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
        totop();
        var currenty = GetRequest().currenty.split('/')[0];
        exchangedetails.dataAjax(currenty);

        util.loadhander();
        util.showmarket();
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
            "<td "+concept.validate(data.avrUpDown)+ ">" + data.avrUpDown + "</td>" +
            "<td title=\"" + data.up.title + "\">" +
            "   <a href=\"currencies.html?currency=" + data.up.code + "\" target=\"_blank\">"+data.up.title +"</a>" +
            "   <span " +concept.validateTag(data.up.amount) + ">" +data.up.amount+ "</span>" +
            "</td>" +
            "<td title=\"" + data.down.title + "\">" +
            "   <a href=\"currencies.html?currency=" + data.down.code + "\" target=\"_blank\">" +data.down.title+ "</a>" +
            "   <span "+concept.validateTag(data.down.amount) + ">" +data.down.amount+ "</span>" +
            "</td>" +
            "<td>" + data.coin.count + "</td>" +
            "<td>" +
            "   <span "+concept.validate(data.coin.up)+ ">" + data.coin.up + "</span>/<span " +concept.validate(data.coin.down)+  ">" + data.coin.down + "</span>" +
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
    validateTag: function(num){
        if(num.indexOf("%") > 0){
            num = num.replace("%","");
        }

        var reg = /^\d+(?=\.{0,1}\d+$|$)/
        if(reg.test(num)){
            return 'class="tags-green"' ;
        }else{
            return 'class="tags-red"';
        }
    },
    validate:function(num) {
        if(num.indexOf("%") > 0){
            num = num.replace("%","");
        }

        var reg = /^\d+(?=\.{0,1}\d+$|$)/
        if(reg.test(num)){
            return 'class="text-green"' ;
        }else{
            return 'class="text-red"';
        }
    },
    process: function(){
        totop();
        concept.dataAjax();

        util.loadhander();
        util.showmarket();
        util.hostconceptList();
        util.loadHomeCoinMaxChange();//涨跌幅
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
        var updown24HColor = "text-green";
        if(data["updown24H"]<0){
            updown24HColor = "text-red";
        }

        return "<tr style='height: 20px;' id=\""+ data["code"] +"\">" +
            "<td>" +data["index"] + "</td>" +
            "<td>" +
            "   <a href=\"currencies.html?currency="+ data["code"] +"\" target=\"_blank\">" +
            "   <img src=\""+data["icon"]+"\" alt=\""+ data["title"] +"\">" +data["title"]+
            "</a>" +
            "</td>" +
            "<td class=\"market-cap\" data-usd=\""+data["marketCap"]["usd"]+"\" data-cny=\""+data["marketCap"]["cny"]+"\" data-btc=\""+data["marketCap"]["btc"]+"\">"+data["marketCap"]["init"]+"</td>" +
            "<td>" +
            "   <a href=\"currencies.html?currency="+ data["code"] +"\" target=\"_blank\" class=\"price\" data-usd=\""+data["price"]["usd"]+"\" data-cny=\"" +data["price"]["cny"]+ "\"" +
            "   data-btc=\"" +data["price"]["btc"]+ "\">" + data["price"]["init"]+ "</a>" +
            " </td>" +
            " <td>" +data["amount"]+ "</td>" +
            " <td>" +
            " <a href=\"currencies.html?currency=" + data["code"] + "\" target=\"_blank\" class=\"volume\" " +
            "data-usd=\"" + data["volume"]["usd"] + "\"" +
            "data-cny=\"" + data["volume"]["usd"] + "\" " +
            "data-btc=\"" + data["volume"]["usd"] + "\">" + data["volume"]["init"] + "</a>" +
            "</td>" +
            "<td class=\"change\">" +
            "  <span class=\"" +updown24HColor+ "\">" +data["updown24H"]+ "%</span>" +
            " </td>" +
            " <td class=\"char\">" +
            "   <span class=\"line2\">" +data["char"]+ "</span>" +
            "</td>" +
            "</tr>";
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
                        $('div.boxContain table.table3 tbody').append(coneptCoin.row(item));
                    });
                    $('.line2').peity('line', { width: 80, height: 20, fill: 'none', strokeWidth: 1, min: 2500, stroke: '#3499da' });
                }
            }
        });
    },
    process: function(){
        totop();
        var index = GetRequest().id;
        coneptCoin.dataAjax(index);

        util.loadhander();
        util.showmarket();
        util.loadHomeCoinMaxChange();//涨跌幅

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
        totop();
        vol.dataAjax();
        vol.scroll();

        util.loadhander();
        util.showmarket();
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
        totop();
        volexchange.dataAjax();
        volexchange.scroll();

        util.loadhander();
        util.showmarket();
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
        totop();
        monthrank.dataAjax();
        util.loadhander();
        util.showmarket();
    }
};

/**
 * 文本信息
 * @type {{pageCount: number, pageSize: number, pageCurrent: number, row: notes.row, page: {pageReader: notes.page.pageReader, next: notes.page.next, prev: notes.page.prev}, ajaxData: notes.ajaxData, process: notes.process}}
 */
var notes = {
    pageCount: 1,
    pageSize: 50,
    pageCurrent: 1,
    row: function(row){
        return '<li>' +
            '   <a href="javascript:void(0);" class="web">'+row["exchange"]["title"]+'</a>' +
            '   <a href="'+row["href"]+'" class="tit" target="_blank" rel="nofollow" title="'+row["title"]+'">' +
            '       <img src="'+row["exchange"]["icon"]+'" alt="'+row["title"]+'">' + row["title"] +
            '       <span class="time">'+row["time"]+'</span>' +
            '   </a>' +
            '</li>';
    },
    page:{
        pageReader: function(){
            $("div.pageList").empty();

            if(notes.pageCurrent == 1){
                $("div.pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="notes.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">首页</a>'+
                    '<a class=\'btn btn-white\' onclick="index.page.next()" href=\'#\'>></a>');
            }else if(notes.pageCurrent == notes.pageCount -1){
                $("div.pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="notes.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">尾页</a>'+
                    '<a class=\'btn btn-white\' onclick="notes.page.next()" href=\'#\'>></a>');
            }else{
                $("div.pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="notes.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">第' + notes.pageCurrent + '页</a>'+
                    '<a class=\'btn btn-white\' onclick="notes.page.next()" href=\'#\'>></a>');
            }
        },
        next: function(){
            if(notes.pageCurrent < notes.pageSize){
                notes.pageCurrent ++;
            }
            notes.page.pageReader();
            notes.ajaxData();
        },
        prev: function(){
            if(notes.pageCurrent > 1){
                notes.pageCurrent -- ;
            }
            notes.page.pageReader();
            notes.ajaxData();
        }
    },
    ajaxData: function(){
        $.ajax({
            url: BASE_URL + "api/currency/notes",
            type: "GET",
            dataType: 'json',
            success: function (data) {
                notes.pageCount = Math.ceil(data.count/notes.pageSize);
                notes.page.pageReader();
                $(data.result).each(function (index, item) {
                    $('ul.noticeList').append(notes.row(item));
                });
            }
        });
    },
    process:function(){
        totop();
        notes.ajaxData();

        util.loadhander();
        util.showmarket();
    }
};

/**
 * 用户货币列表
 * @type {{pageCount: number, pageSize: number, pageCurrent: number, row: userticker.row, pageReader: userticker.pageReader, type, limit: *, volume: *|number|ConstrainDoubleRange|DoubleRange|boolean, price: *, list: userticker.list, getUserInfo: userticker.getUserInfo, process: userticker.process}}
 */
var userticker = {
    pageCount: 1,
    pageSize: 50,
    pageCurrent: 1,
    row: function(data){
        var updown24HColor = "text-green";
        if(data["updown24H"]<0){
            updown24HColor = "text-red";
        }

        return "<tr style='height: 20px;' id=\""+ data["code"] +"\">" +
            "<td>" +data["index"] + "</td>" +
            "<td>" +
            "   <a href=\"currencies.html?currency="+ data["code"] +"\" target=\"_blank\">" +
            "   <img src=\""+data["icon"]+"\" alt=\""+ data["title"] +"\">" +data["title"]+
            "</a>" +
            "</td>" +
            "<td class=\"market-cap\" data-usd=\""+data["marketCap"]["usd"]+"\" data-cny=\""+data["marketCap"]["cny"]+"\" data-btc=\""+data["marketCap"]["btc"]+"\">"+data["marketCap"]["init"]+"</td>" +
            "<td>" +
            "   <a href=\"currencies.html?currency="+ data["code"] +"\" target=\"_blank\" class=\"price\" data-usd=\""+data["price"]["usd"]+"\" data-cny=\"" +data["price"]["cny"]+ "\"" +
            "   data-btc=\"" +data["price"]["btc"]+ "\">" + data["price"]["init"]+ "</a>" +
            " </td>" +
            " <td>" +data["amount"]+ "</td>" +
            " <td>" +
            " <a href=\"currencies.html?currency=" + data["code"] + "\" target=\"_blank\" class=\"volume\" " +
            "data-usd=\"" + data["volume"]["usd"] + "\"" +
            "data-cny=\"" + data["volume"]["usd"] + "\" " +
            "data-btc=\"" + data["volume"]["usd"] + "\">" + data["volume"]["init"] + "</a>" +
            "</td>" +
            "<td class=\"change\">" +
            "  <span class=\"" +updown24HColor+ "\">" +data["updown24H"]+ "%</span>" +
            " </td>" +
            " <td class=\"char\">" +
            "   <span class=\"line2\">" + data["char"]+ "</span>" +
            "</td>" +
            " <td>" +
            "   <div id=\"currency\" class=\"addto disactive\" onclick=\"unfocus(this);\" currency=\"" +data["code"]+ "\" focus=\"true\">取消关注</div>" +
            "</td>" +
            "</tr>";
    },
    pageReader: function(){
        getPageHtml($("div.pageList"), userticker.pageCurrent, userticker.pageCount,function(currentIndex){
            userticker.pageCurrent = currentIndex;
            userticker.ajaxData();
        });
    },
    type: GetRequest().type,
    limit: GetRequest().limit,
    volume: GetRequest().volume,
    price: GetRequest().price,
    list: function(){
        var data = {};
        data.pageSize = index.pageSize;
        data.page = index.pageCurrent;

        if(index.type){
            data.type= index.type;
        }
        if(index.limit){
            data.limit= index.limit;
        }
        if(index.volume){
            data.volume= index.volume;
        }
        if(index.price){
            data.price= index.price;
        }

        data["psession"] = localStorage.getItem("psession")

        $.ajax({
            url: BASE_URL +"user/currency",
            type: "POST",
            dataType: 'json',
            data: data,
            success: function (data) {
                userticker.pageCount = Math.ceil(data.count/userticker.pageSize);
                userticker.pageReader();

                $("tbody#usertickerpageBody").empty();
                $(data.result).each(function (indexData, item) {
                    $("tbody#usertickerpageBody").append(userticker.row(item));
                });
                $('.line2').peity('line', { width: 80, height: 20, fill: 'none', strokeWidth: 1, min: 2500, stroke: '#3499da' });
            }
        });
    },
    getUserInfo: function(){
        $.ajax({
            type: "POST",
            url: BASE_URL+ "user/getUserInfo",
            dataType: "json",
            data: {
                "psession": localStorage.getItem("psession")
            },
            success: function (data) {
                if (data.status == "success") {
                    if (data.username.length > 0 || data.userid.length > 0) {
                        userticker.list();
                        $("div.loginTip").hide();
                    }
                }
            }
        });
    },
    process: function(){
        totop();
        userticker.getUserInfo();
        util.loadhander();
        util.showmarket();
        util.loadnotes();
        util.loadHomeCoinMaxChange();
    }
};

/**
 * 账户中心
 * @type {{}}
 */
var setting = {
    //修改密码
    modify: function(password){
        if(password.old.length == 0){
            alert("旧密码不可以为空！");
        }
        if(password.new1.length<4){
            alert("新密码长度过短！");
        }
        if(password.new1 != password.new2){
            alert("两次密码输入错误");
            return;
        }

        $.ajax({
            url: BASE_URL + "user/main/modifypassword",
            type: "POST",
            dataType: "json",
            data: {
                "psession": localStorage.getItem("psession"),
                "password": password
            },
            success: function(data){
                if(data.status == "success"){
                    alert("密码修改成功");
                    $("div.modify button.cancel").click();
                    setting.dataAjax();
                }else{
                    alert(data.content);
                }
            },
            error: function(){
                alert("密码修改失败");
            }
        });
    },
    //用户昵称修改
    namenick:function(usernick){
        $.ajax({
            url: BASE_URL + "user/main/usernick",
            type: "POST",
            dataType: "json",
            data: {
                "psession": localStorage.getItem("psession"),
                "usernick": usernick
            },
            success: function(data){
                alert("昵称修改成功");
                $("div.usernick span.nameedit button.cancel").click();
                setting.dataAjax();
            },
            error: function(){
                alert("昵称修改失败");
            }
        });
    },
    dataAjax: function(){
        $.ajax({
            url: BASE_URL + "user/main/userInfo",
            type: "POST",
            dataType: "json",
            data: {
                "psession": localStorage.getItem("psession")
            },
            success: function (data) {
                if(data.status == "success"){
                    $("div.userName div.main").text(data.username);
                    $("div.userName div.sub").text(data.usernick);
                    $("div.userinfo div.username span.info").text(data.username);
                    $("div.userinfo div.usernick span.info").text(data.usernick);
                    $("div.userinfo div.usernick span.nameedit input").val(data.usernick);
                    $("div.userinfo div.usertime span.info").text(data.time);
                }
                else{
                    alert("账户没有登录");
                    window.location.replace("index.html");
                }
            }
        });
    },
    process: function(){
        totop();
        util.loadhander();
        setting.dataAjax();

        $("span.editbtn.editname").click(function(){
            $(this).hide();
            $("div.usernick span.info").hide();
            $("div.usernick span.nameedit").show();
        });
        $("div.usernick span.nameedit button.sure").click(function(){
            setting.namenick($("span.input.nameedit input").val());
        });
        $("div.usernick span.nameedit button.cancel").click(function(){
            $("span.editbtn.editname").show();
            $("div.usernick span.info").show();
            $("div.usernick span.nameedit").hide();
        });

        $("div.modify span.editbtn.editpwd").click(function(){
            $(this).hide();
            $("div.input.pwdedit").show();
        });
        $("div.modify button.cancel").click(function(){
            $("div.modify span.editbtn.editpwd").show();
            $("div.input.pwdedit").hide();
        });
        $("div.modify button.sure").click(function(){
            setting.modify({
                old: $("input#old").val(),
                new1: $("input#new1").val(),
                new2: $("input#new2").val(),
            });
        });
    }
};

var about = {
    process: function(){
        totop();
    }
};
var contact = {
    process: function(){
        totop();
    }
};
var faq = {
    process: function(){
        totop();
    }
};
var manager = {
    process: function(){
        totop();
    }
};