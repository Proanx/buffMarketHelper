<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import UserSetting from "src/utils/UserSetting";
    import Switch from "src/view/_common/SurroundLabelSwitch/Switch.svelte";

    const dispatch = createEventDispatcher();

    let checked = UserSetting.reverseSticker;

    function check() {
        dispatch("message", {
            attr: "reverseSticker",
            val: !checked,
        });
    }
</script>

<div class="title">反向贴纸顺序（CSGO）</div>
<Switch bind:checked on:change={check} />
<div class="describe">开启后商品页的贴纸位置会倒序排列，对应检视时在枪械上的位置</div>
