<script lang="ts">
	let {
		class: className = '',
		lines = 1
	}: {
		class?: string
		lines?: number
	} = $props()
</script>

<div class="flex flex-col gap-2 {className}">
	{#each { length: lines } as _, i}
		<div class="skeleton-shimmer h-4 rounded bg-surface-200 dark:bg-surface-700" style="width: {70 + (i % 3) * 10}%"></div>
	{/each}
</div>
