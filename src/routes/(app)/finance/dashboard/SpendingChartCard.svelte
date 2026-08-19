<script lang="ts">
	import { formatRupiah } from '$lib/utils/format'
	import { cn } from '$lib/utils'
	import type { FinanceTransaction } from '$lib/types/finance/Transaction'
	import { buildSpendingSeries, type SpendingGranularity, type SpendingPoint } from '$lib/hooks/useFinanceDashboard.svelte'

	let { transactions }: { transactions: FinanceTransaction[] } = $props()

	let granularity = $state<SpendingGranularity>('daily')

	const GRANULARITY_OPTIONS: { key: SpendingGranularity; label: string }[] = [
		{ key: 'daily', label: 'Daily' },
		{ key: 'weekly', label: 'Weekly' },
		{ key: 'monthly', label: 'Monthly' }
	]

	const series = $derived(buildSpendingSeries(transactions, granularity))
	const total = $derived(series.reduce((sum, p) => sum + p.amount, 0))
	const maxAmount = $derived(Math.max(...series.map((p) => p.amount), 0))
</script>

<div class="rounded-xl border border-surface-300 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
	<div class="mb-4 flex items-center justify-between">
		<h3 class="text-sm font-medium text-surface-500 dark:text-surface-400">Spending Chart</h3>
		<div class="inline-flex items-center gap-0.5 rounded-lg bg-surface-200 p-1 dark:bg-surface-700">
			{#each GRANULARITY_OPTIONS as option}
				<button
					type="button"
					onclick={() => (granularity = option.key)}
					class={cn(
						'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
						granularity === option.key
							? 'bg-surface-50 text-surface-900 shadow-sm dark:bg-surface-600 dark:text-surface-100'
							: 'text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100'
					)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	</div>

	<div class="space-y-3">
		<p class="text-sm text-surface-500 dark:text-surface-400">
			Total pengeluaran periode ini: <span class="font-semibold text-surface-900 dark:text-surface-100">{formatRupiah(total)}</span>
		</p>

		{#if series.length > 0}
			<div class="flex h-64 items-end gap-1">
				{#each series as point}
					<div class="group flex flex-1 flex-col items-center gap-1">
						<span class="text-xs text-surface-500 opacity-0 group-hover:opacity-100 dark:text-surface-400">
							{formatRupiah(point.amount)}
						</span>
						<div
							class="w-full rounded-t bg-primary-500 transition-all hover:bg-primary-600"
							style="height: {maxAmount > 0 ? (point.amount / maxAmount) * 100 : 0}%"
						></div>
						<span class="text-[10px] text-surface-500 dark:text-surface-400">{point.label}</span>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex h-64 items-center justify-center text-xs text-surface-500 dark:text-surface-400">
				Belum ada transaksi pengeluaran
			</div>
		{/if}
	</div>
</div>
