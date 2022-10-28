import JsonResult from "src/entity/JsonResult";
import Steam from "src/utils/SteamConnectivity";
import ConnectStatus from "src/enum/SteamConnectStatus";
import UserSetting from "src/utils/UserSetting";
import CurrencyData from "src/assets/CurrencyData.json";

let status;

Steam.Connectivity.subscribe(val => {
    status = val;
});

export function getSteamExchangeRate(): Promise<JsonResult> {
    return new Promise<JsonResult>(function (resolve, reject) {
        GM_xmlhttpRequest({
            // 10000元锚点
            url: `https://steamcommunity.com/market/listings/730/Souvenir%20Sawed-Off%20|%20Snake%20Camo%20(Well-Worn)/render/?query=&start=40&count=100&currency=${CurrencyData[UserSetting.steamCurrency].eCurrencyCode}`,
            method: "get",
            timeout: UserSetting.ajaxTimeout,
            onload: function (response) {
                if (response.status != 200) {
                    return reject(JsonResult.Failed({ code: response.status }));
                }

                let data = JSON.parse(response.responseText) || {};
                if (!data.success) { return reject(JsonResult.Failed({ code: response.status })); }

                let exchangeRate;

                if (data.listinginfo["3296062994072312107"]) {
                    let timeUnix = Date.now();
                    exchangeRate = {
                        FtoC: (data.listinginfo["3296062994072312107"].price / data.listinginfo["3296062994072312107"].converted_price).toFixed(6),
                        CtoF: (data.listinginfo["3296062994072312107"].converted_price / data.listinginfo["3296062994072312107"].price).toFixed(6),
                        eCurrencyCode: data.listinginfo["3296062994072312107"].converted_currencyid % 2000,
                        time_next_update_unix: timeUnix + 10800000,
                        time_update_unix: timeUnix
                    }
                } else {
                    for (let key in data.listinginfo) {
                        if (data.listinginfo[key].currencyid == 2023) {
                            let timeUnix = Date.now();
                            exchangeRate = {
                                FtoC: (data.listinginfo[key].price / data.listinginfo[key].converted_price).toFixed(6),
                                CtoF: (data.listinginfo[key].converted_price / data.listinginfo[key].price).toFixed(6),
                                eCurrencyCode: data.listinginfo[key].converted_currencyid % 2000,
                                time_next_update_unix: timeUnix + 10800000,
                                time_update_unix: timeUnix
                            }
                            break;
                        }
                    }
                    if (!exchangeRate) {
                        return reject(JsonResult.Failed({ code: 200 }));
                    }
                }
                GM_setValue(`exchange_rate_${exchangeRate.eCurrencyCode}`, exchangeRate);
                // 对结果返回前的多次操作进行屏蔽，只取最后一次的结果
                if (exchangeRate.eCurrencyCode == CurrencyData[UserSetting.steamCurrency].eCurrencyCode) {
                    return resolve(JsonResult.Success({
                        code: 200,
                        data: exchangeRate
                    }));
                }
                return reject(JsonResult.Failed({ code: 200 }));
            },
            onerror: function (err) {
                reject(JsonResult.Failed({ code: 0 }));
            },
            ontimeout: function (err) {
                reject(JsonResult.Failed({ code: 408 }));
            }
        });
    });
}

export function checkSteamConnection(): Promise<ConnectStatus> {
    return new Promise<ConnectStatus>(async function (resolve, reject) {
        GM_xmlhttpRequest({
            url: `https://steamcommunity.com/market`,
            timeout: UserSetting.ajaxTimeout,
            method: "get",
            onload: function (res) {
                console.log(res);
                if (res.status == 429) {
                    resolve(ConnectStatus.Bad);
                } else {
                    resolve(ConnectStatus.Good);
                }
            },
            onerror: function (err) {
                resolve(ConnectStatus.Forbid);
            },
            ontimeout: function () {
                resolve(ConnectStatus.Forbid);
            }
        });
    });
}

