// ==UserScript==
// @name         网易BUFF价格比例(找挂刀)插件
// @namespace    http://pronax.wtf/
// @version      2021-3-10 14:06:18
// @description  你的挂刀得力助手，有问题反馈可以直接发邮件给我（funkyturkey@yeah.net）在greasy上发issue也可以，不过可能响应比较慢
// @copyright    2020, Pronax
// @author       Pronax
// @license      MIT
// @match        https://buff.163.com/market/goods*
// @match        https://buff.163.com/market/?game=csgo*
// @match        https://buff.163.com/market/?game=dota2*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    'use strict';



    // 	-----自定义参数--------start---------------------

    const min_range = 0.63;                     // 比例取值最小范围，小于等于这个值的比例会直接渲染成最小值渐变色
    const needSort = 1;                         // 是否自动按比例排序      需要：1    不需要：0
    const sortType = 1;                         // 排序规则    从低到高（升序）：1    从高到低（降序）：0

    // 市场页面的渐变色
    var market_color_high = "80,39,255";        // 最大值渐变色，比例越接近最大值（默认是1）会越趋近这个颜色，格式：['r','g','b'] 或者 "r,g,b"
    var market_color_low = "255,30,30";         // 最小值渐变色，比例越接近最小值（默认是0.63）会越趋近这个颜色，格式：['r','g','b'] 或者 "r,g,b"

    // 	-----自定义参数--------end-----------------------



    // 处理成数组
    if (!Array.isArray(market_color_high)) market_color_high = market_color_high.split(",");
    if (!Array.isArray(market_color_low)) market_color_low = market_color_low.split(",");

    const alertColor = Array(0, 255, 72);
    const backgroundColor = Array(69, 83, 108);
    const steanOrderScaleTemp = "<span class=\"f_12px f_Bold l_Right\" style=\"margin-top: inherit;opacity: 0.8;\"></span>";
    const steanOrderCountTemp = "<span class=\"f_12px c_Gray f_Bold l_Right\" style=\"margin-top: inherit;opacity: 0.8;\"></span>";

    function getUrlParam(name, url) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var result
        if (url) {
            result = url.substr(34).match(reg);  //匹配目标参数
        } else {
            result = window.location.search.substr(1).match(reg);  //匹配目标参数
        }
        if (result != null) return unescape(result[2]); return null; //返回参数值
    }

    function sortGoods(isAsc) {
        $("#j_list_card>ul>li").sort(function (a, b) {
            let av = $(a).attr("data-sort") - 0;
            let bv = $(b).attr("data-sort") - 0;
            if (av > bv) {
                return isAsc ? 1 : -1;
            } else if (av < bv) {
                return isAsc ? -1 : 1;
            }
            return 0;
        }).appendTo("#j_list_card>ul");
    }

    // 保留2位小数
    function roundToTwo(num, upOrDown) { // upOrDown为true时四舍五入
        return upOrDown ? Math.round((num * 100) + 0.5) / 100 : Math.round((num * 100)) / 100;
    }

    function getWithoutFeePrice(originPrice, upOrDown) {
        return roundToTwo(originPrice / 1.15, upOrDown);
    }

    function getScale(originPrice, withFeePrice, upOrDown) {
        return roundToTwo(originPrice / (withFeePrice / 1.15), upOrDown);
    }

    function shade(obj, prop, color1, color2, mills) {
        let count = mills / 20;
        let red = color1[0], green = color1[1], blue = color1[2];
        let r = (color2[0] - color1[0]) / count, g = (color2[1] - color1[1]) / count, b = (color2[2] - color1[2]) / count;
        for (let i = 1; i <= count; i++) {
            setTimeout(() => {
                obj.css(prop, "rgb(" + parseInt(red + r * i + 0.5) + "," + parseInt(green + g * i + 0.5) + "," + parseInt(blue + b * i + 0.5) + ")");
            }, i * 40);
        }
        setTimeout(() => {
            obj.css(prop, "");
        }, 3000);
    }

    function gradient(max, min, f) {
        if (typeof max === "string") {
            max *= 1;
        }
        if (typeof min === "string") {
            min *= 1;
        }
        if (f >= 1 || f <= min_range) {
            f = f >= 1 ? 1 : 0;
        } else {
            f = (f - min_range) / (1 - min_range);
        }
        return max >= min ? f * (max - min) + min : (1 - f) * (min - max) + max;
    }

    function paintingGradient(scale, target, position, targetTemplate) {
        var template;
        if (targetTemplate) {
            template = targetTemplate;
        } else {
            template = '<strong class="f_Strong price_scale" style="float: right;"></strong>';
        }
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

    function getItemId(steamLink, url) {
        return new Promise(function (resolve, reject) {
            let buff_item_id = getUrlParam("goods_id", url);
            let steam_item_id = GM_getValue(buff_item_id);
            if ((!steam_item_id) || steam_item_id.length > 20 || steam_item_id == buff_item_id) {
                GM_xmlhttpRequest({
                    url: steamLink,
                    method: "get",
                    onload: function (res) {
                        if (res.status == 200) {
                            let html = res.response;
                            let start = html.indexOf("Market_LoadOrderSpread( ") + 24;
                            let end = html.indexOf(" );	// initial load");
                            if (start == 24 || end == -1) {
                                reject({ status: 404, statusText: "物品不在货架上" });
                            }
                            steam_item_id = html.slice(start, end);
                            GM_setValue(buff_item_id, steam_item_id);
                            resolve(steam_item_id);
                        } else {
                            reject(res);
                        }
                    },
                    onerror: function (err) {
                        reject(err);
                    }
                });
            } else {
                resolve(steam_item_id);
            }
        });
    }

    function getSteamOrderList(steamLink, url) {
        return new Promise(function (resolve, reject) {
            getItemId(steamLink, url).then(function onFulfilled(itemId) {
                GM_xmlhttpRequest({
                    url: window.location.protocol + "//steamcommunity.com/market/itemordershistogram?country=CN&language=schinese&currency=23&item_nameid=" + itemId + "&two_factor=0",
                    method: "get",
                    onload: function (res) {
                        if (res.status == 200) {
                            resolve(JSON.parse(res.response));
                        } else {
                            console.log("访问steamorder列表出错：", res);
                            reject(res);
                        }
                    },
                    onerror: function (err) {
                        console.log("访问steamorder列表出错：", err);
                        reject(err);
                    }
                });
            }).catch(function onRejected(err) {
                console.log('获取itemID错误：', err);
                reject(err);
            });
        });
    }

    // 商品详情
    window.buff_csgo_goods_scale_plugin_load = function (steam_price) {
        // 检测商品是否加载完成
        if ($("#market-selling-list").length == 0) {
            setTimeout(buff_csgo_goods_scale_plugin_load, 100);
            return;
        }
        if ($("#market-selling-list").hasClass("calculated")) { return; }
        let price_list = $(".f_Strong");
        let isLogined = price_list[0].getAttribute("id") == "navbar-cash-amount";
        if (!steam_price) {
            steam_price = parseFloat($(price_list[isLogined ? 1 : 0]).text().split("(")[0].slice(1));
        }
        let basic_price = getWithoutFeePrice(steam_price, true);
        for (let i = isLogined ? 2 : 1; i < price_list.length; i++) {
            let seller_price = price_list[i].innerText.slice(2);
            let scale = roundToTwo(seller_price / basic_price);
            if (i == (isLogined ? 2 : 1)) {
                $(".detail-summ>a").prop("href", $(".detail-summ>a").prop("href") + "?buffPrice=" + seller_price);
                $(".f_Strong .hide-usd")[0].innerText = basic_price;
                let color;
                switch (true) {
                    case scale > 0.9: color = "#a0ffc5"; break;
                    case scale > 0.8: color = "#b8ff8a"; break;
                    case scale > 0.74: color = "#fff054"; break;
                    case scale > 0.67: color = "#ff7e15"; break;
                    default: color = "#ff0049"; break;
                }
                if ($(".good_scale").length == 0) {
                    $(price_list[isLogined ? 1 : 0]).append($("<big class='good_scale' style='color: " + color + ";margin-left: 6px'>" + scale + "</big>"));
                    let steamLink = document.getElementsByClassName("detail-summ")[0].lastElementChild.href;
                    getSteamOrderList(steamLink).then(function onFulfilled(json) {
                        $(".detail-cont").append("<div id='steam_order'>" + json.buy_order_summary + "</div>");
                        window.market_listing_price_with_fee = json.highest_buy_order / 100;
                        $(".market_commodity_orders_header_promote:last").after("<small class='market_listing_price_with_fee'>" + getScale(seller_price, window.market_listing_price_with_fee, true) + "</small>");
                    }).catch(function onRejected(err) {
                        $(".detail-cont").append("<div id='steam_order'>" + err.statusText + "</div>");
                    });
                } else {
                    $(".good_scale").text(scale).css("color", color);
                    $(".market_listing_price_with_fee").text(getScale(seller_price, window.market_listing_price_with_fee, true));
                }
            }
            $(price_list[i].parentNode).next().append($("<b>" + scale + "</b>"));
        }
        $("#market-selling-list").addClass("calculated");
    }

    // 市场目录
    window.buff_csgo_list_scale_plugin_load = function () {
        // 检测商品是否加载完成
        if ($("#j_list_card>ul>li").length == 0) {
            setTimeout(buff_csgo_list_scale_plugin_load, 100);
            return;
        }
        if ($("#j_list_card").hasClass("calculated")) { return; }
        $(".list_card li>p>span.l_Right").removeClass("l_Right").addClass("l_Left");
        var goods = $("#j_list_card>ul>li");
        var status = goods.length;
        for (let i = 0; i < goods.length; i++) {
            let target = $(goods[i]).find("p>strong.f_Strong")[0];
            let buff_price = target.innerText.slice(2);
            let url = $(goods[i]).children("a")[0].href;
            //	buff的ajax
            $.ajax({
                url: url,
                method: "get",
                success: function (data) {
                    status--;
                    let steam_price = $(data).find(".detail-summ .f_Strong>span.custom-currency")[0].getAttribute('data-price');
                    let withoutFeePrice = getWithoutFeePrice(steam_price, true);
                    let scale = getScale(buff_price, steam_price, true);
                    $(goods[i]).attr("data-sort", scale);
                    $(target).append($("<span class=\"f_12px f_Bold c_Gray\"></span>").css("margin-left", "5px").text(withoutFeePrice));
                    paintingGradient(scale, target, 3);
                    let steam_link = $(data).find(".detail-summ>a")[0].href;
                    getSteamOrderList(steam_link, url).then(function onFulfilled(json) {
                        let orderCount = $(json.buy_order_summary)[0].innerText;
                        let steamOrderScale = getScale(buff_price, (json.highest_buy_order / 100), true);
                        $(target).after($(steanOrderCountTemp).text(orderCount + "┊"));
                        paintingGradient(steamOrderScale, target, 4, steanOrderScaleTemp);
                    }).catch(function onRejected(err) {
                        if (err.status == 429) {
                            err.statusText = "请求次数过多";
                        }
                        $(target).after($(steanOrderCountTemp).text(err.statusText));
                    });
                    if (status == 0) {
                        if (needSort) {
                            sortGoods(sortType);
                        }
                        $("#sort_scale").addClass("enabled").addClass(sortType ? "w-Order_asc" : "w-Order_des");
                        shade($("#sort_scale"), "background", alertColor, backgroundColor, 1000);
                    }
                },
                error: function (msg) {
                    console.log(msg);
                }
            });
        }
        $("#j_list_card").addClass("calculated");
    }


    if (location.pathname === "/market/goods") {
        buff_csgo_goods_scale_plugin_load();
        GM_addStyle(".market_commodity_orders_header_promote {color: whitesmoke;}#steam_order{margin-top:5px}.market_listing_price_with_fee{color: #9c6c0d;font-size: 12px;margin-left: 6px;}");
        setTimeout(function () {
            $(document).ajaxSuccess(function (event, status, header, result) {
                if (header.url.slice(0, 28) === "/api/market/goods/sell_order") {
                    let steam_price_cny = result.data.goods_infos[getUrlParam("goods_id")].steam_price_cny;
                    buff_csgo_goods_scale_plugin_load(steam_price_cny);
                }
            });
        }, 1000);
    } else if (location.pathname === "/market/") {
        // 样式
        GM_addStyle("#sort_scale{display:inline-block;padding:0 6px 0 16px;cursor:pointer;height:32px;margin-left:5px;line-height:32px;text-align:center;border-radius:4px;min-width:60px;border:1px solid #45536c;color:#63779b;vertical-align:middle}#sort_scale.enabled{background:#45536c;color:#fff}.list_card li h3{margin: 8px 12px 9px;}.list_card li>p>span.l_Left{margin-top:inherit}.list_card li>p>strong.f_Strong{display:block;font-size:20px;min-height:20px;}");
        // 下一页按钮
        $(".floatbar>ul").prepend("<li><a id='buff_tool_nextpage'><i class='icon icon_comment_arr' style='transform: rotate(90deg); width: 1.125rem; height: 1.125rem; left: 0.25rem; position: relative;'></i><p style='color:#fff;'>下一页</p></a></li>");
        $("#buff_tool_nextpage").click(function () {
            $(".page-link.next").click();
            $("#sort_scale").removeClass();
        }).parent().css("cursor", "pointer");
        // 排序按钮
        $(".block-header>.l_Right").append($('<div id="sort_scale"><span>比例<i class="icon icon_order"></i></span></div>'));
        $("#sort_scale").click(function () {
            let flag = $(this).hasClass("w-Order_asc");
            if ($(this).hasClass("enabled")) {
                $(this).toggleClass("w-Order_asc w-Order_des");
            } else {
                $(this).addClass("enabled").addClass("w-Order_asc");
            }
            $("#j_list_card>ul>li").sort(function (a, b) {
                let av = $(a).attr("data-sort") - 0;
                let bv = $(b).attr("data-sort") - 0;
                if (av > bv) {
                    return flag ? -1 : 1;
                } else if (av < bv) {
                    return flag ? 1 : -1;
                }
                return 0;
            }).appendTo("#j_list_card>ul");
        });
        buff_csgo_list_scale_plugin_load();
        setTimeout(function () {
            $(document).ajaxSuccess(function (event, status, header, result) {
                if (header.url.slice(0, 17) === "/api/market/goods") {
                    $("#sort_scale").removeClass();
                    buff_csgo_list_scale_plugin_load();
                }
            });
        }, 1000);
    }

})();