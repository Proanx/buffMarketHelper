// import _ from "lodash/debounce";
import SettingPanel from "./panel/SettingPanel.svelte";
import SettingButton from "./SettingButton.svelte";
import { writable } from "svelte/store";

export let status = writable(false);

function init() {

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