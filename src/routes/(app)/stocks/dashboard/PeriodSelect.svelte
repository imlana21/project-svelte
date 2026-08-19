<script lang="ts">
	import { TRADE_PERIOD_OPTIONS, type TradePeriodKey } from '$lib/hooks/useStockDashboard.svelte'

	let {
		value,
		onChange
	}: {
		value: TradePeriodKey
		onChange: (v: TradePeriodKey) => void
	} = $props()
</script>

<select
	class="h-8 w-[170px] rounded-lg border border-surface-300 bg-surface-50 px-2 text-xs dark:border-surface-600 dark:bg-surface-800"
	{value}
	onchange={(e) => onChange((e.target as HTMLSelectElement).value as TradePeriodKey)}
>
	{#each TRADE_PERIOD_OPTIONS as option}
		<option value={option.key}>{option.label}</option>
	{/each}
</select>
