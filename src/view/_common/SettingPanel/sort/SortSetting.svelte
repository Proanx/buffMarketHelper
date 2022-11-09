<script lang="ts">
    import Switch from "src/view/_common/SurroundLabelSwitch/Switch.svelte";
    import { createEventDispatcher, onMount, tick } from "svelte";
    import SortRule, { SortType } from "src/enum/SortRule";
    import { ListItem, Expander } from "fluent-svelte";
    import { isNotNumber } from "src/utils/MathUtil";
    import UserSetting from "src/utils/UserSetting";

    const dispatch = createEventDispatcher();

    let expandedRule = false;
    let expandedType = false;

    let overrideCheck = UserSetting.overrideSortRule;
    let awaitCheck = UserSetting.sortAfterAllDone;
    let sortRule = SortRule[UserSetting.sortRule];
    let sortType = SortType[UserSetting.sortType];

    function select(e) {
        if (e.target.dataset.key == "sortRule") {
            sortRule = SortRule[e.target.dataset.val];
            expandedRule = false;
        } else {
            sortType = SortType[e.target.dataset.val];
            expandedType = false;
        }
        dispatch("message", {
            attr: e.target.dataset.key,
            val: e.target.dataset.val,
        });
    }

    function check(e) {
        dispatch("message", {
            attr: e.target.dataset.key,
            val: e.target.checked,
        });
    }

    onMount(async () => {
        await tick();
        document.onclick = (e) => {
            if (expandedRule) {
                let ruleDom = document.querySelector(".sort-rule-select");
                if (!ruleDom?.contains(e.target)) {
                    expandedRule = false;
                }
            } 
            if (expandedType) {
                let typeDom = document.querySelector(".sort-type-select");
                if (!typeDom?.contains(e.target)) {
                    expandedType = false;
                }
            }
        };
    });
</script>

<div class="title" style="margin-bottom:10px;">插件默认排序规则</div>
<Expander bind:expanded={expandedRule} class="sort-rule-select">
    <span>{sortRule}</span>
    <svelte:fragment slot="content">
        <div class="sort-rule-list">
            {#each Object.keys(SortRule).filter((a) => isNotNumber(a)) as rule, index (rule)}
                <ListItem on:click={select} data-key="sortRule" data-val={index}>
                    <span>{rule}</span>
                </ListItem>
            {/each}
        </div>
    </svelte:fragment>
</Expander>
<Expander bind:expanded={expandedType} class="sort-type-select">
    <span>{sortType}</span>
    <svelte:fragment slot="content">
        <div class="sort-type-list">
            {#each Object.keys(SortType).filter((a) => isNotNumber(a)) as type, index (type)}
                <ListItem on:click={select} data-key="sortType" data-val={index}>
                    <span>{type}</span>
                </ListItem>
            {/each}
        </div>
    </svelte:fragment>
</Expander>
<div class="describe">左侧选择为排序依据，右侧选择为排序顺序</div>
<hr />
<div class="title">临时覆盖排序规则</div>
<Switch bind:checked={overrideCheck} on:change={check} data-key="overrideSortRule" />
<div class="describe">开启时如果使用了BUFF的排序按钮，则临时设置插件为不排序</div>
<hr />
<div class="title">加载完成后排序</div>
<Switch bind:checked={awaitCheck} on:change={check} data-key="sortAfterAllDone" />
<div class="describe">开启后会等待所有饰品的比例信息计算完毕后进行排序，否则每加载完成一个就排序一次</div>

<style global>
    .sort-rule-select {
        --boxWidth: 160px;
        width: var(--boxWidth);
    }

    .sort-rule-select .expander-header {
        width: var(--boxWidth);
    }

    .sort-rule-select.expander > .expander-content-anchor {
        width: var(--boxWidth);
    }

    .sort-type-select {
        --boxWidth: 120px;
        width: var(--boxWidth);
    }

    .sort-type-select .expander-header {
        width: var(--boxWidth);
    }

    .sort-type-select.expander > .expander-content-anchor {
        width: var(--boxWidth);
    }

    .sort-rule-list .text-block.type-body,
    .sort-type-list .text-block.type-body {
        display: flex;
        width: 100%;
        justify-content: center;
    }
</style>
