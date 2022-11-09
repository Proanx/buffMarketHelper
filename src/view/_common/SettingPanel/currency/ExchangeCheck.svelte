<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import UserSetting from "src/utils/UserSetting";
    import Switch from "src/view/_common/SurroundLabelSwitch/Switch.svelte";

    const dispatch = createEventDispatcher();

    let ignoreExchangeRate = UserSetting.ignoreExchangeRate;

    function toggle() {
        dispatch("message", {
            attr: "ignoreExchangeRate",
            val: !ignoreExchangeRate,
        });
    }
</script>

<div class="title">无视汇率</div>
<Switch bind:checked={ignoreExchangeRate} on:change={toggle} />
<div class="describe" style="color:red;">无特殊需要请勿开启</div>
<div class="describe">开启后无论什么什么货币都会按1:1汇率计算比例</div>
