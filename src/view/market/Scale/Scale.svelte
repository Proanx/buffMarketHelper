<script lang="ts">
  import "@shoelace-style/shoelace/dist/components/skeleton/skeleton.js";
  import { calculateFeeAmount } from "src/utils/CurrencyUtil";
  import { createEventDispatcher, onMount } from "svelte";
  import Connectivity from "src/enum/SteamConnectStatus";
  import { getSteamOrderList } from "src/api/steam";
  import UserSetting from "src/utils/UserSetting";
  import JsonResult from "src/entity/JsonResult";

  const dispatch = createEventDispatcher();

  export let buffSellMinPrice: number; // buff出售最低价
  export let buffOnSellNum: number; // buff在售数量
  // export let buffBuyMaxPrice: number;
  // export let buffBuyOrderNum: number;
  export let steamSellMinPrice: number; // steam售价（默认值为buff提供的参考售价）
  export let steamMarketUrl: string;
  export let buffItemId: number;

  // buff展示售价（可能是外汇）
  let displayMinPrice: number = Math.round(g.currency.rate_base_cny * buffSellMinPrice);
  let integer: number = Math.floor(displayMinPrice / 100); // 整数
  let decimal: number = Math.round((displayMinPrice / 100) % 1); // 小数

  // 无视当前连接状态，默认展示加载骨架
  let steamConnection: Connectivity = Connectivity.Unknow;
  let steamOrder: JsonResult; // steam市场请求结果
  // let steamOnSellNum: number; // steam在售数量
  let steamBuyMaxPrice: string; // steam求购最高价
  let steamBuyOrderNum: number; // steam求购数量

  let sellAfterTaxIncome: number; // 出售税后实收
  let buyAfterTaxIncome: number; // 求购税收实收
  let sellScale: string; // 出售比例
  let buyScale: string; // 求购比例

  onMount(async function init(retry = false) {
    if (UserSetting.buffSellThreshold >= buffSellMinPrice) {
      steamOrder = JsonResult.Failed({ code: 204 });
    } else {
      steamOrder = await getSteamOrderList(buffItemId, steamMarketUrl);
      if (steamOrder.code == 500 && !retry) {
        // 自动重试
        setTimeout(init, 1000);
        return;
      }
    }

    if (steamOrder.status) {
      if (steamOrder.data.buy_order_table == "") {
        steamConnection = Connectivity.Bad;
        steamOrder.shortMsg == "没有有效订购单";
      } else {
        steamConnection = Connectivity.Good;
        // steamOnSellNum = steamOrder.data.sell_order_summary.match(/>(\d+)</)[1];
        steamBuyOrderNum = steamOrder.data.buy_order_summary.match(/>(\d+)</)[1];
      }
      steamSellMinPrice = steamOrder.data.lowest_sell_order;
      steamBuyMaxPrice = steamOrder.data.highest_buy_order;
      // 求购比例
      buyAfterTaxIncome = calculateFeeAmount(+steamBuyMaxPrice).feed;
      buyScale = (buyAfterTaxIncome / buffSellMinPrice).toFixed(2);
    } else {
      steamConnection = Connectivity.Forbid;
    }
    // 出售比例
    sellAfterTaxIncome = calculateFeeAmount(+steamSellMinPrice).feed;
    sellScale = (sellAfterTaxIncome / buffSellMinPrice).toFixed(2);

    dispatch("complete", steamOrder);

    // todo 外部需要：转换货币为分制、处理complete消息、更新进度条
  });
</script>

<strong class="f_Strong">
  <!-- buff售价-整数 -->
  <!-- svelte-ignore missing-declaration -->
  <span style="font-size:20px;">{g.currency.symbol} {integer}</span>
  <!-- buff售价-小数 -->
  {#if decimal != undefined}
    <small>.{decimal}</small>
  {/if}
  {#if steamConnection == Connectivity.Unknow}
    <sl-skeleton title="加载中" effect="pulse" style="width:30px;margin-left:5px;" />
    <sl-skeleton title="加载中" effect="pulse" class="l_Right" style="width:35px;" />
  {:else}
    <!-- 税后实收 -->
    <span title="税后实收" class="f_12px f_Bold c_Gray" style="margin-left:5px;">{sellAfterTaxIncome}</span>
    <!-- 挂刀比例 -->
    <strong title="挂刀比例" class="f_16px price_scale l_Right">{sellScale}</strong>
  {/if}
</strong>
{#if steamConnection == Connectivity.Unknow}
  <sl-skeleton title="加载中" class="l_Right" effect="pulse" style="width: 70px;margin-top: 4px;" />
{:else if steamConnection == Connectivity.Good}
  <!-- 求购比例 -->
  <span title="求购比例" class="f_12px f_Bold l_Right steam_temp">
    {buyScale}
  </span>
  <!-- 求购数量 -->
  <span title="求购数量" class="f_12px c_Gray f_Bold l_Right steam_temp">
    {steamBuyOrderNum >= 10000 ? "9999+" : steamBuyOrderNum}┊
  </span>
{:else}
  <span class="f_12px c_Error f_Bold l_Right steam_temp">{steamOrder.smsg}</span>
{/if}
<!-- buff在售数量 -->
<span class="f_12px f_Bold c_Gray l_Left">
  {buffOnSellNum >= 1000 ? "999+" : buffOnSellNum}在售
</span>

<!-- 
c_Blue
c_Gray
c_Green
c_Error
c_Orange
c_Highlight
 -->

<!--  老版本求购位置可能出现的情况
  orderNumber + "┊" + 比例  正常情况
  "已略过"
  "访问steam失败"
  "没有有效订购单"
  errorTranslator.shortMsg || "错误"
  errorTranslator.msg.split("，")
 -->
<style>
  sl-skeleton {
    display: inline-block;
    position: relative;
    top: 1px;
  }

  strong.f_Strong {
    display: block;
    font-size: 0px;
    height: 20px;
  }

  span.l_Left,
  .steam_temp {
    margin-top: inherit;
  }

  .price_scale {
    padding-top: 2px;
  }
</style>
