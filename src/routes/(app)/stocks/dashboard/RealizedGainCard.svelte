<script lang="ts">
	import { formatDate, formatRupiah } from '$lib/utils/format'
	import { cn } from '$lib/utils'
	import type { RealizedGainSummary } from '$lib/hooks/useStockDashboard.svelte'

	let {
		summary,
		periodLabel
	}: {
		summary: RealizedGainSummary
		periodLabel: string
	} = $props()

	const isUp = $derived(summary.total >= 0)

	const chartPoints = $derived(
		summary.series.length > 1
			? summary.series.map((p, i) => ({ x: i, y: p.cumulative }))
			: []
	)

	const svgPath = $derived(() => {
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

<div class="flex flex-col gap-4 rounded-xl border border-surface-300 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
	<div>
		<h3 class="text-sm font-medium text-surface-500 dark:text-surface-400">Total Realized Gain</h3>
	</div>

	<div class="flex flex-col gap-4">
		<div>
			<p class="text-2xl font-bold {isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
				{isUp ? '+' : ''}{formatRupiah(summary.total)}
			</p>
			<p class="text-xs text-surface-500 dark:text-surface-400">{periodLabel}</p>
		</div>

		<div class="h-[190px]">
			{#if summary.series.length > 1}
				<svg viewBox="0 0 100 100" class="h-full w-full" preserveAspectRatio="none">
					<defs>
						<linearGradient id="realizedGainFill" x1="0" y1="0" x2="0" y2="1">
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
						d={svgPath()}
						fill="none"
						stroke={isUp ? 'var(--color-green-500)' : 'var(--color-red-500)'}
						stroke-width="0.5"
						vector-effect="non-scaling-stroke"
					/>
				</svg>
			{:else}
				<div class="flex h-full items-center justify-center text-xs text-surface-500 dark:text-surface-400">
					Belum ada transaksi jual pada periode ini
				</div>
			{/if}
		</div>

		<hr class="border-surface-200 dark:border-surface-700" />

		<div class="space-y-2 text-sm">
			<div class="flex items-center justify-between">
				<span class="text-surface-500 dark:text-surface-400">Total Stocks Realized Gain</span>
				<span class="font-medium {isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
					{isUp ? '+' : ''}{formatRupiah(summary.total)}
				</span>
			</div>
			<div class="flex items-center justify-between pl-3">
				<span class="text-surface-500 dark:text-surface-400">Realized Gain</span>
				<span class="font-medium text-green-600 dark:text-green-400">{formatRupiah(summary.gain)}</span>
			</div>
			<div class="flex items-center justify-between pl-3">
				<span class="text-surface-500 dark:text-surface-400">Realized Loss</span>
				<span class="font-medium text-red-600 dark:text-red-400">{formatRupiah(summary.loss)}</span>
			</div>
		</div>
	</div>
</div>
