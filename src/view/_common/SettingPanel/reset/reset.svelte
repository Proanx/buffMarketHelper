<script lang="ts">
    import UserSetting from "src/utils/UserSetting";
    import { Button } from "fluent-svelte";

    function reset() {
        console.log("重置");
        // UserSetting.reset();
    }
</script>

<Button variant="danger" on:click={reset}>重置插件</Button>

<style lang="scss" global>
    .style-danger {
        background-color: #cc0000;
        background-clip: padding-box;
        border: 1px solid var(--fds-control-stroke-on-accent-default);
        border-bottom-color: var(--fds-control-stroke-on-accent-secondary);
        color: #f9f9f9;
        transition: var(--fds-control-faster-duration) ease border-color;
        &:hover {
            background-color: #cc0000cc;
        }
        &:active {
            background-color: #e00000cc;
            border-color: transparent;
            color: var(--fds-text-on-accent-secondary);
        }
    }
</style>
