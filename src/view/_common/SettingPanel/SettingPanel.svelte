<script lang="ts">
    import SteamGOOD from "@fluentui/svg-icons/icons/checkmark_circle_20_regular.svg";
    import SteamUNKNOW from "@fluentui/svg-icons/icons/question_circle_20_regular.svg";
    import SteamBAD from "@fluentui/svg-icons/icons/subtract_circle_20_regular.svg";
    import NewVersion from "@fluentui/svg-icons/icons/cloud_sync_20_regular.svg";
    import SteamERROR from "@fluentui/svg-icons/icons/prohibited_20_regular.svg";
    import SteamDND from "@fluentui/svg-icons/icons/circle_20_regular.svg";
    import VersionTag from "@fluentui/svg-icons/icons/tag_20_regular.svg";
    import Close from "@fluentui/svg-icons/icons/dismiss_20_regular.svg";
    import { ContentDialog, ListItem } from "fluent-svelte";
    import ConnectStatus from "src/enum/SteamConnectStatus";
    import { checkSteamConnection } from "src/api/steam";
    import Toc from "src/view/_common/Toc/Toc.svelte";
    // import { checkUpdate } from "src/api/greasyfork";
    import UserSetting from "src/utils/UserSetting";
    import Steam from "src/utils/SteamConnectivity";
    import SettingContent from "./setting.svx";
    import { onMount, tick } from "svelte";
    import { status } from "./index";
    import "fluent-svelte/theme.css";

    let open = false;
    let content;
    let whiteSpaceHeight;
    let steamStatus;
    let checking = false;
    let haveNewVersion = false;

    $: headings =
        content &&
        Array.from(content.querySelectorAll("h1, h2, h3, h4, h5"))
            .filter((node: Element) => !node.closest(".markdown-body > table"))
            .reverse();

    onMount(() => {
        Steam.Connectivity.subscribe((val) => {
            steamStatus = val;
        });
        status.subscribe((val) => {
            open = val;
        });
        // checkUpdate().then((result) => {
        //     haveNewVersion = result;
        // });
    });

    function close() {
        status.set(false);
    }

    async function refresh() {
        checking = true;
        steamStatus = ConnectStatus.Loading;
        steamStatus = await checkSteamConnection();
        checking = false;
    }

    function openInstallPage() {
        if (haveNewVersion) {
            window.open("https://greasyfork.org/zh-CN/scripts/410137");
        }
    }

    async function afterDialogOpen() {
        await tick();
        // let style = getComputedStyle(headings[0]);
        // whiteSpaceHeight =
        //     headings &&
        //     content.offsetHeight - (content.scrollHeight - headings[0].offsetTop) + parseInt(style.paddingTop);
        whiteSpaceHeight = headings && content.offsetHeight - (content.scrollHeight - headings[0].offsetTop);
    }

    function settingChange(e) {
        if (e.detail) {
            UserSetting[e.detail.attr] = e.detail.val;
            UserSetting.save();
        }
        console.log("收到了", e.detail.attr, UserSetting[e.detail.attr]);
    }
</script>

<ContentDialog
    class="setting-dialog"
    bind:open
    on:backdropclick={close}
    on:open={afterDialogOpen}
    on:close={() => {
        whiteSpaceHeight = 0; // 不清零会导致下一次开启时长度计算故障
    }}>
    <aside>
        <ListItem disabled={checking} on:click={refresh}>
            <svelte:fragment slot="icon">
                {#if steamStatus == ConnectStatus.Good}
                    <SteamGOOD />
                {:else if steamStatus == ConnectStatus.Bad}
                    <SteamBAD />
                {:else if steamStatus == ConnectStatus.Loading}
                    <SteamDND class="status-icon" />
                {:else if steamStatus == ConnectStatus.Unknow}
                    <SteamUNKNOW />
                {:else}
                    <SteamERROR />
                {/if}
            </svelte:fragment>
            {#if steamStatus == ConnectStatus.Good}
                STEAM连接正常
            {:else if steamStatus == ConnectStatus.Bad}
                请求STEAM频繁
            {:else if steamStatus == ConnectStatus.Loading}
                连接STEAM中
            {:else if steamStatus == ConnectStatus.Unknow}
                等待STEAM连接
            {:else}
                无法连接STEAM
            {/if}
        </ListItem>
        <ListItem disabled={!haveNewVersion} on:click={openInstallPage}>
            <svelte:fragment slot="icon">
                {#if haveNewVersion}
                    <NewVersion />
                {:else}
                    <VersionTag />
                {/if}
            </svelte:fragment>
            <!-- svelte-ignore missing-declaration -->
            版本：{GM_info.script.version}
        </ListItem>
        <Toc target={content} />
        <ListItem on:click={close} style="color:grey;justify-content:center;padding-inline-end:20px;margin-top: auto;">
            <svelte:fragment slot="icon">
                <Close />
            </svelte:fragment>
            关闭窗口
        </ListItem>
    </aside>
    <article class="markdown-body" bind:this={content}>
        <SettingContent on:message={settingChange} />
        <div class="white-space" style="height:{whiteSpaceHeight}px" />
    </article>
</ContentDialog>

<style>
    :global(.setting-dialog > .content-dialog-body) {
        display: flex;
        max-height: 75vh;
    }
    :global(.setting-dialog) {
        width: 85vw !important;
        max-width: 1000px !important;
    }
    :global(.list-item > svg:first-child) {
        width: 20px;
    }

    @keyframes wave {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.2;
        }
    }

    :global(.status-icon) {
        animation: wave 2s infinite;
    }

    aside {
        width: 180px;
        height: 75vh;
        display: inline-flex;
        flex-direction: column;
        flex-wrap: nowrap;
        padding: 0;
        padding-right: 10px;
        inset-block-start: 10px;
    }

    article {
        padding: 0 30px;
        margin-block-start: 10px;
    }

    article:first-child {
        padding-block-start: 0;
    }
</style>
