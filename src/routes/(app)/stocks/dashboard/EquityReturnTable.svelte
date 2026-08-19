<script lang="ts">
	import { Info } from '@lucide/svelte'
	import { formatDate, formatRupiah } from '$lib/utils/format'
	import { cn } from '$lib/utils'
	import PeriodSelect from './PeriodSelect.svelte'
	import type { EquityPoint, RangeKey, TradePeriodKey } from '$lib/hooks/useStockDashboard.svelte'
	import { filterByRange } from '$lib/hooks/useStockDashboard.svelte'

	type Granularity = 'daily' | 'monthly'

	let {
		points
	}: {
		points: EquityPoint[]
	} = $props()

	let granularity = $state<Granularity>('daily')
	let period = $state<TradePeriodKey>('1M')

	function toRangeKey(period: TradePeriodKey): RangeKey {
		return period === 'MTD' ? '1M' : period
	}

	function toMonthly(pts: EquityPoint[]): EquityPoint[] {
		const byMonth = new Map<string, EquityPoint>()
		for (const point of pts) {
			const monthKey = point.date.slice(0, 7)
			byMonth.set(monthKey, point)
		}
		const months = Array.from(byMonth.keys()).sort()
		let prevEquity = 0
		return months.map((month) => {
			const point = byMonth.get(month)!
			const pnl = point.equity - prevEquity
			const pnlPercent = prevEquity !== 0 ? (pnl / Math.abs(prevEquity)) * 100 : 0
			prevEquity = point.equity
			return { date: `${month}-01`, equity: point.equity, pnl, pnlPercent }
		})
	}

	const filtered = $derived(filterByRange(points, toRangeKey(period), new Date()))
	const rows = $derived(() => {
		const base = granularity === 'monthly' ? toMonthly(points) : filtered
		return [...base].reverse()
	})
</script>

<div class="flex flex-col gap-4 rounded-xl border border-surface-300 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
	<div class="flex items-center gap-2">
		<h3 class="text-sm font-medium text-surface-500 dark:text-surface-400">Total Equity Return</h3>
		<span class="text-surface-400" title="Dihitung dari mutasi dana dan transaksi tercatat (basis biaya perolehan)">
			<Info size={14} />
		</span>
	</div>

	<div class="flex flex-col gap-3">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<div class="inline-flex items-center gap-0.5 rounded-lg bg-surface-200 p-1 dark:bg-surface-700">
				<button
					type="button"
					onclick={() => (granularity = 'daily')}
					class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors {granularity === 'daily'
						? 'bg-surface-50 text-surface-900 shadow-sm dark:bg-surface-600 dark:text-surface-100'
						: 'text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100'}"
				>
					Daily
				</button>
				<button
					type="button"
					onclick={() => (granularity = 'monthly')}
					class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors {granularity === 'monthly'
						? 'bg-surface-50 text-surface-900 shadow-sm dark:bg-surface-600 dark:text-surface-100'
						: 'text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100'}"
				>
					Monthly
				</button>
			</div>
			<PeriodSelect value={period} onChange={(v) => (period = v)} />
		</div>

		<div class="max-h-[360px] overflow-y-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-surface-200 dark:border-surface-700">
						<th class="pb-2 text-left font-medium text-surface-500 dark:text-surface-400">Tanggal</th>
						<th class="pb-2 text-right font-medium text-surface-500 dark:text-surface-400">Equity</th>
						<th class="pb-2 text-right font-medium text-surface-500 dark:text-surface-400">P&L</th>
					</tr>
				</thead>
				<tbody>
					{#if rows().length === 0}
						<tr>
							<td colspan="3" class="py-6 text-center text-surface-500 dark:text-surface-400">
								Belum ada data pada periode ini
							</td>
						</tr>
					{/if}
					{#each rows() as row (row.date)}
						{@const isUp = row.pnl >= 0}
						<tr class="border-b border-surface-100 dark:border-surface-800">
							<td class="py-2 text-surface-500 dark:text-surface-400">{formatDate(row.date)}</td>
							<td class="py-2 text-right font-medium">{formatRupiah(row.equity)}</td>
							<td class="py-2 text-right {isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
								{isUp ? '+' : ''}{formatRupiah(row.pnl)} ({isUp ? '+' : ''}{row.pnlPercent.toFixed(2)}%)
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
