<script lang="ts">
	import { cn } from '$lib/utils'
	import { RANGE_OPTIONS, type RangeKey } from '$lib/hooks/useStockDashboard.svelte'

	let {
		value,
		onChange,
		className
	}: {
		value: RangeKey
		onChange: (v: RangeKey) => void
		className?: string
	} = $props()
</script>

<div class={cn('inline-flex items-center gap-0.5 rounded-lg bg-surface-200 p-1 dark:bg-surface-700', className)}>
	{#each RANGE_OPTIONS as option}
		<button
			type="button"
			onclick={() => onChange(option.key)}
			class={cn(
				'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
				value === option.key
					? 'bg-surface-50 text-surface-900 shadow-sm dark:bg-surface-600 dark:text-surface-100'
					: 'text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100'
			)}
		>
			{option.label}
		</button>
	{/each}
</div>
