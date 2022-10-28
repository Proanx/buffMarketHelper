import SortRule, { SortType } from "src/enum/SortRule";

// todo 测试枚举反序列化后的结果

export default class UserSetting {
    // 市场页面
    static maxGradientRange: number = 1;
    static minGradientRange: number = 0.63;
    static marketColorLow: string = "#ff1e1e";
    static marketColorHigh: string = "#5027ff";
    static sortRule = SortRule.Default;
    static sortType = SortType.Nature;
    static overrideSortRule: boolean = false;
    static sortAfterAllDone: boolean = true;
    static buffSellThreshold: number = 0;
    static pageSize: number = 20;
    // 详情页面;
    static reverseSticker: boolean = false;
    static ignoreExchangeRate: boolean = false;
    static orderTableFloatLeft: boolean = false;
    // 公共属性
    static steamCurrency: string = "CNY";
    static ajaxTimeout: number = 20000;

    private static isFinite: boolean = false;

    static get(key: string) {
        return this[key];
    }

    static init(): void {
        if (!this.isFinite) {
            let setting = GM_getValue("USER_SETTING", {});
            for (const key of Object.keys(setting)) {
                this[key] = setting[key];
            }
        }
        this.isFinite = true;
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
        GM_setValue("USER_SETTING", temp);
    }

    private static readonly DEFAULT_CONFIG: object = {
        pageSize: 20,
        ajaxTimeout: 20000,
        maxGradientRange: 1,
        steamCurrency: "CNY",
        buffSellThreshold: 0,
        reverseSticker: false,
        sortAfterAllDone: true,
        minGradientRange: 0.63,
        overrideSortRule: false,
        marketColorLow: "#ff1e1e",
        sortType: SortType.Nature,
        ignoreExchangeRate: false,
        orderTableFloatLeft: false,
        marketColorHigh: "#5027ff",
        sortRule: SortRule.Default,
    };

}

UserSetting.init();

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