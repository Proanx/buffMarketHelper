enum ConnectStatus {
    Good,       // 0 可以正常访问steam市场且可以正常查看商品信息
    Unknow,     // 1 未知 默认状态
    Loading,    // 2 未知 加载中
    Bad,        // 3 可以正常访问steam市场但请求无意义（未上架、无销售信息、访问频繁、未开通市场、被封禁）
    Forbid      // 4 无法访问steam市场
}
export default ConnectStatus;