import NextPageSvelte from "./NextPage.svelte";

function init() {

    let floatBar = document.querySelector(".floatbar>ul");
    let li = document.createElement("li");
    li.innerHTML = "<a href=\"javascript:;\" id=\"setting-next\"></a>"
    floatBar?.prepend(li);

    new NextPageSvelte({
        target: document.querySelector("#setting-next")
    });

}

export default {
    init
}