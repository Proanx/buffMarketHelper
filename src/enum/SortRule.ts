enum SortRule {
    Default,
    SellScale,          // 挂刀比例
    OrderScale,         // 求购比例
    BuffOrderNum,       // buff求购数量
    BuffOnSellNum,      // buff在售数量
    BuffOrderPrice,     // buff求购价格
    SteamSellPrice,     // steam售价
}

export enum SortType {
    Asc,
    Desc,
    Nature,     // 不排序
}

export default SortRule;