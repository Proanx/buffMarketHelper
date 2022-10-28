<script lang="ts">
    import { ToggleSwitch } from "fluent-svelte";
    import { createEventDispatcher } from "svelte";
    import UserSetting from "src/utils/UserSetting";

    const dispatch = createEventDispatcher();

    let ignoreExchangeRate = !UserSetting.ignoreExchangeRate;

    function toggle() {
        dispatch("message", {
            attr: "ignoreExchangeRate",
            val: !ignoreExchangeRate,
        });
    }
</script>

<span class="title">无视汇率</span>
<ToggleSwitch bind:checked={ignoreExchangeRate} on:change={toggle} style="margin-left:10px;"/>
<div class="describe" style="color:red;">无特殊需要请勿开启</div>
<div class="describe">开启后无论什么什么货币都会按1:1汇率计算比例</div>