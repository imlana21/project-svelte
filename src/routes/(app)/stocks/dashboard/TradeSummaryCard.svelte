<script lang="ts">
	import { formatNumber, formatRupiah } from '$lib/utils/format'
	import type { TradeSummary } from '$lib/hooks/useStockDashboard.svelte'

	let {
		summary
	}: {
		summary: TradeSummary
	} = $props()

	const gaugeData = $derived([
		{ key: 'wins', value: summary.wins, color: 'var(--color-green-500)' },
		{ key: 'losses', value: summary.losses || (summary.wins === 0 ? 1 : 0), color: 'var(--color-surface-300)' }
	])

	const winsPercent = $derived(summary.wins > 0 ? (summary.wins / (summary.wins + summary.losses)) * 100 : 0)
	const lossesPercent = $derived(100 - winsPercent)
</script>

<div class="flex flex-col gap-4 rounded-xl border border-surface-300 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
	<div>
		<h3 class="text-sm font-medium text-surface-500 dark:text-surface-400">Trade Summary</h3>
	</div>

	<div class="flex flex-col gap-4">
		<div class="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-6">
			<div class="relative h-[130px] w-[150px] shrink-0">
				<svg viewBox="0 0 36 36" class="h-full w-full">
					<circle
						cx="18"
						cy="18"
						r="15.91549430918954"
						fill="none"
						stroke="var(--color-surface-300)"
						stroke-width="3"
						stroke-dasharray="100 100"
						stroke-dashoffset="0"
						transform="rotate(-90 18 18)"
					/>
					<circle
						cx="18"
						cy="18"
						r="15.91549430918954"
						fill="none"
						stroke="var(--color-green-500)"
						stroke-width="3"
						stroke-dasharray="{winsPercent} {lossesPercent}"
						stroke-dashoffset="0"
						transform="rotate(-90 18 18)"
					/>
				</svg>
				<div class="absolute inset-0 flex flex-col items-center justify-center pt-2">
					<span class="text-xl font-bold text-surface-900 dark:text-surface-100">{summary.totalTrades}</span>
					<span class="text-xs text-surface-500 dark:text-surface-400">Trades</span>
				</div>
				<div class="mt-1 flex justify-center gap-3 text-xs text-surface-500 dark:text-surface-400">
					<span>{summary.wins} Wins</span>
					<span>{summary.losses} Losses</span>
				</div>
			</div>

			<div class="text-center sm:text-left">
				<p class="text-xs text-surface-500 dark:text-surface-400">Win Rate</p>
				<p class="text-2xl font-bold text-green-600 dark:text-green-400">{summary.winRate.toFixed(2)}%</p>
			</div>
		</div>

		<hr class="border-surface-200 dark:border-surface-700" />

		<div class="grid grid-cols-2 gap-y-3 text-sm">
			<div>
				<p class="text-xs text-surface-500 dark:text-surface-400">Total Transaction Value</p>
				<p class="font-medium text-surface-900 dark:text-surface-100">{formatRupiah(summary.totalTransactionValue)}</p>
			</div>
			<div>
				<p class="text-xs text-surface-500 dark:text-surface-400">Total Orders</p>
				<p class="font-medium text-surface-900 dark:text-surface-100">{formatNumber(summary.totalOrders)}</p>
			</div>
		</div>

		<hr class="border-surface-200 dark:border-surface-700" />

		<div class="grid grid-cols-2 gap-4 text-sm">
			<div class="space-y-2">
				<p class="font-medium text-surface-900 dark:text-surface-100">Profit</p>
				<div>
					<p class="text-xs text-surface-500 dark:text-surface-400">Max Profit</p>
					<p class="font-medium text-green-600 dark:text-green-400">{formatRupiah(summary.maxProfit)}</p>
				</div>
				<div>
					<p class="text-xs text-surface-500 dark:text-surface-400">Max Profit %</p>
					<p class="font-medium text-green-600 dark:text-green-400">+{summary.maxProfitPercent.toFixed(2)}%</p>
				</div>
				<div>
					<p class="text-xs text-surface-500 dark:text-surface-400">Avg Profit</p>
					<p class="font-medium text-green-600 dark:text-green-400">{formatRupiah(summary.avgProfit)}</p>
				</div>
			</div>
			<div class="space-y-2">
				<p class="font-medium text-surface-900 dark:text-surface-100">Loss</p>
				<div>
					<p class="text-xs text-surface-500 dark:text-surface-400">Max Loss</p>
					<p class="font-medium {summary.maxLoss < 0 ? 'text-red-600 dark:text-red-400' : 'text-surface-900 dark:text-surface-100'}">
						{formatRupiah(summary.maxLoss)}
					</p>
				</div>
				<div>
					<p class="text-xs text-surface-500 dark:text-surface-400">Max Loss %</p>
					<p class="font-medium {summary.maxLossPercent < 0 ? 'text-red-600 dark:text-red-400' : 'text-surface-900 dark:text-surface-100'}">
						{summary.maxLossPercent.toFixed(2)}%
					</p>
				</div>
				<div>
					<p class="text-xs text-surface-500 dark:text-surface-400">Avg Loss</p>
					<p class="font-medium {summary.avgLoss < 0 ? 'text-red-600 dark:text-red-400' : 'text-surface-900 dark:text-surface-100'}">
						{formatRupiah(summary.avgLoss)}
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
