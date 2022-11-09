<script lang="ts">
    import UserSetting from "src/utils/UserSetting";
    import { createEventDispatcher } from "svelte";
    import { Slider } from "fluent-svelte";
    import _ from "lodash/debounce";

    const dispatch = createEventDispatcher();

    let value = UserSetting.pageSize;

    function change() {
        dispatch("message", {
            attr: "pageSize",
            val: value,
        });
    }
</script>

<span class="title">当前页长：{value}</span>
<Slider bind:value min={1} max={80} on:change={_(change, 300)} />
<div class="describe">控制BUFF市场每页加载饰品数量，默认值20，最大值80</div>
<div class="describe" style="color:red;">此设置“有可能”会导致更容易被BUFF封号</div>
