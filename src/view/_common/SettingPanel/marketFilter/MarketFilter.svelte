<script lang="ts">
    import { TextBox } from "fluent-svelte";
    import UserSetting from "src/utils/UserSetting";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let sellNum = UserSetting.buffSellNumThreshold || "";
    let sellPrice = UserSetting.buffSellPriceThreshold || "";
    let orderNum = UserSetting.buffOrderNumThreshold || "";
    let orderPrice = UserSetting.buffOrderPriceThreshold || "";

    function change(e) {
        dispatch("message", {
            attr: e.target.dataset.key,
            val: e.target.value,
        });
    }
</script>

<span class="title">buff在售数量门槛</span>
<TextBox
    class="setting-filter"
    clearButton={false}
    placeholder="0或不填代表关闭"
    data-key="buffSellNumThreshold"
    on:change={change}
    value={sellNum}
    min="0"
    type="number" />
<!-- <div class="describe">只有buff在售数大于等于门槛数值时才会请求steam</div> -->
<hr />
<span class="title">buff售价门槛</span>
<TextBox
    class="setting-filter"
    clearButton={false}
    placeholder="支持输入小数"
    data-key="buffSellPriceThreshold"
    on:change={change}
    value={sellPrice}
    min="0"
    step="0.01"
    type="number" />
<!-- <div class="describe">0或不填代表关闭，只有在buff售价大于等于门槛数值时才会请求steam</div> -->
<hr />
<span class="title">buff求购数量门槛</span>
<TextBox
    class="setting-filter"
    clearButton={false}
    placeholder="0或不填代表关闭"
    data-key="buffOrderNumThreshold"
    on:change={change}
    value={orderNum}
    min="0"
    type="number" />
<!-- <div class="describe">只有在buff求购数大于等于门槛数值时才会请求steam</div> -->
<hr />
<span class="title">buff求购价门槛</span>
<TextBox
    class="setting-filter"
    clearButton={false}
    placeholder="支持输入小数"
    data-key="buffOrderPriceThreshold"
    on:change={change}
    value={orderPrice}
    min="0"
    step="0.01"
    type="number" />
<!-- <div class="describe">0或不填代表关闭，只有在buff求购价大于等于门槛数值时才会请求steam</div> -->

<style>
    :global(.setting-filter) {
        inline-size: 160px !important;
    }
</style>
