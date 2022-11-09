<script lang="ts">
    import { ToggleSwitch } from "fluent-svelte";

    export let left = "关";
    export let right = "开";
    export let checked = false;
    export let value = undefined;
    export let disabled = false;
    let className = "";
    export { className as class };
</script>

<span class="left des">{left}</span>
<ToggleSwitch class={className} bind:checked {value} {disabled} {...$$restProps} on:change />
<span class="right des">{right}</span>

<style lang="scss">
    .des {
        color: #525252;
        font-size: 15px;
        font-weight: 400;
        user-select: none;
        line-height: 20px;
        vertical-align: middle;
    }
</style>
