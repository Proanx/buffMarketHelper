import SortRule, { SortType } from "src/enum/SortRule";
import { getBeijingTs } from "./DateUtil";

// todo 测试枚举反序列化后的结果

export default class UserSetting {
    // 市场页面
    static maxGradientRange: number = 1;
    static minGradientRange: number = 0.63;
    static marketColorLow: string = "#ff1e1e";
    static marketColorHigh: string = "#5027ff";
    static sortRule = SortRule[0];
    static sortType = SortType[0];
    static overrideSortRule: boolean = false;
    static sortAfterAllDone: boolean = true;
    static buffSellNumThreshold: number = 0;
    static buffSellPriceThreshold: number = 0;
    static buffOrderNumThreshold: number = 0;
    static buffOrderPriceThreshold: number = 0;
    static pageSize: number = 20;
    // 详情页面;
    static displayBoost: boolean = true;
    static reverseSticker: boolean = false;
    static ignoreExchangeRate: boolean = false;
    static orderTableFloatLeft: boolean = false;
    // 公共属性
    static steamCurrency: string = "CNY";
    static ajaxTimeout: number = 20000;

    static modifyTime: number = 0;
    private static isInit: boolean = false;

    static get(key: string) {
        return this[key];
    }

    static init(force?: boolean): void {
        if ((!this.isInit) || force) {
            let setting = GM_getValue("USER_SETTING", {});
            for (const key of Object.keys(setting)) {
                this[key] = setting[key];
            }
            this.modifyTime = getBeijingTs();
            GM_setValue("SETTING_TIMSTAMP", this.modifyTime);
        }
        this.isInit = true;
    }

    static reset(): void {
        GM_setValue("USER_SETTING", {});
        for (const key of Object.keys(this.DEFAULT_CONFIG)) {
            this[key] = this.DEFAULT_CONFIG[key];
        }
    }

    static save() {
        let temp = {};
        for (const key of Object.keys(this)) {
            temp[key] = this[key];
        }
        this.modifyTime = getBeijingTs();
        GM_setValue("SETTING_TIMSTAMP", this.modifyTime);
        GM_setValue("USER_SETTING", temp);
    }

    private static readonly DEFAULT_CONFIG: object = {
        pageSize: 20,
        ajaxTimeout: 20000,
        displayBoost: true,
        maxGradientRange: 1,
        steamCurrency: "CNY",
        sortRule: SortRule[0],
        sortType: SortType[0],
        reverseSticker: false,
        sortAfterAllDone: true,
        minGradientRange: 0.63,
        overrideSortRule: false,
        buffSellNumThreshold: 0,
        buffOrderNumThreshold: 0,
        marketColorLow: "#ff1e1e",
        ignoreExchangeRate: false,
        orderTableFloatLeft: false,
        marketColorHigh: "#5027ff",
        buffSellPriceThreshold: 0,
        buffOrderPriceThreshold: 0,
    };

}

UserSetting.init();

// 用于多页面之间同步设置
window.addEventListener("focus", function () {
    if (GM_getValue("SETTING_TIMSTAMP", 0) != UserSetting.modifyTime) {
        UserSetting.init(true);
    }
});

// class Setting {
//     id: string;
//     // type: string;
//     key: any;
//     value: any;

//     constructor(id: string, key, value = undefined) {
//         this.id = id;
//         // this.type = typeof value;
//         this.key = key;
//         this.value = value;
//     }

// }