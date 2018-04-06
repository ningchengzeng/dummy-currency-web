﻿function series_is_visible(chartName, index, defaultState) {
    var preferences = Cookies.getJSON("highcharts_" + chartName);
    if (preferences === undefined) {
        return defaultState;
    }
    return preferences[index];
}
function tooltip_format_market_cap() {
    val = format_market_cap(this.y);
    return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + val + ' CNY</b><br/>'
}
function tooltip_format_crypto() {
    val = this.y;
    return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + val + '</b><br/>'
}

function tooltip_format_fiat() {
    val = this.y;
    return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + val + '</b><br/>'
}

function label_format_market_cap() {
    val = format_market_cap(this.value)
    return '¥' + val;
}

function label_format_fiat() {
    val = this.y;
    return val;
}

function is_mobile() {

    var mobile = $("#metadata").data("mobile");
    return mobile == "True"
}
function HighChartsGraph(graphId, loadingId, noDataId) {
    this.graphId = graphId;
    this.loadingId = loadingId;
    this.noDataId = noDataId;
}

HighChartsGraph.prototype.init = function (start, end) {
    var that = this;
    that.fetchAndLoad(that.initCharts, start, end)
}
HighChartsGraph.prototype.chartsLoaded = function () {
    var chart = $("#" + this.graphId).highcharts();
    return chart !== undefined;
}
HighChartsGraph.prototype.hideLoading = function () {
    $("#" + this.loadingId).hide();
}
HighChartsGraph.prototype.showNoData = function () {
    $("#" + this.noDataId).removeClass('hidden');
}
HighChartsGraph.prototype.afterSetExtremes = function (e) {
    if (e.dataMin != e.min || e.dataMax != e.max) {
        that = this;
        var min = Math.round(e.min);
        var max = Math.round(e.max);
        that.updateCharts(min, max)
    }
}
HighChartsGraph.prototype.updateCharts = function (min, max) {
    var that = this;
    var chart = $('#' + that.graphId).highcharts();
    chart.showLoading('');
    that.fetchAndLoad(that.finishUpdateCharts, min, max);
}
HighChartsGraph.prototype.finishUpdateCharts = function (seriesData) {
}
HighChartsGraph.prototype.fetchAndLoad = function (callback, start, end) {
}
HighChartsGraph.prototype.initCharts = function (seriesData) {
}
function GbiGraph(graphId, loadingId, noDataId) {
    HighChartsGraph.call(this, graphId, loadingId, noDataId);

}
GbiGraph.prototype = new HighChartsGraph;
GbiGraph.constructor = GbiGraph;
GbiGraph.prototype.finishUpdateCharts = function (seriesData) {
    var that = this;
    var chart = $('#' + that.graphId).highcharts();
    chart.series[0].setData(seriesData["platformRank"]);
    chart.series[1].setData(seriesData["vol_cny"]);
    chart.hideLoading();
}
GbiGraph.prototype.fetchAndLoad = function (callback, start, end) {
    var sitecode = $("#HSiteCode").val();
    var that = this;
    var apiDomain = "//mapi.feixiaohao.com";
    timeParams = ""
    if (start !== undefined && end !== undefined) {
        timeParams = start + "/" + end + "/";
    }
    var data6={"platformRank": [[1504281600000,21],[1504368000000,22],[1504454400000,15],[1504540800000,21],[1504627200000,23],[1504713600000,22],[1504800000000,18],[1504886400000,21],[1504972800000,21],[1505059200000,21],[1505145600000,21],[1505232000000,21],[1505318400000,23],[1505404800000,22],[1505491200000,22],[1505577600000,22],[1505664000000,23],[1505750400000,23],[1505836800000,19],[1505923200000,20],[1506009600000,17],[1506096000000,17],[1506182400000,17],[1506268800000,15],[1506355200000,17],[1506441600000,12],[1506528000000,12],[1506614400000,10],[1506700800000,11],[1506787200000,8],[1506873600000,8],[1506960000000,7],[1507046400000,9],[1507132800000,7],[1507219200000,11],[1507305600000,9],[1507392000000,9],[1507478400000,12],[1507564800000,14],[1507651200000,13],[1507737600000,14],[1507824000000,18],[1507910400000,17],[1507996800000,15],[1508083200000,15],[1508169600000,12],[1508256000000,13],[1508342400000,15],[1508428800000,13],[1508515200000,14],[1508601600000,14],[1508688000000,16],[1508774400000,14],[1508860800000,14],[1508947200000,13],[1509033600000,13],[1509120000000,12],[1509206400000,14],[1509292800000,16],[1509379200000,14],[1509465600000,14],[1509552000000,16],[1509638400000,16],[1509724800000,15],[1509811200000,16],[1509897600000,17],[1509984000000,14],[1510070400000,11],[1510156800000,11],[1510243200000,11],[1510329600000,17],[1510416000000,15],[1510502400000,13],[1510588800000,14],[1510675200000,10],[1510761600000,10],[1510848000000,12],[1510934400000,12],[1511020800000,8],[1511107200000,6],[1511193600000,6],[1511280000000,10],[1511366400000,6],[1511452800000,8],[1511539200000,9],[1511625600000,7],[1511712000000,11],[1511798400000,7],[1511884800000,9],[1511971200000,12],[1512057600000,11],[1512144000000,8],[1512230400000,8],[1512316800000,7],[1512403200000,5],[1512489600000,6],[1512576000000,6],[1512662400000,8],[1512748800000,9],[1512835200000,6],[1512921600000,7],[1513008000000,6],[1513094400000,7],[1513180800000,5],[1513267200000,4],[1513353600000,4],[1513440000000,4],[1513526400000,2],[1513612800000,4],[1513699200000,4],[1513785600000,4],[1513872000000,4],[1513958400000,7],[1514044800000,3],[1514131200000,3],[1514217600000,1],[1514304000000,1],[1514390400000,1],[1514476800000,3],[1514563200000,2],[1514649600000,1],[1514736000000,1],[1514822400000,1],[1514908800000,1],[1514995200000,1],[1515081600000,1],[1515168000000,1],[1515254400000,1],[1515340800000,1],[1515427200000,1],[1515513600000,1],[1515600000000,1],[1515686400000,1],[1515772800000,2],[1515859200000,2],[1515945600000,2],[1516032000000,1],[1516118400000,2],[1516204800000,2],[1516291200000,3],[1516377600000,2],[1516464000000,3],[1516550400000,3],[1516636800000,3],[1516723200000,2],[1516809600000,1],[1516896000000,2],[1516982400000,2],[1517068800000,1],[1517155200000,1],[1517241600000,1],[1517328000000,2],[1517414400000,3],[1517500800000,3],[1517587200000,3],[1517673600000,2],[1517760000000,3],[1517846400000,5],[1517932800000,3],[1518019200000,3],[1518105600000,3],[1518192000000,7],[1518278400000,3],[1518364800000,3],[1518451200000,3],[1518537600000,4],[1518624000000,1],[1518710400000,1],[1518796800000,1],[1518883200000,2],[1518969600000,2],[1519056000000,2],[1519142400000,2],[1519228800000,2],[1519315200000,2],[1519401600000,2],[1519488000000,2],[1519574400000,3],[1519660800000,2],[1519747200000,3],[1519833600000,3],[1519920000000,3],[1520006400000,3],[1520092800000,3],[1520179200000,3],[1520265600000,3],[1520352000000,3],[1520438400000,2],[1520524800000,3],[1520611200000,3],[1520697600000,3],[1520784000000,3],[1520870400000,4],[1520956800000,2],[1521043200000,2],[1521129600000,2],[1521216000000,2],[1521302400000,2],[1521388800000,2],[1521475200000,2],[1521561600000,2],[1521648000000,2],[1521734400000,2],[1521820800000,3],[1521907200000,2]],"vol_cny": [[1504281600000,567309945.53],[1504368000000,643829711.00],[1504454400000,761231216.87],[1504540800000,684206415.47],[1504627200000,430041813.73],[1504713600000,398343108.67],[1504800000000,428737717.27],[1504886400000,431353369.87],[1504972800000,201015658.40],[1505059200000,220837630.07],[1505145600000,255956505.33],[1505232000000,336953797.20],[1505318400000,195368905.87],[1505404800000,227159364.40],[1505491200000,276982959.67],[1505577600000,194948774.40],[1505664000000,117194060.60],[1505750400000,164035396.73],[1505836800000,183571814.67],[1505923200000,154344671.13],[1506009600000,173373424.53],[1506096000000,202175192.07],[1506182400000,202678371.33],[1506268800000,207260727.80],[1506355200000,302100385.00],[1506441600000,409992651.93],[1506528000000,604161235.73],[1506614400000,808664323.40],[1506700800000,642706367.87],[1506787200000,699624100.33],[1506873600000,729349854.13],[1506960000000,777069019.20],[1507046400000,678839917.40],[1507132800000,629411872.13],[1507219200000,605681158.07],[1507305600000,505899757.20],[1507392000000,491035254.40],[1507478400000,536053830.07],[1507564800000,611027134.07],[1507651200000,587674782.60],[1507737600000,446870089.47],[1507824000000,554753560.33],[1507910400000,792094852.20],[1507996800000,541120981.20],[1508083200000,612090261.60],[1508169600000,699022438.73],[1508256000000,642393480.73],[1508342400000,662225260.40],[1508428800000,613008171.60],[1508515200000,654560925.47],[1508601600000,555212872.47],[1508688000000,488616809.40],[1508774400000,548578155.53],[1508860800000,817363152.67],[1508947200000,586497415.07],[1509033600000,547588631.27],[1509120000000,532052303.47],[1509206400000,505271120.73],[1509292800000,689609694.53],[1509379200000,618972049.67],[1509465600000,630219096.33],[1509552000000,759809026.87],[1509638400000,972234684.27],[1509724800000,945235477.53],[1509811200000,730397312.20],[1509897600000,692435260.20],[1509984000000,934489958.27],[1510070400000,925317405.20],[1510156800000,1510717356.20],[1510243200000,1352972224.07],[1510329600000,1510424703.73],[1510416000000,1878922783.67],[1510502400000,3178374543.13],[1510588800000,1958058860.13],[1510675200000,1786007252.33],[1510761600000,1614254363.87],[1510848000000,1896631793.80],[1510934400000,2233318060.60],[1511020800000,2570272972.13],[1511107200000,2427461551.00],[1511193600000,3157060784.80],[1511280000000,2426903596.53],[1511366400000,3285608058.33],[1511452800000,3302511191.93],[1511539200000,3211351228.53],[1511625600000,2923990212.60],[1511712000000,2904388270.73],[1511798400000,3578748234.87],[1511884800000,4275411753.87],[1511971200000,4901330494.80],[1512057600000,4267439565.20],[1512144000000,4193737834.53],[1512230400000,3897901365.07],[1512316800000,4465142139.73],[1512403200000,5456018128.93],[1512489600000,7488998940.33],[1512576000000,8582109565.60],[1512662400000,7396684175.73],[1512748800000,8773659228.07],[1512835200000,7193472627.27],[1512921600000,6470726304.53],[1513008000000,7389336323.73],[1513094400000,11568658235.27],[1513180800000,12052837603.27],[1513267200000,15937578153.80],[1513353600000,12849935664.00],[1513440000000,14464654543.47],[1513526400000,16338216135.07],[1513612800000,20442193378.47],[1513699200000,20798705893.47],[1513785600000,27335079344.87],[1513872000000,22861731529.60],[1513958400000,20494198074.80],[1514044800000,17610865651.20],[1514131200000,15604242931.67],[1514217600000,17785709317.47],[1514304000000,20780162780.07],[1514390400000,18334602187.53],[1514476800000,18544708823.07],[1514563200000,24700095231.40],[1514649600000,25366996304.00],[1514736000000,23576606017.67],[1514822400000,21955967562.80],[1514908800000,35688080603.20],[1514995200000,38815903712.80],[1515081600000,50557996977.47],[1515168000000,56033352146.20],[1515254400000,52181596924.53],[1515340800000,42105579983.13],[1515427200000,42238534141.87],[1515513600000,41189888936.13],[1515600000000,44628030116.47],[1515686400000,36899782068.93],[1515772800000,25697626318.20],[1515859200000,35821253080.53],[1515945600000,24856636474.40],[1516032000000,25307710212.25],[1516118400000,29227522256.69],[1516204800000,33807015575.38],[1516291200000,27826295639.00],[1516377600000,21099862914.69],[1516464000000,21820566825.88],[1516550400000,16858017863.69],[1516636800000,19535153136.38],[1516723200000,17156995026.56],[1516809600000,20549430940.50],[1516896000000,15640626707.13],[1516982400000,15463305113.69],[1517068800000,11422417221.13],[1517155200000,15024759930.25],[1517241600000,12220262557.94],[1517328000000,12767141143.50],[1517414400000,10653515714.25],[1517500800000,13949875961.94],[1517587200000,18800870799.56],[1517673600000,10723410931.88],[1517760000000,9450724635.69],[1517846400000,11350513185.63],[1517932800000,19344670578.44],[1518019200000,11950261684.94],[1518105600000,12531566964.38],[1518192000000,7198590852.00],[1518278400000,12075702709.75],[1518364800000,9893012047.94],[1518451200000,9682742867.81],[1518537600000,8208556401.13],[1518624000000,13205233794.63],[1518710400000,15472402710.88],[1518796800000,13065414070.81],[1518883200000,13511349045.81],[1518969600000,13430950749.38],[1519056000000,11544271855.13],[1519142400000,13760776327.75],[1519228800000,13795464594.50],[1519315200000,12087233398.38],[1519401600000,13350658872.50],[1519488000000,11637433737.25],[1519574400000,9194268988.06],[1519660800000,12387393766.56],[1519747200000,11068536124.00],[1519833600000,10873266799.75],[1519920000000,10884617494.06],[1520006400000,9940128462.00],[1520092800000,8298982269.81],[1520179200000,7513674829.44],[1520265600000,8262307651.00],[1520352000000,9209062328.44],[1520438400000,11837484446.19],[1520524800000,9313468341.88],[1520611200000,10923051436.13],[1520697600000,6478043649.31],[1520784000000,7240464212.81],[1520870400000,7468807666.31],[1520956800000,9802837550.75],[1521043200000,8865784700.75],[1521129600000,10046882131.81],[1521216000000,7870039175.31],[1521302400000,6357868650.00],[1521388800000,10954775302.44],[1521475200000,11328591308.44],[1521561600000,11473758042.00],[1521648000000,12045167150.31],[1521734400000,10350251854.25],[1521820800000,15537790108.94],[1521907200000,13796560828.50]]};
    
    if (undefined != data6 && null != data6) {
        if (data6.platformRank.length >= 1) {
            $("#platformrankBox").css("display", "block");
        }
    }
    callback.call(that, data6);
    // $.ajax({
    //     url: apiDomain + "/platformrank/" + sitecode + "/" + timeParams,
    //     type: "GET",
    //     dataType: "json",
    //     error: function () {
    //         that.hideLoading();
    //         that.showNoData();
    //     },
    //     success: function (data) {
            

    //     }
    // });
}
GbiGraph.prototype.initCharts = function (seriesData) {
    var that = this;
    Highcharts.setOptions({
        global: { useUTC: false },
        lang: {
            downloadJPEG: "下载jpg",
            downloadPDF: '下载pdf',
            downloadPNG: '下载png',
            downloadSVG: '下载svg',
            loading: '',
            months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            printChart: '打印图表',
            shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            //rangeSelectorFrom: "从",
            //rangeSelectorTo: "到",
            rangeSelectorZoom: "缩放",
            resetZoom: "恢复初始缩放等级",
            resetZoomTitle: " 1:1缩放等级",
            shortWeekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            numericSymbols: ["千", "百万", '十亿'],
            thousandsSep: ","
        }
    });
    var titleName = $("#HSiteCode").val() + "历史排名趋势图";
    $('#' + that.graphId).highcharts('StockChart', {
        chart: { type: 'line', zoomType: is_mobile() ? 'null' : 'x', ignoreHiddenSeries: true },
        tooltip: { shared: true, hideDelay: 50, xDateFormat: '%A, %b %d %Y' },
        legend: {
            enabled: false,
            align: 'center',
            backgroundColor: '#FFFFFF',
            borderColor: 'black',
            borderWidth: 0,
            layout: 'horizontal',
            verticalAlign: 'bottom',
            y: 0,
            shadow: false,
            floating: false
        },
        navigator: { adaptToUpdatedData: false },
        scrollbar: { liveRedraw: false },
        //title: { text: "", align: "left", style: { fontSize: "24px" } },
        subtitle: { text: '' },
        //rangeSelector: {
        //    allButtonsEnabled: true,
        //    buttons: [{ type: 'day', count: 1, text: 'D' }, { type: 'week', count: 1, text: 'W' }, {
        //        type: 'month',
        //        count: 1,
        //        text: 'M'
        //    }, { type: 'year', count: 1, text: 'Y' }, { type: 'all', text: 'ALL' }],
        //    selected: 5,
        //    inputEnabled: true,
        //    enabled: true
        //},
        xAxis: [{
            dateTimeLabelFormats: {
                day: '%Y<br/>%m-%d',
                week: '%Y<br/>%m-%d',
                month: '%Y-%m',
                year: '%Y'
            },
            events: {
                afterSetExtremes: function (e) {
                    that.afterSetExtremes(e)
                }
            }, minRange: 24 * 3600 * 1000
        }],
        yAxis: [{
            labels: { formatter: label_format_fiat, style: { color: '#666666', }, align: "right", x: -30 },
            title: { text: '排名', style: { color: '#666666', 'font-weight': 'bold' } },
            showEmpty: false,
            height: '80%',
            opposite: true,
            floor: 0,
            min: 1,
            reversed: true
        }
        , {
            labels: { align: 'right', style: { color: '#777', } },
            title: { text: '24h 成交量', style: { color: '#777', 'font-weight': 'bold' } },
            showEmpty: false,
            top: '80%',
            height: '20%',
            offset: 2,
            lineWidth: 1,
            opposite: true
        }],
        series: [{
            name: $("#HSiteCode").val() + "排名",
            yAxis: 0,
            color: '#85BCEB',
            tooltip: { pointFormatter: tooltip_format_fiat },
            data: seriesData["platformRank"],
            dataGrouping: { enabled: false }
        }
        , {
            type: 'column',
            name: '24h 成交量',
            color: '#777',
            yAxis: 1,
            tooltip: { pointFormatter: tooltip_format_market_cap },
            data: seriesData["vol_cny"],
            dataGrouping: { approximation: "average", enabled: false }
        }],
        plotOptions: {
            series: {
                events: {
                    legendItemClick: function (event) {
                        var index = event.target.index
                        save_preferences(that.chartName, index, this.chart);
                    }
                }
            }
        },
    });
    that.hideLoading();
}

$(document).ready(function () {
    $(function () {
        var hash = window.location.hash;
        var gbiGraph = new GbiGraph("highcharts-graph_platformrank", "highcharts-loading_platformrank", "highcharts-nodata_platformrank");
        gbiGraph.init();
       

    });

});