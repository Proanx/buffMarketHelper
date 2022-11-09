<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import UserSetting from "src/utils/UserSetting";
    import Switch from "src/view/_common/SurroundLabelSwitch/Switch.svelte";

    const dispatch = createEventDispatcher();

    let checked = !UserSetting.orderTableFloatLeft;

    function check() {
        dispatch("message", {
            attr: "orderTableFloatLeft",
            val: checked,
        });
    }
</script>

<div class="title">求购列表位置</div>
<Switch bind:checked on:change={check} left="靠左" right="靠右" />
<div class="describe">用于设置求购表格绘制位置</div>