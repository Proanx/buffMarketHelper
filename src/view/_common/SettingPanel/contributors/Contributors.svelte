<script lang="ts">
    import proposers from "src/assets/Proposer.json";
    import contributors from "src/assets/Contributor.json";
    // import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";

    // contributors由每次发布前从github抓取生成
    // proposers为各个反馈渠道的信息手动汇总
</script>

<span class="label">
    代码贡献：{#if contributors.length >= 100}（仅展示前100位）{/if}
</span>
{#each contributors as contributor}
    <div class="contributor">
        <img src={contributor.avatar} alt="头像" class="avatar" />
        <span class="name">{contributor.nickname}</span>
    </div>
    <!-- <a class="contributor" href={contributor.link} target="_blank">
        <img src={contributor.avatar} alt="头像" size="32" height="32" width="32" class="avatar" />
        <span class="name">{contributor.nickname}</span>
    </a> -->
{/each}
{#if proposers.length > 0}
    <hr />
    <span class="label">来自的社群帮助：</span>
    {#each proposers as proposer}
        <!-- <svelte:element this={proposer.link ? "a" : "div"} href={proposer.link} class="contributor" target="_blank"> -->
        <svelte:element this={"div"} class="contributor">
            {#if proposer.avatar}
                <img src={proposer.avatar} alt="头像" class="avatar" />
            {:else}
                <div class="avatar" style={proposer.bgc ? `background-color:${proposer.bgc}` : ""}>
                    {proposer.nickname[0].toUpperCase()}
                </div>
            {/if}
            <span class="name">{proposer.nickname}</span>
        </svelte:element>
    {/each}
{/if}
<hr />
如果你喜欢这个插件或者喜欢我本人
<br />
可以扫下面这个赞赏码帮助插件茁壮成长( •̀ ω •́ )✧
<br />
<img
    src="https://markethelper.buff.pronax.tech/tipcode_small.png"
    style="border-radius: 50%;"
    alt="打赏码"
    height="300"
    width="300" />

<style lang="scss">
    // sl-tooltip {
    //     --sl-tooltip-border-radius: 0.25rem;
    //     --sl-tooltip-background-color: #27272a;
    //     --sl-tooltip-font-size: 0.875rem;
    //     --sl-tooltip-font-weight: 400;
    //     --sl-tooltip-line-height: 1.4;
    //     --sl-tooltip-color: #fff;
    //     --sl-tooltip-padding: 0.25rem 0.5rem;
    // }

    .contributor {
        font-size: 14px;
        line-height: 1;
        align-items: center;
        display: inline-flex;
        vertical-align: middle;
        text-decoration: none !important;

        user-select: none;

        .avatar {
            width: 32px;
            height: 32px;
            display: inline-block;
            overflow: hidden;
            line-height: 1;
            vertical-align: middle;
            background-color: #fff;
            border-radius: 6px;
            flex-shrink: 0;
            box-shadow: 0 0 0 1px #1b1f2426;
            border-radius: 50%;
        }

        div.avatar {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 18px;
            font-weight: 600;
            background-color: #2ecc71;
        }

        .name {
            font-weight: 600;
            margin-inline-start: 8px;
            margin-inline-end: 15px;
            color: #000;
        }
    }

    a.contributor {
        &:hover > .name {
            color: #0969da;
        }
    }
</style>
