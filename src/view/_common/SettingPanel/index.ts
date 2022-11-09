// import _ from "lodash/debounce";
import SettingButton from "./SettingButton.svelte";
import SettingPanel from "./SettingPanel.svelte";
import { writable } from "svelte/store";

export let status = writable(false);

function init() {

    GM_addStyle(".toggle-switch:before{transition: var(--fds-control-fast-duration) ease-in-out transform,var(--fds-control-faster-duration) linear height, var(--fds-control-faster-duration) linear width,var(--fds-control-fast-duration) var(--fds-control-fast-out-slow-in-easing) margin,var(--fds-control-faster-duration) linear background !important;}");

    let floatBar = document.querySelector(".floatbar>ul");
    let li = document.createElement("li");
    li.innerHTML = "<a href=\"javascript:;\" id=\"setting-button\"></a>";
    li.onclick = () => { status.update(val => !val); }
    // li.onclick = _(() => {
    //     status.update(val => !val);
    // }, 100, {
    //     'leading': true,
    //     'trailing': false,
    //     'maxWait': 150
    // });
    floatBar?.prepend(li);

    new SettingButton({
        target: <Element><unknown>document.querySelector("#setting-button")
    });

    new SettingPanel({
        target: document.body,
    });

}

export default {
    init
};