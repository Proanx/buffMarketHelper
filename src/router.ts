import view from "./view"

function initRouter() {
    // 根据需求判断location对象的值，来选择使用哪个page
    if (location.pathname.startsWith("/market")) {
        view.market.init();
    } else if (location.pathname.startsWith("/goods")) {
        // view.goods.init();
    }
}

export {
    initRouter
}