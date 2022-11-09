<script lang="ts">
    import Switch from "src/view/_common/SurroundLabelSwitch/Switch.svelte";
    import UserSetting from "src/utils/UserSetting";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let displayBoost = UserSetting.displayBoost;

    function toggle() {
        dispatch("message", {
            attr: "displayBoost",
            val: !displayBoost,
        });
    }
</script>

<div class="title">展示增强（CSGO）</div>
<Switch bind:checked={displayBoost} on:change={toggle} />
<div class="describe">关闭后将不提供如检视按钮增大、贴纸放大、自动加载皮肤种子/图案模板等功能</div>
