<script lang="ts">
    // import CircularProgress from "@smui/circular-progress";
    import UserSetting from "src/utils/UserSetting";
    import Steam from "src/utils/SteamConnectivity";
    import { onMount } from "svelte";

    let countdown: number = UserSetting.ajaxTimeout;
    let cur = countdown;
    let ts: number = 0;
    let closed: boolean = false;

    $: percent = cur / countdown;

    // Steam.progress.subscribe((val) => {
    //     if (val == 1) {
    //         closed = true;
    //     } else if ((val = 0)) {
    //         closed = false;
    //         render(performance.now());
    //     }
    // });

    function render(timestamp: number) {
        if (ts <= 0) {
            ts = timestamp;
        } else {
            cur -= timestamp - ts;
            ts = timestamp;
        }
        if (cur > 0 && !closed) {
            requestAnimationFrame(render);
            return;
        }
        setTimeout(() => {
            closed = true;
        }, 500);
    }

    onMount(() => {
        render(performance.now());
    });
</script>

<div class="progress-container">
    <!-- <CircularProgress
        style="width:52px;height:52px"
        progress={percent}
        {closed}
    /> -->
</div>

<style>
    .progress-container {
        top: 0;
        right: 2px;
        position: absolute;
        transform: rotateY(180deg);
    }
</style>
