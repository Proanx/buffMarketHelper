// ==UserScript==
// @name            网易BUFF价格比例(找挂刀)插件
// @icon            https://gitee.com/pronax/drawing-bed/raw/master/wingman/Wingman.png
// @homepageURL     https://greasyfork.org/zh-CN/users/412840-newell-gabe-l
// @description     找挂刀，看比例，挑玄学
// @version         2.3.11
// @note            更新于2021年7月6日20:04:25
// @author          Pronax
// @copyright       2021, Pronax
// @supportURL      https://jq.qq.com/?_wv=1027&k=U8mqorxQ
// @feedback-url    https://jq.qq.com/?_wv=1027&k=U8mqorxQ
// @license         AGPL-3.0
// @match           https://buff.163.com/market/goods*
// @match           https://buff.163.com/market/?game=*
// @run-at          document-body
// @grant           GM_xmlhttpRequest
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_info
// @grant           GM_registerMenuCommand
// ==/UserScript==

(function () {

    'use strict';

    // 防止重复安装冲突
    if ($(".logo").hasClass("buffHelperLoaded")) { return; }
    $(".logo").addClass("buffHelperLoaded");

    const steamOrderScaleTemp = "<span class=\"f_12px f_Bold l_Right steam_temp steam_order_scale\"></span>";
    const steamSoldNumberTemp = "<span class=\"f_12px c_Green f_Bold l_Right steam_temp steam_sold_number\"></span>";
    const steamOrderNumberTemp = "<span class=\"f_12px c_Gray f_Bold l_Right steam_temp steam_order_number\"></span>";
    const steamOrderNumberErrorTemp = "<span class=\"f_12px c_Gray f_Bold l_Right steam_temp steam_order_number_error\" style=\"color:#e45302 !important\"></span>";
    const g_rgCurrencyData = { "AED": { "strCode": "AED", "eCurrencyCode": 32, "strSymbol": "AED", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "ARS": { "strCode": "ARS", "eCurrencyCode": 34, "strSymbol": "ARS$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " " }, "AUD": { "strCode": "AUD", "eCurrencyCode": 21, "strSymbol": "A$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "BGN": { "strCode": "BGN", "eCurrencyCode": 42, "strSymbol": "лв", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "BRL": { "strCode": "BRL", "eCurrencyCode": 7, "strSymbol": "R$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " " }, "BYN": { "strCode": "BYN", "eCurrencyCode": 36, "strSymbol": "Br", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "CAD": { "strCode": "CAD", "eCurrencyCode": 20, "strSymbol": "CDN$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "CHF": { "strCode": "CHF", "eCurrencyCode": 4, "strSymbol": "CHF", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": " " }, "CLP": { "strCode": "CLP", "eCurrencyCode": 25, "strSymbol": "CLP$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " " }, "CNY": { "strCode": "CNY", "eCurrencyCode": 23, "strSymbol": "¥", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "COP": { "strCode": "COP", "eCurrencyCode": 27, "strSymbol": "COL$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " " }, "CRC": { "strCode": "CRC", "eCurrencyCode": 40, "strSymbol": "₡", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": "" }, "CZK": { "strCode": "CZK", "eCurrencyCode": 44, "strSymbol": "Kč", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "DKK": { "strCode": "DKK", "eCurrencyCode": 45, "strSymbol": "kr.", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "EUR": { "strCode": "EUR", "eCurrencyCode": 3, "strSymbol": "€", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": "" }, "GBP": { "strCode": "GBP", "eCurrencyCode": 2, "strSymbol": "£", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "HKD": { "strCode": "HKD", "eCurrencyCode": 29, "strSymbol": "HK$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "HRK": { "strCode": "HRK", "eCurrencyCode": 43, "strSymbol": "kn", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "HUF": { "strCode": "HUF", "eCurrencyCode": 46, "strSymbol": "Ft", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "IDR": { "strCode": "IDR", "eCurrencyCode": 10, "strSymbol": "Rp", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": " " }, "ILS": { "strCode": "ILS", "eCurrencyCode": 35, "strSymbol": "₪", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "INR": { "strCode": "INR", "eCurrencyCode": 24, "strSymbol": "₹", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "JPY": { "strCode": "JPY", "eCurrencyCode": 8, "strSymbol": "¥", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "KRW": { "strCode": "KRW", "eCurrencyCode": 16, "strSymbol": "₩", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "KWD": { "strCode": "KWD", "eCurrencyCode": 38, "strSymbol": "KD", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "KZT": { "strCode": "KZT", "eCurrencyCode": 37, "strSymbol": "₸", "bSymbolIsPrefix": false, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": "" }, "MXN": { "strCode": "MXN", "eCurrencyCode": 19, "strSymbol": "Mex$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "MYR": { "strCode": "MYR", "eCurrencyCode": 11, "strSymbol": "RM", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "NOK": { "strCode": "NOK", "eCurrencyCode": 9, "strSymbol": "kr", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " " }, "NXP": { "strCode": "NXP", "eCurrencyCode": 9001, "strSymbol": "원", "bSymbolIsPrefix": false, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "NZD": { "strCode": "NZD", "eCurrencyCode": 22, "strSymbol": "NZ$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "PEN": { "strCode": "PEN", "eCurrencyCode": 26, "strSymbol": "S/.", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "PHP": { "strCode": "PHP", "eCurrencyCode": 12, "strSymbol": "P", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "PLN": { "strCode": "PLN", "eCurrencyCode": 6, "strSymbol": "zł", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": "" }, "QAR": { "strCode": "QAR", "eCurrencyCode": 39, "strSymbol": "QR", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "RMB": { "strCode": "RMB", "eCurrencyCode": 23, "strSymbol": "¥", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "RON": { "strCode": "RON", "eCurrencyCode": 47, "strSymbol": "lei", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "RUB": { "strCode": "RUB", "eCurrencyCode": 5, "strSymbol": "pуб.", "bSymbolIsPrefix": false, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": "", "strSymbolAndNumberSeparator": " " }, "SAR": { "strCode": "SAR", "eCurrencyCode": 31, "strSymbol": "SR", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "SEK": { "strCode": "SEK", "eCurrencyCode": 33, "strSymbol": "kr", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "SGD": { "strCode": "SGD", "eCurrencyCode": 13, "strSymbol": "S$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "THB": { "strCode": "THB", "eCurrencyCode": 14, "strSymbol": "฿", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "TRY": { "strCode": "TRY", "eCurrencyCode": 17, "strSymbol": "TL", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " " }, "TWD": { "strCode": "TWD", "eCurrencyCode": 30, "strSymbol": "NT$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "UAH": { "strCode": "UAH", "eCurrencyCode": 18, "strSymbol": "₴", "bSymbolIsPrefix": false, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": "" }, "USD": { "strCode": "USD", "eCurrencyCode": 1, "strSymbol": "$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "UYU": { "strCode": "UYU", "eCurrencyCode": 41, "strSymbol": "$U", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": "" }, "VND": { "strCode": "VND", "eCurrencyCode": 15, "strSymbol": "₫", "bSymbolIsPrefix": false, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": "" }, "ZAR": { "strCode": "ZAR", "eCurrencyCode": 28, "strSymbol": "R", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": " " } }
    const enhancement_support_list = Array("rifle", "knife", "pistol", "smg", "machinegun", "shotgun", "hands");
    const strLengthLimit = { "USD": 18, "RUB": 17, "CNY": 18, "EUR": 19 };
    const defaultConfig = {
        maxRange: 1,
        minRange: 0.63,
        needSort: null,
        pageSize: 20,
        orderFloatLeft: false,
        overrideSortRule: false,
        sortAfterAllDone: true,
        marketColorLow: "#ff1e1e",
        marketColorHigh: "#5027ff",
        steamCurrency: "CNY",
        currencyDisplayMode: "strCode"
    };
    var steam_lowest_sell_order_detail = 0;     // 商品详情页专用-steam最低出售价
    var steam_highest_buy_order_detail = 0;     // 商品详情页专用-steam最高求购价
    var helper_config;
    var displayCurrency;
    var steamCurrency;
    var steamConnection = undefined;
    var steamFailedTimes = 0;
    var market_color_high = [];
    var market_color_low = [];
    var itemCount = 0;
    var itemNum = 0;
    var needSort;

    // 为true时a标签会变成绿色提醒你
    var isDemoVersion = 1;

    // 设置界面
    GM_addStyle(".helper-setting input[type=number]{max-width:70px}input[type=\"number\"]{-moz-appearance:textfield}.helper-setting-shadow{position:fixed;justify-content:center;align-items:center;display:none;z-index:100;top:0;right:0;bottom:0;left:0;margin:0;background:#00000066}.helper-setting{background:#fff;border-radius:5px;padding:30px 40px 10px;top:25%}.w-Checkbox.helper-setting-option>span:first-child{margin:0!important;font-size:14px}.helper-setting-steamConnection i.icon{margin-left:0!important}.helper-setting .list_tb span,.helper-setting .list_tb i.icon{margin-left:12px}.helper-setting .icon_status_progressing{animation:rotate-L 1.5s linear infinite;-webkit-animation:rotate-L 1.5s linear infinite}.helper-setting>.list_tb tr:last-child>td{border-bottom:0}.helper-setting td.setting-title{height:0;border:0;padding:5px 0 0 0}");
    helper_config = loadConfig();

    // 通常会在底下的if之后执行
    $(function () {

        window.onerror = function (e) {
            console.log("出现了意料之外的错误" + "\n" + "行号：" + e.lineno + "  列号：" + e.colno + "  错误信息：" + e.message);
        }

        if (isDemoVersion) {
            GM_addStyle("a{color:#00CC6A !important}");
        }
        $("body").append('<div class="cont_main helper-setting-shadow"><div class="helper-setting"><b>基础设定</b><span id="helper-version" style="float: right;">插件版本：</span><table class="list_tb"><tbody><tr><td class="t_Left c_Gray">STEAM连接性：</td><td class="t_Left helper-setting-steamConnection"><span class="c_Yellow"><i class="icon icon_status_waiting"></i>未知</span></td><td class="t_Right"><span class="c_DGrey steamConnectionCountdown" style="display: none;"></span><a href="javascript:void(0);" id="helper-setting-checkBtn" class="i_Btn i_Btn_small">检测</a></td></tr><tr><td class="t_Left c_Gray">steam参考货币</td><td class="t_Left"><span><div id="helper-setting-currency" class="w-Select helper-setting-option" data-option-target="steamCurrency" style="width: 120px; visibility: visible;"><h3 style="margin:0;font-weight:normal;">默认</h3><i class="icon icon_drop"></i><ul style="width: 120px;height: 200px;overflow: auto;" class="steam-currency-selector"></ul></div></span></td><td class="t_Center"><i class="icon icon_qa j_tips_handler" style="margin-left: 0;" data-title="&lt;p class=&quot;c_Red&quot;&gt;没有特殊需求就不要改&lt;/p&gt;" data-content="选择获取steam数据时使用什么货币，buff价格依旧是人民币，乱改会导致比例错误。默认为CNY（￥）" data-direction="right"></i><span><div id="helper-setting-currencyDisplayMode" class="w-Select helper-setting-option" data-option-target="currencyDisplayMode" style="width: 80px; visibility: visible;"><h3 style="margin:0;font-weight:normal;">默认</h3><i class="icon icon_drop"></i><ul style="width: 80px;"><li value="strCode">缩写</li><li value="strSymbol">符号</li></ul></div></span></td></tr></tbody><tbody><tr><td class="t_Left setting-title" colspan="3"><b>市场页设定</b></td></tr><tr><td class="t_Left c_Gray" width="120">覆盖排序规则</td><td class="t_Left"><span><div id="helper-setting-stickerSort" class="w-Checkbox helper-setting-option" data-option-target="overrideSortRule" value=""><span value="true"><i class="icon icon_checkbox"></i>启用 </span></div></span><i class="icon icon_qa j_tips_handler" data-title="说明：" data-content="开启后使用buff排序（比如当你按价格排序时）比例排序规则重置为默认，不再按比例排序（刷新页面后会恢复保存的规则）" data-direction="right"></i></td><td class="t_Right"></td></tr><tr><td class="t_Left c_Gray" width="120">完成后排序</td><td class="t_Left"><span><div id="helper-setting-sortAfterAllDone" class="w-Checkbox helper-setting-option" data-option-target="sortAfterAllDone" value=""><span value="true"><i class="icon icon_checkbox"></i>启用 </span></div></span><i class="icon icon_qa j_tips_handler" data-title="说明：" data-content="启用时会等所有饰品比例都加载完成再进行排序，关闭时每加载完一个饰品就排序一次" data-direction="right"></i></td><td class="t_Right"></td></tr><tr><td class="t_Left c_Gray">默认排序规则</td><td class="t_Left"><span><div id="helper-setting-sortRule" class="w-Select helper-setting-option" data-option-target="needSort" style="width: 130px; visibility: visible;"><h3 style="margin:0;font-weight:normal;">不排序</h3><i class="icon icon_drop"></i><ul style="width: 130px;"><li value="null">不排序</li><li value="buff-sort_asc">按buff比例从低到高</li><li value="buff-sort_desc">按buff比例从高到低</li><li value="order-sort_asc">按求购比例从低到高</li><li value="order-sort_desc">按求购比例从高到低</li></ul></div></span></td><td class="t_Right"></td></tr><tr><td class="t_Left c_Gray">每页显示数量</td><td class="t_Left" style="position: relative;"><span><input type="number" id="helper-setting-pageSize" data-option-target="pageSize" class="i_Text helper-setting-option" min="1" max="80" step="1"></span><i class="icon icon_qa j_tips_handler" data-title="&lt;p class=&quot;c_Red&quot;&gt;可能加大封号风险&lt;/p&gt;" data-content="修改每页显示数量，由于buff反爬虫机制尚不明确，封号概率可能增加也可能减少，谨慎使用，默认值20，最大值80" data-direction="right"></i></td><td class="t_Right"></td></tr><tr><td class="t_Left c_Gray">渐变色</td><td class="t_Left" colspan="2" style="position: relative;"><span class="c_DGray">最小 <input type="color" id="helper-setting-marketColorLow" data-option-target="marketColorLow" class="helper-setting-option"></span><i class="icon icon_qa j_tips_handler" data-title="" data-content="渐变最小值：比例越接近最小值（默认是0.63）会越趋近这个颜色<br/>渐变最大值：比例越接近最大值（默认是1）会越趋近这个颜色" data-direction="bottom"></i><span class="c_DGray">最大 <input type="color" id="helper-setting-marketColorHigh" data-option-target="marketColorHigh" class="helper-setting-option"></span></td></tr><tr><td class="t_Left c_Gray">比例极值</td><td class="t_Left" colspan="2" style="position: relative;"><span class="c_DGray">最小 <input type="number" id="helper-setting-minRange" data-option-target="minRange" class="i_Text helper-setting-option" min="0" max="1" step="0.01"></span><i class="icon icon_qa j_tips_handler" data-title="" data-content="比例最小值：小于等于这个值的比例会直接渲染成最小值渐变色<br/>比例最大值：大于等于这个值的比例会直接渲染成最大值渐变色" data-direction="bottom"></i><span class="c_DGray">最大 <input type="number" id="helper-setting-maxRange" data-option-target="maxRange" class="i_Text helper-setting-option" min="1" max="100"></span></td></tr></tbody><tbody><tr><td class="t_Left setting-title" colspan="3"><b>详情页设定</b></td></tr><tr><td class="t_Left c_Gray">求购列表靠左显示</td><td class="t_Left" style="position: relative;"><span><div id="helper-setting-orderFloatLeft" class="w-Checkbox helper-setting-option" data-option-target="orderFloatLeft" value=""><span value="true"><i class="icon icon_checkbox"></i>启用 </span></div></span><i class="icon icon_qa j_tips_handler" data-title="说明：" data-content="决定求购列表是否显示在左侧（饰品图片之后）" data-direction="right"></i></td><td class="t_Right"></td></tr><tr><td class="t_Center" colspan="3"><a href="https://greasyfork.org/zh-CN/scripts/410137-%E7%BD%91%E6%98%93buff%E4%BB%B7%E6%A0%BC%E6%AF%94%E4%BE%8B-%E6%89%BE%E6%8C%82%E5%88%80-%E6%8F%92%E4%BB%B6">本插件完全免费，让你付费购买的都是骗子</a></td></tr><tr><td class="t_Center" colspan="3"><a href="https://jq.qq.com/?_wv=1027&k=U8mqorxQ">反馈QQ群：544144372</a><span><a href="javascript:void(0);" id="helper-setting-resetAll" class="i_Btn i_Btn_small">恢复默认设置</a></span></td></tr></tbody></table></div></div>');
        displayCurrency = getDisplayCurrency();
        // 添加翻页和设置按钮，初始化部分数据
        initHelper();
        // 初始化货币
        initCurrency();
    })

    if (location.pathname === "/market/goods") {
        // 自带css
        GM_addStyle(".market_commodity_orders_header_promote {color: whitesmoke;}#steam_sold{margin-top:5px}#steam_order{margin-top:5px}#steam_order_error{margin-top:5px;font-size: medium;font-weight: bold;color: #ff1e3e;}.market_listing_price_with_fee{color: #ffae3a;font-size: 12px;margin-left: 6px;}");
        GM_addStyle(".steam-link{float:right;margin-top:3px}.detail-cont>.blank20{height:10px}");
        // 组件css
        GM_addStyle(".paymentIcon{padding:1px 13px 0 !important;position:absolute}a.j_shoptip_handler{margin-right:10px}.user-thum{margin: 0;}.icon_payment_alipay{background-position:-417px -331px}.icon_payment_others{background-position:-510px 0}.list_tb_csgo>tr>th:first-child{width:10px}.list_tb_csgo>tr>th:nth-child(2){padding-right:9px}.list_tb_csgo .pic-cont{width:112px;height:84px}.list_tb_csgo .pic-cont img{height:-webkit-fill-available;max-height:max-content;}.csgo_sticker.has_wear{position:absolute;margin-left:230px;}.sticker_parent_div{margin:14px 0 0 360px !important}.csgo_sticker.has_wear .stickers{width:62px;height:48px;margin:0;background: 0;}.stag{margin:0 0 0 2px !important;padding: 4px 6px;float:none !important}.float_rank{color: green;}.stickers:hover{opacity:1!important}");
        GM_addStyle(".tooltip .tooltiptext{visibility:hidden;border: 1px solid #d0d0d0;width:128px;height:96px;background-color:#fbfbfbc7;position:absolute;z-index:60;bottom:100%;margin-left:-62px;border-radius:10px}.tooltip:hover .tooltiptext{visibility:visible}");
        // 求购列表css
        GM_addStyle(".market_commodity_orders_table{margin: 0 0 0 10px;height:100%;float:right;border-collapse:separate;background-color:rgba(0,0,0,0.3);}.market_commodity_orders_table tr:nth-child(even){background-color:#242b33}.market_commodity_orders_table td{text-align:center;padding:4px}.market_commodity_orders_table th{padding:4px;margin:0;text-align:center;font-size:16px;font-weight:normal}");

        $(".detail-pic").css("background-repeat", "round").children().width(250);
        if ($("#j_game-switcher").data("current") == "dota2") {
            $(".detail-cont>p").append($(".detail-summ>a").clone().addClass("steam-link"));
        } else {
            $(".detail-cont>div:first").append($(".detail-summ>a").clone().addClass("steam-link"));
        }
        // 适配 ”饰品比例计算脚本“
        $(".detail-summ>a").hide();
        $(".detail-cont").css("margin-left", 0);

        $(document).ajaxSuccess(function (event, status, header, result) {
            if (/^\/api\/market\/goods\/sell_order/.exec(header.url) && result.data) {
                steamFailedTimes = 0;
                buffHelperModule_inspestEnhancementCsgo(result.data);
                buffHelperGoodsDetailScale(result.data);
            }
        });
    } else if (location.pathname === "/market/") {
        $(document).ajaxSend(function (event, xhr, header, result) {
            if (/^\/api\/market\/goods/.exec(header.url)) {
                header.url += "&page_size=" + helper_config.pageSize;
                $(".helper-progress-bar").remove();
                $(".helper-loading").remove();
                steamFailedTimes = 0;
            }
        });
        // 主要样式
        GM_addStyle(".steam_temp{margin-top: inherit;}#sort_scale{display:inline-block;padding:0 6px 0 16px;cursor:pointer;height:32px;margin-left:5px;line-height:32px;text-align:center;border-radius:4px;min-width:60px;border:1px solid #45536c;color:#63779b;vertical-align:middle}#sort_scale.enabled{background:#45536c;color:#fff}.list_card li h3{margin: 8px 12px 9px;}.list_card li>p>span.l_Left{margin-top:inherit}.list_card li>p>strong.f_Strong{display:block;font-size:20px;min-height:20px;}.price_scale{padding-top:2px}");
        // 进度条样式
        GM_addStyle(".helper-loading{position:absolute;margin:11px}.helper-progress-bar{height:20px;background:linear-gradient(90deg,rgb(22 122 193 / 70%) 0,rgb(51 177 159 / 50%) 70%,transparent);width:0;z-index:1000}");
        // 排序按钮
        $(".block-header>.l_Right").append($('<div class="w-Select-Multi w-Select-scroll buff-helper-sort" style="visibility: visible; width: 140px;"><h3 id="helper-sort-text">比例排序</h3><i class="icon icon_drop"></i><ul style="width: 140px;"><li data-value="null">默认</li><li data-value="buff-sort_asc"><span class="w-Order_asc">buff比例从低到高<i class="icon icon_order"></i></span></li><li data-value="buff-sort_desc"><span class="w-Order_des">buff比例从高到低<i class="icon icon_order"></i></span></li><li data-value="order-sort_asc"><span class="w-Order_asc">求购比例从低到高<i class="icon icon_order"></i></span></li><li data-value="order-sort_desc"><span class="w-Order_des">求购比例从高到低<i class="icon icon_order"></i></span></li></ul></div>'));
        var sortBtnTimeout;
        $(".buff-helper-sort").click(function () {
            $(this).addClass("on");
            clearTimeout(sortBtnTimeout);
        }).mouseleave(function () {
            let t = $(this);
            if (t.hasClass("on")) {
                sortBtnTimeout = setTimeout(() => t.removeClass("on"), 300);
            }
        });
        $(".buff-helper-sort li").click(function (e) {
            e.stopPropagation();
            needSort = this.dataset.value;
            if (this.dataset.value == "null") {
                $("#helper-sort-text").text("比例排序");
                sortGoods("data-default-sort", true);
            } else {
                $("#helper-sort-text").text(this.innerText);
                let arr = this.dataset.value.split("_");
                sortGoods("data-" + arr[0], arr[1] == "asc");
            }
            $(".buff-helper-sort").removeClass("on");
        });
        syncSort();
        setTimeout(() => {
            // 修改buff排序时重置比例排序规则
            $("div[name='sort_by']").change(function () {
                if (helper_config.overrideSortRule && this.getAttribute("value")) {
                    needSort = this.dataset.value;
                    $("#helper-sort-text").text("默认");
                }
            });
        }, 500);
        $(document).ajaxSuccess(function (event, xhr, header, result) {
            if (/^\/api\/market\/goods/.exec(header.url) && result.data.items) {
                buffHelperMarkerListScale(result.data.items);
            }
        });
    }

    // 商品详情
    window.buffHelperGoodsDetailScale = function (data) {
        // 检测商品是否加载完成
        if ($("#market-selling-list").length == 0) {
            setTimeout(buffHelperGoodsDetailScale, 100);
            return;
        }
        $(".detail-cont").append("<i class=\"icon icon_uploading helper-loading\" style='margin: 5px;'></i>");
        goodsDetailLoadData(data);

        function goodsDetailLoadData(data, secendTry) {
            let price_list = $(".f_Strong");
            let isLogined = $("#navbar-cash-amount").length == 1;
            let isFirstTime = $(".good_scale").length == 0;
            let steamLink = $(".steam-link").attr("href");
            let buff_item_id = getUrlParam("goods_id");
            let app_id = data.goods_infos[buff_item_id].appid;
            let hash_name = encodeURIComponent(data.goods_infos[buff_item_id].market_hash_name);
            let items = data.items;
            let steam_price_cny = data.goods_infos[buff_item_id].steam_price_cny;
            let steam_price_without_fee = 0;            // steam卖出实收   
            let error = false;
            let pm = new Promise(function (resolve, reject) {
                if (isFirstTime) {
                    getSteamSoldNumber(app_id, hash_name).then(function onFulfilled(json) {
                        if (!json.volume) { json.volume = 0; }
                        $(".detail-cont").append(`<div id="steam_sold">有 <span class="market_commodity_orders_header_promote">${json.volume}</span> 份在 24 小时内售出</div>`);
                    }).catch(() => { });
                    getSteamOrderList(buff_item_id, steamLink).then(function onFulfilled(json) {
                        steam_highest_buy_order_detail = json.highest_buy_order / 100;
                        steam_lowest_sell_order_detail = json.lowest_sell_order / 100;
                        $(".detail-cont").append("<div id='steam_order'>" + json.buy_order_summary + "</div>");
                        $(".detail-pic").after(json.buy_order_table);
                        if (helper_config.orderFloatLeft) {
                            $(".market_commodity_orders_table").css({
                                "margin": "0 10px 0 0",
                                "float": "left"
                            });
                        }
                    }).catch(function onRejected(err) {
                        switch (err.status) {
                            case 429:
                                steamConnection = true;
                                err.statusText = "请求次数过多";
                                break;
                            case 500:
                                if (!secendTry) {
                                    error = true;
                                    reject();
                                    return;
                                }
                                err.statusText = "内部服务器错误，请稍后重试";
                                break;
                            case 0:
                                failedSteamConnection();
                            case 408:
                                err.statusText = "访问steam超时，请检查steam市场连接性";
                                break;
                        }
                        $(".detail-cont").append("<div id='steam_order_error'>" + err.statusText + "</div>");
                    }).finally(() => {
                        resolve();
                    });
                } else {
                    reject();
                }
            });
            pm.catch(e => { }).finally(function onFulfilled() {
                if (error) {
                    goodsDetailLoadData(data, true);
                    return;
                }
                $(".helper-loading").remove();
                $(".detail-tab-cont th:last").before('<th style="width: 45px;" class="t_Left"><span>比例<i class="icon icon_order"></i></span></th>');
                steam_price_without_fee = getWithoutFeePrice(steam_lowest_sell_order_detail ? steam_lowest_sell_order_detail : steam_price_cny);
                for (let i = 0; i < items.length; i++) {
                    let buff_sell_price = items[i].price;
                    let scale = roundToTwo(buff_sell_price / steam_price_without_fee);
                    if (scale === Infinity) {
                        scale = "∞";
                    }
                    if (!i) {
                        $(".f_Strong .hide-usd")[0].innerText = steam_price_without_fee;
                        let color;
                        switch (true) {
                            case scale > 0.9: color = "#a0ffc5"; break;
                            case scale > 0.8: color = "#b8ff8a"; break;
                            case scale > 0.74: color = "#fff054"; break;
                            case scale > 0.67: color = "#ff7e15"; break;
                            default: color = "#ff0049"; break;
                        }
                        if (isFirstTime) {
                            $(".steam-link").prop("href", $(".steam-link").prop("href") + "?buffPrice=" + buff_sell_price);
                            $(".market_commodity_orders_header_promote:last").after("<small class='market_listing_price_with_fee'>" + getScale(buff_sell_price, steam_highest_buy_order_detail) + "</small>");
                            $(price_list[isLogined ? 1 : 0]).append($("<big class='good_scale' style='color: " + color + ";margin-left: 6px'>" + scale + "</big>"));
                            // 求购表格
                            $(".market_commodity_orders_table th:first").after("<th>比例</th>");
                            let orderList = $(".market_commodity_orders_table tr");
                            for (let i = 1; i < orderList.length; i++) {
                                let td = $(orderList[i]).find("td:first");
                                let priceGroup = convertPrice(td.text());
                                td.after("<td>" + getScale(buff_sell_price, priceGroup[0]) + "</td>");
                            }
                        } else {
                            $(".steam-link").prop("href", $(".steam-link").prop("href").replace(/\d{0,6}[.]?\d{0,2}$/, buff_sell_price));
                            $(".good_scale").text(scale).css("color", color);
                            $(".market_listing_price_with_fee").text(getScale(buff_sell_price, steam_highest_buy_order_detail));
                            // 求购表格
                            let orderList = $(".market_commodity_orders_table tr");
                            for (let i = 1; i < orderList.length; i++) {
                                let td = $(orderList[i]).find("td:first");
                                let priceGroup = convertPrice(td.text());
                                $(orderList[i]).find("td:nth-child(2)").text(getScale(buff_sell_price, priceGroup[0]));
                            }
                        }
                    }
                    $(price_list[i + (isLogined ? 2 : 1)]).parents("td").after('<td class="t_Left"><div style="display: table-cell;"><b class="seller_scale">' + scale + '</b></div></td>');
                }
                daemonThread();
            });
        }
    }

    // 市场目录
    window.buffHelperMarkerListScale = function (items) {
        // 检测商品是否加载完成
        if ($("#j_list_card>ul>li").length == 0) {
            setTimeout(buffHelperMarkerListScale, 100);
            return;
        }
        $(".list_card li>p>span.l_Right").removeClass("l_Right").addClass("l_Left");
        let randomID = Math.round(Math.random() * 1000);
        let goods = $("#j_list_card>ul>li");
        itemNum = items.length;
        // 添加进度条
        $(".tab>li.on").append("<i id=helper-loading-" + randomID + " class=\"icon icon_uploading helper-loading\"></i>");
        $(".market-list .blank20").prepend('<div id=helper-progress-bar-' + randomID + ' class="helper-progress-bar"></div>');
        for (let i = 0; i < goods.length; i++) {
            $(goods[i]).attr("data-default-sort", i);
            marketListLoadData(items[i], goods[i], randomID);
        }

        function marketListLoadData(item, good, randomID, secendTry) {
            let target = $(good).find("p>strong.f_Strong")[0];
            let error = false;
            let buff_item_id = item.id;                                 // buff商品ID
            let buff_buy_num = item.buy_num;                            // buff求购数量
            let buff_buy_max_price = item.buy_max_price;                // buff求购最高价
            let buff_sell_num = item.quick_price;                       // buff出售数量
            let buff_sell_min_price = item.sell_min_price;              // buff出售最低价
            let steam_price_cny = item.goods_info.steam_price_cny;      // buff提供的steam国区售价
            let steam_market_url = item.steam_market_url;               // steam市场链接
            let buff_sell_reference_price = item.sell_reference_price;  // buff出售参考价(没卵用)
            let steam_highest_buy_order = 0;                            // steam最高求购价
            let steam_lowest_sell_order = 0;                            // steam最低出售价
            $(good).attr("data-order-sort", Infinity);
            getSteamOrderList(buff_item_id, steam_market_url).then(function onFulfilled(json) {
                steam_highest_buy_order = json.highest_buy_order / 100;
                steam_lowest_sell_order = json.lowest_sell_order / 100;
                let orderNumber = $(json.buy_order_summary)[0].innerText;
                let steamOrderScale = getScale(buff_sell_min_price, steam_highest_buy_order);
                $(good).attr("data-order-sort", steamOrderScale);
                $(target).after($(steamOrderNumberTemp).text(orderNumber + "┊"));
                // $(target).after($(steamSoldNumberTemp).text(orderNumber + "┊"));
                paintingGradient(steamOrderScale, target, 4, steamOrderScaleTemp);
            }).catch(function onRejected(err) {
                switch (err.status) {
                    case 429:
                        steamConnection = true;
                        err.statusText = "请求次数过多";
                        break;
                    case 500:
                        if (!secendTry) {
                            console.log("正在自动重试状态异常项目");
                            error = true;
                            return;
                        }
                        err.statusText = "内部服务器错误";
                        break;
                    case 0:
                        failedSteamConnection();
                        err.statusText = "无法访问steam";
                        break;
                }
                $(target).after($(steamOrderNumberErrorTemp).text(err.statusText));
            }).finally(() => {
                if (error) {
                    marketListLoadData(item, good, randomID, true);
                    return;
                }
                let lowest_sell_price = steam_lowest_sell_order ? steam_lowest_sell_order : steam_price_cny;
                let withoutFeePrice = getWithoutFeePrice(lowest_sell_price);
                let scale = getScale(buff_sell_min_price, lowest_sell_price);
                $(good).attr("data-buff-sort", scale);
                if (scale === Infinity) {
                    withoutFeePrice = "";
                    scale = "∞";
                }
                let limit = 18;
                try {
                    limit = strLengthLimit[displayCurrency.strCode];
                } catch (error) {
                    alert("报错了");
                    displayCurrency = getDisplayCurrency();
                    limit = strLengthLimit[displayCurrency.strCode];
                }
                let displayPrice = $(target).text().match(/([€₽\$¥]\s)((\d+)(\.\d{1,2})?)/);
                let strLenth = ("" + displayPrice[0] + withoutFeePrice + scale).length;
                let tryMe = 0;
                while (strLenth > limit) {
                    switch (tryMe++) {
                        case 0:     // 0/1
                            withoutFeePrice = Math.round(withoutFeePrice * 10) / 10;
                            break;
                        case 1:     // 0/2
                            withoutFeePrice = Math.round(withoutFeePrice);
                            break;
                        case 2:     // 0/1
                            scale = Math.round(scale * 10) / 10;
                            break;
                        case 3:     // 0/3
                            $(target).text(displayPrice[1] + Math.ceil(displayPrice[2]));
                            displayPrice = $(target).text().match(/([€₽\$¥]\s)((\d+)(\.\d{1,2})?)/);
                            break;
                        case 4:     // 0/2
                            scale = Math.round(scale);
                            break;
                        case 5:     // no one's gonna know
                            $(target).text("0x" + parseInt(displayPrice[3]).toString(16));
                            withoutFeePrice = withoutFeePrice.toString(16);
                            strLenth = 0;
                            continue;
                    }
                    strLenth = ("" + displayPrice[0] + withoutFeePrice + scale).length;
                }
                $(target).append($("<span class=\"f_12px f_Bold c_Gray\"></span>").css("margin-left", "5px").text(withoutFeePrice));
                paintingGradient(scale, target, 3);
                if (needSort && (helper_config.sortAfterAllDone ? itemCount == itemNum - 1 : true)) {
                    let arr = needSort.split("_");
                    sortGoods("data-" + arr[0], arr[1] == "asc");
                }
                updateProgressBar(randomID);
            });
        }
    }

    // 检视增强模组
    window.buffHelperModule_inspestEnhancementCsgo = function (data) {
        // 检测商品是否加载完成
        if ($("#market-selling-list").length == 0) {
            setTimeout(buffHelperModule_inspestEnhancementCsgo, 100);
            return;
        }
        if ($("#market-selling-list").hasClass("buffed")) { return; }
        $("#market-selling-list").addClass("buffed");
        // 支付图标移动到购买按钮下
        let paymentIcon = $(".icon_payment_alipay,.icon_payment_others").parent();
        paymentIcon.addClass("paymentIcon");
        for (let i = 0; i < paymentIcon.length; i++) {
            const element = paymentIcon[i];
            $(element).parent().next().append(element);
        }
        // 不支持支付宝时给个占位图标
        let wechatIcon = $(".icon_payment_others");
        for (let i = 0; i < wechatIcon.length; i++) {
            const element = wechatIcon[i];
            if ($(element).prev().length == 0) {
                $(element).before('<i class="icon icon_payment_alipay" style="opacity:0;margin-right:4px"  title="Support BUFF Balance-Alipay"></i>');
            }
        }
        // 检测是否支持这个类型/游戏的饰品
        let goods_id = getUrlParam("goods_id");
        if (data.goods_infos[goods_id].appid != 730 || data.total_count == 0 || enhancement_support_list.indexOf(data.goods_infos[goods_id].tags.category_group.internal_name) < 0) { return; }
        // 英文页面标志
        let isEn = $("#j_lang-switcher").data("current") === "en";
        // 整体CSS
        $(".list_tb_csgo>tr>th.t_Left")[0].style.width = "550px";
        // 给检视按钮去掉点击属性，防止产生图片无法关闭的bug
        $(".csgo_inspect_img_btn").attr("disabled", true).css({
            "pointer-events": "none"
        });
        // 给饰品图片加入点击属性用于检视
        $(".pic-cont.item-detail-img").click(function () {
            this.children[1].click();
        }).mouseenter(function () {
            $(this).css("background", $(this.children[1]).css("background"));
        }).mouseleave(function () {
            $(this).css("background", "");
        }).css({
            "cursor": "pointer"
        });
        // 拿到每个饰品对应的dom
        let skin_list = $(".list_tb_csgo").find("[id^='sell_order_']");
        for (let i = 0; i < skin_list.length; i++) {
            let mom = skin_list[i];
            // 贴纸移动到图片dom中（保证垂直居中）
            let sticker = $(mom).find(".csgo_sticker");
            $(sticker).addClass("sticker_parent_div");
            $(mom).find("td:nth-child(2)").prepend(sticker);
            getItemDetail(mom);
        }
        // 渐变/淬火等特殊皮肤的tag
        let stags = $(".stag");
        for (let i = 0; i < stags.length; i++) {
            let stag = $(stags[i]);
            stag.prev().append(stag);
        }
        // 贴纸大图
        let stickers = $(".stickers");
        for (let i = 0; i < stickers.length; i++) {
            let element = stickers[i];
            element.innerHTML += "<span class='tooltiptext'>" + element.innerHTML + "</span>";
        }
        $("span.f_12px.c_Gray:contains('%')").css("margin-left", "6px");
        stickers.addClass("tooltip");
        // 贴纸遮盖
        stickers = $(".stickers.masked");
        let min = 0.3;
        for (let i = 0; i < stickers.length; i++) {
            let float = parseInt(stickers[i].nextElementSibling.innerText);
            $(stickers[i]).css("opacity", float * (1 - min) / 100 + min);
        }
        $(".stickers.masked").removeClass("masked");
        // 贴纸顺序
        // $(".sticker-cont").css("float","right");
        // 英文页面3D检视
        if (isEn) {
            $(".ctag.btn_3d").html($(".ctag.btn_3d").html().substr(0, 37));
        }

        function getItemDetail(parent, secondTime) {
            // 拿到每个饰品的图片对象
            let skin = $(parent).find(".item-detail-img")[0];
            // 获取饰品对应的信息并加载进data
            let classid = $(skin).data("classid");
            let instanceid = $(skin).data("instanceid");
            let sell_order_id = $(skin).data("orderid");
            let origin = $(skin).data("origin");
            let assetid = $(skin).data("assetid");
            let data = {
                appid: 730,
                game: "csgo",
                classid: classid,
                instanceid: instanceid,
                sell_order_id: sell_order_id,
                origin: origin,
                assetid: assetid
            };
            // 发送异步请求获取饰品详情
            $.ajax({
                url: "/market/item_detail",
                method: "get",
                timeout: 20000,
                data: data,
                success: function (data) {
                    let result = $(data)[0];
                    // 获取待添加种子的dom对象
                    let origin_float = $(parent).find(".wear-value")[0];
                    try {
                        let seed = "<div class='wear-value'>图案模板(seed):&nbsp;<b style='color:crimson'>" + $(result).find(".skin-info>p:first").text().match(/\d{1,}/)[0] + "</b></div>";
                        $(origin_float).before(seed);
                    } catch (error) {
                        if (secondTime) {
                            console.log("Items do not exist, sec try");
                            $(origin_float).before("<div class='wear-value'><b style='color:crimson'>获取失败，请稍后再试</b></div>");
                            return;
                        } else {
                            console.log("Items do not exist, first try");
                            setTimeout(getItemDetail(parent, true), 500);
                        }
                    }
                    // 获取名称标签对象
                    let name = $(result).find("p.name_tag")[0];
                    if (name) {
                        // 设定名称标签的样式
                        $(name).css({
                            "background": "transparent",
                            "padding": "0"
                        });
                        // 获取待添加名称标签的对象并添加名称标签
                        let targ_name = $(parent).find(".csgo_value")[0];
                        $(targ_name).before(name);
                    }
                    // 截取皮肤磨损并加粗
                    origin_float.innerHTML = "磨损: <b>" + origin_float.innerText.match(/0[.]\d*/)[0] + "</b>";
                    // 获取排名对象
                    let rank = $(result).find(".skin-info>.des")[0];
                    if (rank) {
                        // 位置在种子后面
                        $(parent).find(".csgo_value>.wear-value:first").append("<span style='margin-left:10px'>磨损排名:&nbsp;<b class='float_rank'>" + rank.innerText.match(/\d{1,}/)[0] + "</b></span>");
                        // 位置在磨损后面
                        // $(origin_float).html(origin_float.innerHTML + "<i class='float_rank'>「#<b>" + rank.innerText.match(/\d{1,}/)[0] + "</b>」</i>");
                    }
                },
                error: function (msg) {
                    if (msg.status == 429) {
                        msg.statusText = "请求太频繁";
                    }
                    console.log("error:", msg);
                    let origin_float = $(parent).find(".wear-value")[0];
                    $(origin_float).before("<div class='wear-value'><b style='color:crimson'>" + msg.statusText + "</b></div>");
                }
            });
        }

    };

    function initHelper() {
        if ($(".floatbar>ul").length == 0) {
            setTimeout(() => { initHelper(); }, 100);
            return;
        }
        if ($("#buff_tool_nextpage").length != 0) { return; }
        if (!GM_getValue("helper_alert_first")) {
            $("body").append('<div id="j_w-Toast" class="w-Toast_warning" style="display: block; margin-left: -195px; margin-top: -35px;"><p><i class="icon icon_warning_mid"></i>你应该是第一次安装“网易BUFF价格比例(找挂刀)插件” 本插件完全免费，让你付费购买的都是骗子。请熟知。</p> <div> <a href="javascript:void(0)" class="agreementsBtn i_Btn i_Btn_mid i_Btn_D_red" style="margin-top: 15px;">我已知晓<span class="agreementsCountDown" style="margin-left:10px">5</span></a></div></div>');
            let count = 5;
            let countDown = setInterval(function () {
                if (--count == 0) {
                    clearInterval(countDown);
                    $(".agreementsCountDown").remove();
                } else {
                    $(".agreementsCountDown").text(count);
                }
            }, 1000);
            $(".agreementsBtn").click(function () {
                if (!count) {
                    GM_setValue("helper_alert_first", true);
                    $("#j_w-Toast").hide("normal", () => {
                        $("#j_w-Toast").remove();
                    });
                } else {
                    alert("认真看一会，还有" + count + "秒就可以点了");
                }
            });
        }
        // 设置按钮
        $(".floatbar>ul").prepend("<li><a id='buff_tool_setting'><i class='icon icon_menu_setting'></i><p>设置</p></a></li>");
        $("#buff_tool_setting").click(function () {
            openSettingPanel();
        }).parent().css("cursor", "pointer");
        // 下一页按钮
        $(".floatbar>ul").prepend("<li><a id='buff_tool_nextpage'><i class='icon icon_slide_right2' style='height: 40px;width: 39px;'></i><p>下一页</p></a></li>");
        $("#buff_tool_nextpage").click(function () {
            $(".page-link.next").click();
            $("#sort_scale").removeClass();
        }).parent().css("cursor", "pointer");
        // 初始化设置页面
        $("#helper-version").text($("#helper-version").text() + GM_info.script.version);
        $("#helper-setting-checkBtn").click(() => { checkSteamConnection() });
        $("#helper-setting-resetAll").click(() => { resetConfig(); });
        $(".helper-setting-shadow").click(function (e) {
            if (e.target == this) {
                $(this).fadeOut();
            }
        });
        // 添加设置页面操作
        $(".helper-setting").change(function (e) {
            let target = e.target;
            let optionTarget = target.dataset.optionTarget;
            let val = target.getAttribute("value") ? target.getAttribute("value") : target.value;
            // console.log(optionTarget, val);
            helper_config[optionTarget] = val;
            GM_setValue("helper_config", helper_config);
            if (optionTarget == "currencyDisplayMode") {
                initCurrency();
            }
            init();
        });
        // 注册管理工具菜单
        GM_registerMenuCommand('打开设置面板', () => {
            openSettingPanel();
        });
        // 初始化设置页面后填装面板
        init();
    }

    function openSettingPanel() {
        updateSteamStatus();
        $(".helper-setting-shadow").css({
            "opacity": 0,
            "display": "flex"
        }).animate({ opacity: '1' }, 300);
    }

    function loadConfig() {
        let config = GM_getValue("helper_config");
        if (config) {
            return config;
        }
        return clone(defaultConfig);
    }

    function resetConfig() {
        GM_setValue("helper_config", null);
        helper_config = clone(defaultConfig);
        initCurrency();
        init();
    }

    function getDisplayCurrency() {
        let currencyList = { "¥-¥": "CNY", "$-$": "USD", "€-€": "EUR", "₽-₽": "RUB" };
        let text = $(".w-Counter-input").text();
        for (let key in currencyList) {
            if (text.search(key) == 1) {
                return g_rgCurrencyData[currencyList[key]];
            }
        }
    }

    function initCurrency() {
        let list = $(".steam-currency-selector>li");
        if (list.length == 0) {
            for (let key in g_rgCurrencyData) {
                $(".steam-currency-selector").append("<li value=" + g_rgCurrencyData[key].strCode + ">" + g_rgCurrencyData[key][helper_config.currencyDisplayMode] + "</li>");
            }
            syncCurrency();
        } else {
            for (let li of list) {
                let jq = $(li);
                jq.text(g_rgCurrencyData[jq.attr("value")][helper_config.currencyDisplayMode]);
            }
        }
    }

    function init() {
        $(".helper-setting>.list_tb .on").removeClass("on");
        if (helper_config.overrideSortRule) {
            $("#helper-setting-stickerSort").attr("value", helper_config.overrideSortRule).children(":first").addClass("on");
        }
        if (helper_config.sortAfterAllDone) {
            $("#helper-setting-sortAfterAllDone").attr("value", helper_config.sortAfterAllDone).children(":first").addClass("on");
        }
        if (helper_config.orderFloatLeft) {
            $("#helper-setting-orderFloatLeft").attr("value", helper_config.orderFloatLeft).children(":first").addClass("on");
            $(".market_commodity_orders_table").css({
                "margin": "0 10px 0 0",
                "float": "left"
            });
        } else {
            $(".market_commodity_orders_table").css({
                "margin": "0 0 0 10px",
                "float": "right"
            });
        }
        if (helper_config.needSort) {
            syncSort();
        }
        $("#helper-setting-pageSize").val(helper_config.pageSize);
        $("#helper-setting-maxRange").val(helper_config.maxRange);
        $("#helper-setting-minRange").val(helper_config.minRange);
        $("#helper-setting-marketColorLow").val(helper_config.marketColorLow);
        $("#helper-setting-marketColorHigh").val(helper_config.marketColorHigh);
        updateSteamStatus();
        try {
            syncCurrency();
        } catch (error) {
            if (helper_config.steamCurrency.constructor === Object) {
                helper_config.steamCurrency = helper_config.steamCurrency.strCode;
                GM_setValue("helper_config", helper_config);
                syncCurrency();
            }
        }
        parseColor();
    }

    function syncSort() {
        needSort = helper_config.needSort;
        $("#helper-setting-sortRule>h3").text($("#helper-setting-sortRule li[value=" + helper_config.needSort + "]").addClass("on").text());
        $("#helper-sort-text").text($(".buff-helper-sort li[data-value=" + helper_config.needSort + "]").click().text());
    }

    function updateSteamStatus() {
        if (steamConnection === undefined) {
        } else if (steamConnection) {
            if (!$(".helper-setting-steamConnection>.c_Green").text()) {
                $(".helper-setting-steamConnection").html("<span class=\"c_Green\"><i class=\"icon icon_status_success\"></i>正常</span>");
            }
        } else {
            $(".helper-setting-steamConnection").html("<span class=\"c_DRed\"><i class=\"icon icon_status_failed\"></i>无法连接</span>");
        }
    }

    function syncCurrency() {
        steamCurrency = g_rgCurrencyData[helper_config.steamCurrency];
        $("#helper-setting-currencyDisplayMode").attr("value", helper_config.currencyDisplayMode);
        $("#helper-setting-currencyDisplayMode>h3").text($("#helper-setting-currencyDisplayMode li[value=" + helper_config.currencyDisplayMode + "]").addClass("on").text());
        $("#helper-setting-currency").attr("value", steamCurrency.strCode);
        $("#helper-setting-currency>h3").text($("#helper-setting-currency li[value=" + steamCurrency.strCode + "]").addClass("on").text());
    }

    function parseColor() {
        market_color_high = helper_config.marketColorHigh.match(/[0-9a-f]{2}/ig);
        market_color_low = helper_config.marketColorLow.match(/[0-9a-f]{2}/ig);
        for (let i = 2; i >= 0; i--) {
            market_color_high[i] = parseInt(market_color_high[i], 16);
            market_color_low[i] = parseInt(market_color_low[i], 16);
        }
    }

    function sortGoods(sortRule, isAsc) {
        $("#j_list_card>ul>li").sort(function (a, b) {
            let av = $(a).attr(sortRule) - 0;
            let bv = $(b).attr(sortRule) - 0;
            let result = 0;
            if (isAsc) {
                result = av - bv;
            } else {
                result = bv - av;
            }
            return result === NaN ? 0 : result;
        }).appendTo("#j_list_card>ul");
    }

    function checkSteamConnection() {
        let interval = 0;
        $(".helper-setting-steamConnection").html("<span class=\"c_Blue\"><i class=\"icon icon_status_progressing\"></i>检测中</span>");
        $("#helper-setting-checkBtn").css("visibility", "hidden");
        let startTime = new Date().getTime();
        let endTime = 0;
        steamConnection = undefined;
        GM_xmlhttpRequest({
            url: "https://steamcommunity.com/market/",
            timeout: 20000,
            method: "get",
            onloadstart: function (event) {
                countdown(19);
            },
            onload: function (res) {
                if (res && res.status == 200) {
                    endTime = new Date().getTime();
                    changeSteamStatus(true);
                } else {
                    console.log("检测steam连接性出错：状态错误", res);
                    changeSteamStatus(false);
                }
            },
            onerror: function (err) {
                console.log("检测steam连接性出错：连接错误", err);
                changeSteamStatus(false);
            },
            ontimeout: function () {
                console.log("检测steam连接性出错：尝试超时");
                changeSteamStatus(false);
            }
        });

        function changeSteamStatus(status) {
            clearInterval(interval);
            $(".steamConnectionCountdown").hide();
            steamConnection = status;
            if (status) {
                $(".helper-setting-steamConnection").html("<span class=\"c_Green\"><i class=\"icon icon_status_success\"></i>正常</span><span class=\"c_DGray f_12px\">" + (endTime - startTime) + "ms</span>");
            } else {
                $(".helper-setting-steamConnection").html("<span class=\"c_DRed\"><i class=\"icon icon_status_failed\"></i>无法连接</span>");
            }
            $("#helper-setting-checkBtn").css("visibility", "visible");
        }

        function countdown(count) {
            $(".steamConnectionCountdown").text("20s").show();
            interval = setInterval(() => {
                $(".steamConnectionCountdown").text(count-- + "s");
            }, 1000);
        }
    }

    function failedSteamConnection() {
        if (++steamFailedTimes > (itemNum >> 2)) {
            steamConnection = false;
        }
    }

    function updateProgressBar(ID) {
        let bar = $("#helper-progress-bar-" + ID);
        bar.width(++itemCount / itemNum * 100 + "%")
        if (itemCount >= itemNum) {
            itemCount = 0;
            $("#helper-loading-" + ID).remove();
            bar.fadeOut(500);
        }
    }

    function paintingGradient(scale, target, position, template = '<strong class="f_16px f_Strong price_scale l_Right"></strong>') {
        let red = gradient(market_color_high[0], market_color_low[0], scale);
        let green = gradient(market_color_high[1], market_color_low[1], scale);
        let blue = gradient(market_color_high[2], market_color_low[2], scale);
        switch (position) {
            case 1:
                $(target).before($(template).css("color", "rgb(" + red + "," + green + "," + blue + ")").text(scale));
                break;
            case 2:
                $(target).prepend($(template).css("color", "rgb(" + red + "," + green + "," + blue + ")").text(scale));
                break;
            case 3:
                $(target).append($(template).css("color", "rgb(" + red + "," + green + "," + blue + ")").text(scale));
                break;
            case 4:
                $(target).after($(template).css("color", "rgb(" + red + "," + green + "," + blue + ")").text(scale));
                break;
            default:
                $(target).append($(template).css("color", "rgb(" + red + "," + green + "," + blue + ")").text(scale));
        }
    }

    function daemonThread() {
        let count = 30
        let daemonThreadInterval = setInterval(() => {
            if (count--) {
                if ($(".afkout").length || $("#infolist").length) {
                    $("#steam_order").remove();
                    $(".detail-summ>a").show();
                    $(".steam-link").hide();
                    clearInterval(daemonThreadInterval);
                }
            } else {
                clearInterval(daemonThreadInterval);
            }
        }, 100);
    }

    // 保留2位小数
    function roundToTwo(num) {
        return Math.round(num * 100) / 100;
    }

    function getWithoutFeePrice(originPrice) {
        return roundToTwo(originPrice / 1.15);
    }

    function getScale(originPrice, withFeePrice) {
        return roundToTwo(originPrice / (withFeePrice / 1.15));
    }

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // 小数： "167639.87", "167639", ".87", "87"
    // 整数： "186267",    "186267"
    function convertPrice(str) {
        str = str.replace(steamCurrency.strThousandsSeparator, "");
        if (steamCurrency.strDecimalSymbol !== ".") {
            str = str.replace(steamCurrency.strDecimalSymbol, ".");
        }
        return str.match(/(\d+)(\.(\d{1,2}))?/);
    }

    function gradient(max, min, f) {
        if (f == "∞") { return max; }
        if (f >= helper_config.maxRange || f <= helper_config.minRange) {
            f = f >= helper_config.maxRange ? 1 : 0;
        } else {
            f = (f - helper_config.minRange) / (helper_config.maxRange - helper_config.minRange);
        }
        return max >= min ? f * (max - min) + min : (1 - f) * (min - max) + max;
    }

    function getUrlParam(name, url) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        let result;
        if (url) {
            result = url.substr(34).match(reg);  //匹配目标参数
        } else {
            result = window.location.search.substr(1).match(reg);  //匹配目标参数
        }
        if (result != null) return unescape(result[2]); return null; //返回参数值
    }

    function getItemId(buff_item_id, steamLink) {
        return new Promise(function (resolve, reject) {
            let steam_item_id = GM_getValue(buff_item_id);
            if (steam_item_id) {
                resolve(steam_item_id);
                return;
            } else if (steam_item_id === null) {
                reject({ status: 404, statusText: "物品不在货架上" });
            }
            GM_xmlhttpRequest({
                url: steamLink,
                timeout: 20000,
                method: "get",
                onload: function (res) {
                    if (res.status == 200) {
                        let html = res.responseText;
                        try {
                            steam_item_id = /Market_LoadOrderSpread\(\s?(\d+)\s?\)/.exec(html)[1];
                        } catch (error) {
                            steamConnection = true;
                            GM_setValue(buff_item_id, null);
                            res.status = 404;
                            res.statusText = "物品不在货架上";
                            console.log("获取itemID状态异常：", res);
                            reject(res);
                            return;
                        }
                        GM_setValue(buff_item_id, steam_item_id);
                        resolve(steam_item_id);
                    } else {
                        console.log("获取itemID状态异常：", res);
                        reject(res);
                    }
                },
                onerror: function (err) {
                    console.log("获取itemID错误：", err);
                    reject(err);
                },
                ontimeout: function () {
                    failedSteamConnection();
                    let err = { "status": 408, "statusText": "连接steam超时" };
                    console.log("获取itemID超时：", err);
                    reject(err);
                }
            });
        });
    }

    function getSteamOrderList(buff_item_id, steamLink) {
        return new Promise(function (resolve, reject) {
            if (!steamConnection && steamConnection != undefined) {
                let err = { "status": 408, "statusText": "无法访问steam" };
                reject(err);
                return;
            }
            getItemId(buff_item_id, steamLink).then(function onFulfilled(steam_item_id) {
                GM_xmlhttpRequest({
                    url: `https://steamcommunity.com/market/itemordershistogram?country=CN&language=schinese&currency=${steamCurrency.eCurrencyCode}&item_nameid=${steam_item_id}&two_factor=0`,
                    timeout: 20000,
                    method: "get",
                    onload: function (res) {
                        if (res.status == 200) {
                            steamConnection = true;
                            resolve(JSON.parse(res.responseText));
                        } else {
                            console.log("访问steamorder状态异常：", res);
                            reject(res);
                        }
                    },
                    onerror: function (err) {
                        console.log("访问steamorder列表出错：", err);
                        reject(err);
                    },
                    ontimeout: function () {
                        failedSteamConnection();
                        let err = { "status": 408, "statusText": "连接steam超时" };
                        console.log("访问steamorder列表超时：", err);
                        reject(err);
                    }
                });
            }).catch(function onRejected(err) {
                reject(err);
            });
        });
    }

    function getSteamSoldNumber(app_id, hash_name) {
        return new Promise(function (resolve, reject) {
            if (!steamConnection && steamConnection != undefined) {
                let err = { "status": 408, "statusText": "无法访问steam" };
                reject(err);
                return;
            }
            GM_xmlhttpRequest({
                url: `https://steamcommunity.com/market/priceoverview/?appid=${app_id}&currency=${steamCurrency.eCurrencyCode}&market_hash_name=${hash_name}`,
                timeout: 20000,
                method: "get",
                onload: function (res) {
                    if (res.status == 200) {
                        steamConnection = true;
                        let json = JSON.parse(res.responseText);
                        if (json.success) {
                            resolve(json);
                        }
                    } else {
                        console.log("访问steam销售数量状态异常：", res);
                        reject(res);
                    }
                },
                onerror: function (err) {
                    console.log("访问steam销售数量出错：", err);
                    reject(err);
                },
                ontimeout: function () {
                    failedSteamConnection();
                    let err = { "status": 408, "statusText": "连接steam超时" };
                    console.log("访问steam销售数量超时：", err);
                    reject(err);
                }
            });
        });
    }

})();