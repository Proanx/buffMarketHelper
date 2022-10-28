<script lang="ts">
    // import LinearProgress from "@smui/linear-progress";
    import Steam from 'src/utils/SteamConnectivity';

    let percent = 0;
    let closed = false;

    // Steam.progress.subscribe((val) => {
    //     percent = val;
    //     if (!closed) {
    //         if (percent >= 1) {
    //             setTimeout(() => {
    //                 closed = true;
    //             }, 300);
    //         }
    //     } else if (val == 0) {
    //         closed = false;
    //     }
    // });
</script>

<div class="helper-progress">
    <!-- <LinearProgress progress={percent} {closed} buffer={0} /> -->
</div>

<style>
    .helper-progress {
        width: 100%;
        position: absolute;
        bottom: -11px;
    }
</style>
