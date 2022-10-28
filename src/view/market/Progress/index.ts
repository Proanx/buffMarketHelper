import LinearLoading from './LinearLoading.svelte'
import CountDownProgress from './CountDownProgress.svelte';

function init() {
    let progress = new LinearLoading({
        target: <Element>document.querySelector(".block-header"),
    });
    let countdown = new CountDownProgress({
        target: <Element>document.querySelector("#selling"),
    });
    return () => {
        countdown.$destroy();
        progress.$destroy();
    }
}

export default {
    init
}