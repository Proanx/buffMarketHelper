<script lang="ts">
	import { onMount, tick } from "svelte";
	import { ListItem } from "fluent-svelte";

	export let target: HTMLElement;

	let headings: Array<any> = [];
	let activeHeading: HTMLHeadingElement;
	let self;
	let timeout;

	$: headings =
		target &&
		Array.from(target.querySelectorAll("h1, h2, h3, h4, h5")).filter(
			(node) => !node.closest(".markdown-body > table")
		);

	$: reverseHeadings = headings && [...headings].reverse();

	$: minimum = headings && headings.reduce((a, b) => (a.tagName[1] < b.tagName[1] ? a : b)).tagName[1];

	function handleScroll() {
		if (headings) {
			activeHeading = reverseHeadings.find((heading) => heading.offsetTop <= target.scrollTop);
			clearTimeout(timeout);
			timeout = setTimeout(syncNav, 150);
		}
	}

	function syncNav() {
		let index = [...self.querySelectorAll(".list-item")].findIndex((a) => a.classList.contains("selected"));
		let y = Math.max(index * 34 - self.offsetHeight, 0);
		self.scrollTo({ top: y, behavior: "smooth" });
	}

	function handleClick(event, index: number, id: string) {
		if (id) history.pushState({}, "", `#${id}`);

		target.scrollTo({
			top: headings[index].offsetTop,
			behavior: "smooth",
		});
	}

	onMount(async () => {
		await tick();
		handleScroll();
		target.addEventListener("scroll", handleScroll);
	});
</script>

{#if target}
	<nav class="table-of-contents" bind:this={self}>
		{#each headings as { tagName, innerText, id }, i}
			<li style="--depth: {+tagName[1] - +minimum};">
				<ListItem on:click={(e) => handleClick(e, i, id)} selected={activeHeading === headings[i]}>
					{innerText}
				</ListItem>
			</li>
		{/each}
	</nav>
{/if}

<style lang="scss">
	@use "./Toc";
</style>
