<script lang="ts">
	import { fade } from 'svelte/transition'
	import { formatNumber, formatRupiah } from '$lib/utils/format'
	import type { TopGainer } from '$lib/hooks/useStockDashboard.svelte'

	let {
		topGainers,
		loading = false
	}: {
		topGainers: TopGainer[]
		loading?: boolean
	} = $props()
</script>

<div class="flex flex-col gap-4 rounded-xl border border-surface-300 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
	<div>
		<h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">Top Gainer (Rp)</h3>
	</div>

	{#if loading}
		<div class="flex flex-col gap-2" in:fade={{ duration: 200 }}>
			<div class="flex justify-between">
				<div class="skeleton-shimmer h-4 w-16 rounded bg-surface-200 dark:bg-surface-700"></div>
				<div class="skeleton-shimmer h-4 w-12 rounded bg-surface-200 dark:bg-surface-700"></div>
				<div class="skeleton-shimmer h-4 w-20 rounded bg-surface-200 dark:bg-surface-700"></div>
			</div>
			{#each { length: 5 } as _}
				<div class="flex justify-between py-2">
					<div class="skeleton-shimmer h-5 w-14 rounded-full bg-surface-200 dark:bg-surface-700"></div>
					<div class="skeleton-shimmer h-4 w-8 rounded bg-surface-200 dark:bg-surface-700"></div>
					<div class="skeleton-shimmer h-4 w-24 rounded bg-surface-200 dark:bg-surface-700"></div>
				</div>
			{/each}
		</div>
	{:else}
		<table class="w-full text-sm" in:fade={{ duration: 300 }}>
			<thead>
				<tr class="border-b border-surface-200 dark:border-surface-700">
					<th class="pb-2 text-left font-medium text-surface-500 dark:text-surface-400">Code</th>
					<th class="pb-2 text-right font-medium text-surface-500 dark:text-surface-400">Trades</th>
					<th class="pb-2 text-right font-medium text-surface-500 dark:text-surface-400">P&L</th>
				</tr>
			</thead>
			<tbody>
				{#if topGainers.length === 0}
					<tr>
						<td colspan="3" class="py-6 text-center text-surface-500 dark:text-surface-400">
							Belum ada transaksi jual pada periode ini
						</td>
					</tr>
				{/if}
				{#each topGainers as row}
					{@const isUp = row.pnl >= 0}
					<tr class="border-b border-surface-100 dark:border-surface-800">
						<td class="py-2">
							<span class="inline-flex items-center rounded-full bg-surface-200 px-2 py-0.5 text-xs font-semibold dark:bg-surface-700">
								{row.ticker}
							</span>
						</td>
						<td class="py-2 text-right">{formatNumber(row.trades)}</td>
						<td class="py-2 text-right font-medium {isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
							{isUp ? '+' : ''}{formatRupiah(row.pnl)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
