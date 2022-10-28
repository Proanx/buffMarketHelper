<script lang="ts">
    import { ListItem, Expander, TextBlock, Flyout } from "fluent-svelte";
    import { getSteamExchangeRate } from "src/api/steam";
    import { createEventDispatcher, onMount, tick } from "svelte";
    import CurrencyData from "src/assets/CurrencyData.json";
    import UserSetting from "src/utils/UserSetting";
    import "./currency-select.global.css";
    import JsonResult from "src/entity/JsonResult";
    import { secDiff, toDescribeText } from "src/utils/DateUtil";
    import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";

    const dispatch = createEventDispatcher();

    let currencyList: any = Object.assign({}, CurrencyData);
    let currency = CurrencyData[UserSetting.steamCurrency];
    let expanded = false;
    let promise = updateExchangeRate();

    Reflect.deleteProperty(currencyList, "RMB"); // 不展示code了，RMB没有存在的必要

    currencyList = Object.values(currencyList).sort((a: any, b: any) => {
        return a.currencyName.localeCompare(b.currencyName);
    });

    onMount(async () => {
        await tick();
        window.onclick = (e) => {
            if (expanded) {
                let dom = document.querySelector(".currency-select");
                if (!dom?.contains(e.target)) {
                    expanded = false;
                }
            }
        };
    });

    function select(e) {
        let t = e.target.nodeName == "LI" ? e.target : e.path.find((dom) => dom.nodeName == "LI");
        expanded = false;
        let val = t.dataset.key;
        currency = CurrencyData[val];
        dispatch("message", {
            attr: "steamCurrency",
            val: val,
        });
        promise = updateExchangeRate();
    }

    async function updateExchangeRate(force?: boolean) {
        let eCurrencyCode = currency.eCurrencyCode;
        if (eCurrencyCode != 23) {
            let exchangeRate = GM_getValue(`exchange_rate_${eCurrencyCode}`, {});
            if (!force && exchangeRate.time_next_update_unix && exchangeRate.time_next_update_unix > Date.now()) {
                return exchangeRate;
            }
            try {
                let result = await getSteamExchangeRate();
                return result.data;
            } catch (error) {
                // 如果有曾经的汇率信息，那就沿用，否则切换回人民币
                if (!GM_getValue(`exchange_rate_${eCurrencyCode}`, {}).time_next_update_unix) {
                    currency = CurrencyData["CNY"];
                    dispatch("message", {
                        attr: "steamCurrency",
                        val: "CNY",
                    });
                }
                throw error;
            }
        }
        return { CtoF: 1 };
    }
</script>

<div class="select-box">
    <span class="title">参考货币</span>
    <Expander bind:expanded class="currency-select">
        <span>{currency.currencyName}</span>
        <span>{currency.strSymbol}</span>
        <svelte:fragment slot="content">
            <div class="currency-list">
                {#each currencyList as item (item.strCode)}
                    <ListItem on:click={select} data-key={item.strCode}>
                        <span>{item.currencyName}</span>
                        <span>{item.strSymbol}</span>
                    </ListItem>
                {/each}
            </div>
        </svelte:fragment>
    </Expander>
    <TextBlock class="exchange-rate" variant="body">
        <ListItem style="cursor: pointer" on:click={() => (promise = updateExchangeRate(true))}>
            {#await promise}
                正在读取汇率信息
            {:then result}
                <sl-tooltip content={"更新于：" + toDescribeText(secDiff(result.time_update_unix))} hoist>
                    <span>
                        汇率：1 ∶ {result.CtoF}
                    </span>
                </sl-tooltip>
            {:catch err}
                获取汇率失败：{err.smsg}
            {/await}
        </ListItem>
    </TextBlock>
</div>
<div class="describe">会根据所选货币获取STEAM价格，获取失败且没有历史汇率信息时会切回人民币，汇率比为 人民币∶外汇</div>

<style lang="scss">
    .select-box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        span.title {
            flex: {
                shrink: 0;
            }
        }
    }
</style>
