// ==UserScript==
// @name         网易BUFF饰品市场小帮手
// @namespace    http://pronax.wtf/
// @version      1.8.1
// @description  找挂刀？批量购买？找玄学？不如先整个小帮手帮你，问题反馈邮箱funkyturkey@yeah.net
// @description  更新于2021年3月14日18:51:42
// @copyright    2020, Pronax
// @author       Pronax
// @license      AGPL-3.0
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

    // 	-------------------------------------------------------自定义参数--------start--------------------------------------
    // 比例取值最小范围，小于等于这个值的比例会直接渲染成最小值渐变色
    const min_range = 0.63;

    // 市场页面的渐变色
    // 最大值渐变色，比例越接近最大值（默认是1）会越趋近这个颜色，格式：['r','g','b'] 或者 "r,g,b"
    var market_color_high = "80,39,255";
    // 最小值渐变色，比例越接近最小值（默认是0.63）会越趋近这个颜色，格式：['r','g','b'] 或者 "r,g,b"
    var market_color_low = "255,30,30";

    // 排序规则会记住上一次的选择，你只需要将对应的英文字母替换到等号后面分号前面就可以改成固定规则:
    // 按buff比例从低到高   按buff比例从高到低      按求购比例从低到高   按求购比例从高到低
    //  buff-sort.asc     buff-sort.desc        order-sort.asc   order-sort.desc
    // 示例: var needSort = buff-sort.asc;
    var needSort = GM_getValue("sortRule");
    // 	-------------------------------------------------------自定义参数--------end---------------------------------------

    // 处理成数组
    if (!Array.isArray(market_color_high)) market_color_high = market_color_high.split(",");
    if (!Array.isArray(market_color_low)) market_color_low = market_color_low.split(",");

    const steanOrderScaleTemp = "<span class=\"f_12px f_Bold l_Right\" style=\"margin-top: inherit;\"></span>";
    const steanOrderCountTemp = "<span class=\"f_12px c_Gray f_Bold l_Right\" style=\"margin-top: inherit;\"></span>";

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

    function sortGoods(sortRule, isAsc) {
        $("#j_list_card>ul>li").sort(function (a, b) {
            let av = $(a).attr(sortRule) - 0;
            let bv = $(b).attr(sortRule) - 0;
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

    function updateProgressBar(bar, progress, option) {
        let widthP = Math.round(bar.width() / document.body.clientWidth * 100);
        switch (option) {
            case "set":
                bar.width(progress + "%");
                break;
            default:
            case "add":
                widthP += progress;
                bar.width(widthP + "%");
                break;
            case "sub":
                widthP -= progress;
                bar.width(widthP < 0 ? 0 : widthP + "%");
                break;
        }
        if (widthP >= 120) {
            bar.fadeOut(500);
        }
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
        var barID = "helper-progress-bar-" + Math.round(Math.random() * 1000);
        var goods = $("#j_list_card>ul>li");
        var status = goods.length;
        // 添加进度条
        $("body").prepend($('<div id=' + barID + ' class="helper-progress-bar" style="height: 10px;background: linear-gradient(90deg, #26d88dbf, #26c8d880,transparent);bottom:0px;position: fixed;z-index: 1000;"></div>'));
        for (let i = 0; i < goods.length; i++) {
            let target = $(goods[i]).find("p>strong.f_Strong")[0];
            let buff_price = target.innerText.slice(2);
            let url = $(goods[i]).children("a")[0].href;
            $(goods[i]).attr("data-default-sort", i);
            //	buff的ajax
            $.ajax({
                url: url,
                method: "get",
                success: function (data) {
                    updateProgressBar($("#" + barID), 3);
                    status--;
                    let steam_link = $(data).find(".detail-summ>a")[0].href;
                    getSteamOrderList(steam_link, url).then(function onFulfilled(json) {
                        let orderCount = $(json.buy_order_summary)[0].innerText;
                        let steamOrderScale = getScale(buff_price, (json.highest_buy_order / 100), true);
                        $(goods[i]).attr("data-order-sort", steamOrderScale);
                        $(target).after($(steanOrderCountTemp).text(orderCount + "┊"));
                        paintingGradient(steamOrderScale, target, 4, steanOrderScaleTemp);
                    }).catch(function onRejected(err) {
                        if (err.status == 429) {
                            err.statusText = "请求次数过多";
                        }
                        $(target).after($(steanOrderCountTemp).text(err.statusText));
                    }).finally(() => {
                        updateProgressBar($("#" + barID), 3);
                        if (status == 0 && needSort) {
                            let arr = needSort.split(".");
                            sortGoods("data-" + arr[0], arr[1] == "asc");
                        }
                    });
                    let steam_price = $(data).find(".detail-summ .f_Strong>span.custom-currency")[0].getAttribute('data-price');
                    let withoutFeePrice = getWithoutFeePrice(steam_price, true);
                    let scale = getScale(buff_price, steam_price, true);
                    $(goods[i]).attr("data-buff-sort", scale);
                    $(target).append($("<span class=\"f_12px f_Bold c_Gray\"></span>").css("margin-left", "5px").text(withoutFeePrice));
                    paintingGradient(scale, target, 3);
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
        $(".block-header>.l_Right").append($('<div class="w-Select-Multi w-Select-scroll buff-helper-sort" style="visibility: visible; width: 140px;"><h3 id="helper-sort-text">比例排序</h3><i class="icon icon_drop"></i><ul style="width: 140px;"><li data-value="default">默认</li><li data-value="buff-sort.asc"><span class="w-Order_asc">buff比例从低到高<i class="icon icon_order"></i></span></li><li data-value="buff-sort.desc"><span class="w-Order_des">buff比例从高到低<i class="icon icon_order"></i></span></li><li data-value="order-sort.asc"><span class="w-Order_asc">求购比例从低到高<i class="icon icon_order"></i></span></li><li data-value="order-sort.desc"><span class="w-Order_des">求购比例从高到低<i class="icon icon_order"></i></span></li></ul></div>'));
        if (needSort) {
            let list = $(".buff-helper-sort li");
            for (let index = 1; index < list.length; index++) {
                let element = list[index];
                if (element.dataset.value == needSort) {
                    $("#helper-sort-text").text(element.innerText);
                    break;
                }
            }
        }
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
            if (this.dataset.value == "default") {
                GM_setValue("sortRule", null);
                $("#helper-sort-text").text("比例排序");
                sortGoods("data-default-sort", true);
            } else {
                GM_setValue("sortRule", this.dataset.value);
                needSort = this.dataset.value;
                $("#helper-sort-text").text(this.innerText);
                let arr = this.dataset.value.split(".");
                sortGoods("data-" + arr[0], arr[1] == "asc");
            }
            $(".buff-helper-sort").removeClass("on");
        });
        // 排序进度条 总长度200%
        buff_csgo_list_scale_plugin_load();
        setTimeout(function () {
            $(document).ajaxSend(function (event, status, header, result) {
                if (header.url.slice(0, 17) === "/api/market/goods") {
                    $(".helper-progress-bar").remove();
                }
            });
            $(document).ajaxSuccess(function (event, status, header, result) {
                if (header.url.slice(0, 17) === "/api/market/goods") {
                    buff_csgo_list_scale_plugin_load();
                }
            });
        }, 1000);
    }

})();