export function getSteamOrderList(buff_item_id: number, steamLink: string): Promise<JsonResult> {
    return new Promise<JsonResult>(async function (resolve, reject) {
        if (status == ConnectStatus.Forbid) {
            resolve(JsonResult.Failed({
                "code": 0,
                "shortMsg": "无网络"
            }));
        }
        let itemDetail: JsonResult = await getItemId(buff_item_id, steamLink);
        if (itemDetail.status == false) {
            resolve(itemDetail);
            return;
        }
        GM_xmlhttpRequest({
            url: `https://steamcommunity.com/market/itemordershistogram?country=CN&language=schinese&currency=${CurrencyData[UserSetting.steamCurrency].eCurrencyCode}&item_nameid=${itemDetail.data}&two_factor=0`,
            timeout: UserSetting.ajaxTimeout,
            method: "get",
            onload: function (res) {
                if (res.status == 200) {
                    let json = JSON.parse(res.responseText);
                    if (json.success == 1) {
                        resolve(JsonResult.Success({
                            "data": json
                        }));
                        return;
                    }
                }
                console.log("访问steamorder状态异常：", res);
                resolve(errorTranslator(res));
            },
            onerror: function (err) {
                console.log("访问steamorder列表出错：", err);
                resolve(errorTranslator(err));
            },
            ontimeout: function () {
                // console.log("访问steamorder列表超时：", err);
                resolve(JsonResult.Failed({
                    "code": 408,
                    "shortMsg": "连接steam超时"
                }));
            }
        });
    });
}

export function getItemId(buff_item_id: number, steamLink: string): Promise<JsonResult> {
    return new Promise<JsonResult>(function (resolve, reject) {
        if (status == ConnectStatus.Forbid) {
            resolve(JsonResult.Failed({
                "code": 0,
                "shortMsg": "无网络"
            }));
        }
        let steam_item_id = GM_getValue(buff_item_id);
        if (steam_item_id) {
            resolve(JsonResult.Success({ "data": steam_item_id }));
            return;
        } else if (steam_item_id === null) {
            resolve(JsonResult.Failed({
                "code": 404,
                "shortMsg": "物品不在货架上",
                "data": steam_item_id
            }));
        }
        GM_xmlhttpRequest({
            url: steamLink,
            timeout: UserSetting.ajaxTimeout,
            method: "get",
            onload: function (res) {
                if (res.status == 200) {
                    let reg = /Market_LoadOrderSpread\(\s?(\d+)\s?\)/.exec(res.responseText);
                    if (reg) {
                        steam_item_id = reg[1]
                        GM_setValue(buff_item_id, steam_item_id);
                        resolve(JsonResult.Success({ "data": steam_item_id }));
                    } else {
                        GM_setValue(buff_item_id, null);
                        resolve(JsonResult.Failed({
                            "code": 404,
                            "shortMsg": "物品不在货架上",
                            "data": steam_item_id
                        }));
                    }
                } else {
                    console.log("获取itemID状态异常：", res);
                    resolve(errorTranslator(res));
                }
            },
            onerror: function (err) {
                console.log("获取itemID出现错误：", err);
                resolve(errorTranslator(err));
            },
            ontimeout: function () {
                // console.log("获取itemID超时：", err);
                resolve(JsonResult.Failed({
                    "code": 408,
                    "shortMsg": "连接steam超时"
                }));
            }
        });
    });
}

export function encodeURI(englishName: string) {
    return encodeURIComponent(englishName).replaceAll("(", "%28").replaceAll(")", "%29");
}

function errorTranslator(err): JsonResult {
    err.statusText = JsonResult.tempMsg[err.status];
    err.statusTextShort = JsonResult.tempShortMsg[err.status];
    return new JsonResult(err.status, false, err.responseText, err.statusTextShort, err.statusText);
}