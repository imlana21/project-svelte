<script lang="ts">
	import { fade } from 'svelte/transition'
	import PeriodTabs from './PeriodTabs.svelte'
	import type { RangeKey, ReturnPoint } from '$lib/hooks/useStockDashboard.svelte'

	let {
		points,
		range,
		onRangeChange,
		loading = false
	}: {
		points: ReturnPoint[]
		range: RangeKey
		onRangeChange: (v: RangeKey) => void
		loading?: boolean
	} = $props()

	const last = $derived(points[points.length - 1])
	const returnPercent = $derived(last?.returnPercent ?? 0)
	const isUp = $derived(returnPercent >= 0)

	const chartPoints = $derived(
		points.length > 1
			? points.map((p, i) => ({ x: i, y: p.returnPercent }))
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
	<div class="flex items-center justify-between">
		<h3 class="text-sm font-medium text-surface-500 dark:text-surface-400">Cumulative Portfolio Return</h3>
	</div>

	{#if loading}
		<div class="space-y-4" in:fade={{ duration: 200 }}>
			<div class="flex items-center gap-2">
				<div class="skeleton-shimmer h-2.5 w-2.5 rounded-full bg-surface-200 dark:bg-surface-700"></div>
				<div class="skeleton-shimmer h-4 w-20 rounded bg-surface-200 dark:bg-surface-700"></div>
				<div class="skeleton-shimmer h-4 w-16 rounded bg-surface-200 dark:bg-surface-700"></div>
			</div>
			<div class="skeleton-shimmer h-[150px] w-full rounded bg-surface-200 dark:bg-surface-700"></div>
			<div class="flex gap-2">
				{#each { length: 6 } as _}
					<div class="skeleton-shimmer h-7 w-10 rounded bg-surface-200 dark:bg-surface-700"></div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="space-y-4" in:fade={{ duration: 300 }}>
			<div class="flex items-center gap-2">
				<span class="h-2.5 w-2.5 rounded-full" style="background-color: var(--color-secondary)"></span>
				<span class="text-sm text-surface-500 dark:text-surface-400">Portfolio</span>
				<span class="text-sm font-semibold {isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
					{isUp ? '+' : ''}{returnPercent.toFixed(2)}%
				</span>
			</div>

			<div class="h-[150px]">
				{#if points.length > 1}
					<svg viewBox="0 0 100 100" class="h-full w-full" preserveAspectRatio="none">
						<path
							d={svgPath}
							fill="none"
							stroke="var(--color-secondary)"
							stroke-width="0.5"
							vector-effect="non-scaling-stroke"
						/>
					</svg>
				{:else}
					<div class="flex h-full items-center justify-center text-xs text-surface-500 dark:text-surface-400">
						Data belum cukup untuk menghitung return
					</div>
				{/if}
			</div>

			<PeriodTabs value={range} onChange={onRangeChange} />
		</div>
	{/if}
</div>
