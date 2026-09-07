<script lang="ts">
	import { fade } from 'svelte/transition'
	import { formatNumber, formatRupiah } from '$lib/utils/format'
	import type { StockPosition } from '$lib/types/Stock'
	import type { AllocationMode } from '$lib/hooks/useStockDashboard.svelte'
	import { buildAllocation, initialsOf } from '$lib/hooks/useStockDashboard.svelte'

	let {
		positions,
		loading = false
	}: {
		positions: StockPosition[]
		loading?: boolean
	} = $props()

	let mode = $state<AllocationMode>('stock')

	const slices = $derived(buildAllocation(positions, mode))
	const total = $derived(slices.reduce((sum, s) => sum + s.value, 0))
	const openCount = $derived(positions.filter((p) => !p.close_date).length)
</script>

<div class="flex flex-col gap-4 rounded-xl border border-surface-300 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
	<div>
		<h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">Portfolio Allocation</h3>
	</div>

	{#if loading}
		<div class="flex flex-col gap-4" in:fade={{ duration: 200 }}>
			<div class="flex gap-1">
				<div class="skeleton-shimmer h-7 w-16 rounded-md bg-surface-200 dark:bg-surface-700"></div>
				<div class="skeleton-shimmer h-7 w-20 rounded-md bg-surface-200 dark:bg-surface-700"></div>
			</div>
			<div class="flex items-center justify-center">
				<div class="skeleton-shimmer h-32 w-32 rounded-full bg-surface-200 dark:bg-surface-700"></div>
			</div>
			<div class="flex flex-col gap-3">
				{#each { length: 3 } as _}
					<div class="flex items-center gap-3">
						<div class="skeleton-shimmer h-8 w-8 shrink-0 rounded-full bg-surface-200 dark:bg-surface-700"></div>
						<div class="flex flex-1 flex-col gap-1">
							<div class="flex justify-between">
								<div class="skeleton-shimmer h-4 w-16 rounded bg-surface-200 dark:bg-surface-700"></div>
								<div class="skeleton-shimmer h-4 w-20 rounded bg-surface-200 dark:bg-surface-700"></div>
							</div>
							<div class="skeleton-shimmer h-1.5 w-full rounded-full bg-surface-200 dark:bg-surface-700"></div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="flex flex-col gap-4" in:fade={{ duration: 300 }}>
			<div class="inline-flex items-center gap-0.5 rounded-lg bg-surface-200 p-1 dark:bg-surface-700">
				<button
					type="button"
					onclick={() => (mode = 'stock')}
					class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors {mode === 'stock'
						? 'bg-surface-50 text-surface-900 shadow-sm dark:bg-surface-600 dark:text-surface-100'
						: 'text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100'}"
				>
					Stocks
				</button>
				<button
					type="button"
					onclick={() => (mode = 'sector')}
					class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors {mode === 'sector'
						? 'bg-surface-50 text-surface-900 shadow-sm dark:bg-surface-600 dark:text-surface-100'
						: 'text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100'}"
				>
					Sub-Sector
				</button>
			</div>

			<div class="relative h-[190px]">
				{#if slices.length > 0}
					<div class="flex h-full items-center justify-center">
						<div class="relative h-32 w-32">
							<svg viewBox="0 0 36 36" class="h-full w-full">
								{#each slices as slice, i}
									{@const offset = slices.slice(0, i).reduce((sum, s) => sum + s.percent, 0)}
									<circle
										cx="18"
										cy="18"
										r="15.91549430918954"
										fill="none"
										stroke={slice.color}
										stroke-width="3"
										stroke-dasharray="{slice.percent} {100 - slice.percent}"
										stroke-dashoffset={-offset}
										transform="rotate(-90 18 18)"
									/>
								{/each}
							</svg>
							<div class="absolute inset-0 flex flex-col items-center justify-center">
								<span class="text-lg font-bold text-surface-900 dark:text-surface-100">{formatRupiah(total)}</span>
								<span class="text-xs text-surface-500 dark:text-surface-400">{openCount} Stocks</span>
							</div>
						</div>
					</div>
				{:else}
					<div class="flex h-full items-center justify-center text-xs text-surface-500 dark:text-surface-400">
						Belum ada posisi terbuka
					</div>
				{/if}
			</div>

			<div class="space-y-3">
				{#each slices as slice}
					<div class="flex items-center gap-3">
						<div
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
							style="background-color: {slice.color}"
						>
							{initialsOf(slice.label)}
						</div>
						<div class="min-w-0 flex-1">
							<div class="flex items-center justify-between gap-2">
								<span class="truncate text-sm font-medium text-surface-900 dark:text-surface-100">{slice.label}</span>
								<span class="text-sm font-medium text-surface-900 dark:text-surface-100">{formatRupiah(slice.value)}</span>
							</div>
							<div class="mt-1 flex items-center gap-2">
								<div class="h-1.5 flex-1 rounded-full bg-surface-200 dark:bg-surface-700">
									<div
										class="h-1.5 rounded-full"
										style="width: {Math.min(100, slice.percent)}%; background-color: {slice.color}"
									></div>
								</div>
								<span class="w-14 shrink-0 text-right text-xs text-surface-500 dark:text-surface-400">
									{formatNumber(Number(slice.percent.toFixed(2)))}%
								</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
