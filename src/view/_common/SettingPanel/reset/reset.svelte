<script lang="ts">
    import UserSetting from "src/utils/UserSetting";
    import { Button, ContentDialog } from "fluent-svelte";

    let open = false;

    function reset() {
        UserSetting.reset();
        // close();
        location.reload();
    }

    function close() {
        open = false;
    }
</script>

<Button variant="danger" on:click={() => (open = true)}>重置插件</Button>

<ContentDialog bind:open on:backdropclick={close} title="确定要重置所有设定吗" size="min">
    重置后会触发一次网页刷新<br />请先注意保存当前的工作
    <svelte:fragment slot="footer">
        <Button variant="danger" on:click={reset}>确定</Button>
        <Button on:click={close}>取消</Button>
    </svelte:fragment>
</ContentDialog>

<style lang="scss" global>
    .style-danger {
        background-color: #cc0000;
        background-clip: padding-box;
        border: 1px solid var(--fds-control-stroke-on-accent-default) !important;
        border-bottom-color: var(--fds-control-stroke-on-accent-secondary) !important;
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
