<script lang="ts">
	import { fade } from 'svelte/transition'
	import { formatRupiah } from '$lib/utils/format'
	import PeriodTabs from './PeriodTabs.svelte'
	import type { EquityPoint, RangeKey } from '$lib/hooks/useStockDashboard.svelte'

	let {
		points,
		currentEquity,
		range,
		onRangeChange,
		loading = false
	}: {
		points: EquityPoint[]
		currentEquity: number
		range: RangeKey
		onRangeChange: (v: RangeKey) => void
		loading?: boolean
	} = $props()

	const last = $derived(points[points.length - 1])
	const first = $derived(points[0])
	const periodPnl = $derived(last && first ? last.equity - first.equity : 0)
	const isUp = $derived(periodPnl >= 0)

	const chartPoints = $derived(
		points.length > 1
			? points.map((p, i) => ({ x: i, y: p.equity }))
			: []
	)

	const svgPath = $derived.by(() => {
		if (chartPoints.length < 2) return ''
		const minY = Math.min(...chartPoints.map((p) => p.y))
		const maxY = Math.max(...chartPoints.map((p) => p.y))
		const range = maxY - minY || 1
		const width = 100
		const height = 100
		const padding = 5

		return chartPoints
			.map((p, i) => {
				const x = padding + (i / (chartPoints.length - 1)) * (width - padding * 2)
				const y = height - padding - ((p.y - minY) / range) * (height - padding * 2)
				return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
			})
			.join(' ')
	})
</script>

<div class="flex flex-1 flex-col gap-4 rounded-xl border border-surface-300 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
	<div>
		<h3 class="text-sm font-medium text-surface-500 dark:text-surface-400">Total Equity</h3>
	</div>

	{#if loading}
		<div class="space-y-4" in:fade={{ duration: 200 }}>
			<div class="flex flex-col gap-2">
				<div class="skeleton-shimmer h-8 w-40 rounded bg-surface-200 dark:bg-surface-700"></div>
				<div class="skeleton-shimmer h-4 w-32 rounded bg-surface-200 dark:bg-surface-700"></div>
			</div>
			<div class="skeleton-shimmer h-[180px] w-full rounded bg-surface-200 dark:bg-surface-700"></div>
			<div class="flex gap-2">
				{#each { length: 6 } as _}
					<div class="skeleton-shimmer h-7 w-10 rounded bg-surface-200 dark:bg-surface-700"></div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="space-y-4" in:fade={{ duration: 300 }}>
			<div>
				<div class="text-2xl font-bold tracking-tight text-surface-900 md:text-3xl dark:text-surface-100">
					{formatRupiah(currentEquity)}
				</div>
				{#if points.length > 1}
					<p class="mt-1 text-xs font-medium {isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
						{isUp ? '+' : ''}{formatRupiah(periodPnl)} pada periode ini
					</p>
				{/if}
			</div>

			<div class="h-[180px]">
				{#if points.length > 1}
					<svg viewBox="0 0 100 100" class="h-full w-full" preserveAspectRatio="none">
						<defs>
							<linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stop-color={isUp ? 'var(--color-green-500)' : 'var(--color-red-500)'}
									stop-opacity="0.35"
								/>
								<stop
									offset="100%"
									stop-color={isUp ? 'var(--color-green-500)' : 'var(--color-red-500)'}
									stop-opacity="0"
								/>
							</linearGradient>
						</defs>
						<path
							d={svgPath}
							fill="none"
							stroke={isUp ? 'var(--color-green-500)' : 'var(--color-red-500)'}
							stroke-width="0.5"
							vector-effect="non-scaling-stroke"
						/>
					</svg>
				{:else}
					<div class="flex h-full items-center justify-center text-xs text-surface-500 dark:text-surface-400">
						Belum ada riwayat mutasi dana atau transaksi pada periode ini
					</div>
				{/if}
			</div>

			<PeriodTabs value={range} onChange={onRangeChange} />
		</div>
	{/if}
</div>
