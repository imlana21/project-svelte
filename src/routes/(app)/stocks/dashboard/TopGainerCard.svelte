<script lang="ts">
	import { formatNumber, formatRupiah } from '$lib/utils/format'
	import type { TopGainer } from '$lib/hooks/useStockDashboard.svelte'

	let {
		topGainers
	}: {
		topGainers: TopGainer[]
	} = $props()
</script>

<div class="flex flex-col gap-4 rounded-xl border border-surface-300 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
	<div>
		<h3 class="text-sm font-medium text-surface-500 dark:text-surface-400">Top Gainer (Rp)</h3>
	</div>

	<table class="w-full text-sm">
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
</div>
