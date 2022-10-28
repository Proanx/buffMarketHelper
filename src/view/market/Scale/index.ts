import Scale from "./Scale.svelte";
import Steam from "src/utils/SteamConnectivity";
import ConnectStatus from "src/enum/SteamConnectStatus";
import { get } from "svelte/store";

function init(result) {
    let goods = $("#j_list_card>ul>li>p");
    let componentList: any[] = [];
    let failedCount: number = 0;
    let successCount: number = 0;
    let connectionCount: number = result.data.items.length;
    let steamStatus: ConnectStatus = get(Steam.Connectivity);

    for (let index = 0; index < goods.length; index++) {
        const item = goods[index];
        const info = result.data.items[index];
        item.innerHTML = "";
        let instance = new Scale({
            target: item,
            props: {
                buffSellMinPrice: (info.sell_min_price * 100) | 0,
                buffOnSellNum: info.sell_num,
                // buffBuyMaxPrice: (info.buy_max_price * 100) | 0,
                // buffBuyOrderNum: info.buy_num,
                steamSellMinPrice: (info.goods_info.steam_price_cny * 100) | 0,
                steamMarketUrl: info.steam_market_url,
                buffItemId: info.id,
            }
        });
        instance.$on("complete", result => {
            if (result.detail.status) {
                successCount++;
                if (steamStatus == ConnectStatus.Unknow || steamStatus == ConnectStatus.Loading) {
                    Steam.Connectivity.set(ConnectStatus.Good);
                    steamStatus = ConnectStatus.Good;
                }
            } else {
                failedCount++;
                if (connectionCount >= 4 && failedCount >= (connectionCount >> 2)) {
                    Steam.Connectivity.set(ConnectStatus.Forbid);
                    steamStatus = ConnectStatus.Forbid;
                }
            }
        });
        componentList.push(instance);
    }
    return () => {
        for (const item of componentList) {
            item.$destroy();
        }
    }
}

export default {
    init
}