<script lang="ts">
	import { formatRupiah, formatNumber } from '$lib/utils/format'
	import type { FinancePocket } from '$lib/types/finance/Pocket'

	let { pockets }: { pockets: FinancePocket[] } = $props()

	const CHART_PALETTE = [
		'var(--color-primary)',
		'var(--color-secondary)',
		'#f97316',
		'#8b5cf6',
		'#06b6d4'
	]

	const active = $derived(pockets.filter((p) => p.is_active))
	const total = $derived(active.reduce((sum, p) => sum + p.balance, 0))
</script>

<div class="rounded-xl border border-surface-300 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
	<div class="mb-4 flex items-center justify-between">
		<h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">Pocket List</h3>
		<span class="inline-flex items-center rounded-full bg-surface-200 px-2 py-0.5 text-xs font-medium text-surface-700 dark:bg-surface-700 dark:text-surface-300">
			{active.length} pocket
		</span>
	</div>

	<div class="space-y-4">
		{#if active.length === 0}
			<p class="py-6 text-center text-sm text-surface-500 dark:text-surface-400">Belum ada pocket aktif</p>
		{:else}
			{#each active.slice().sort((a, b) => b.balance - a.balance) as pocket, index}
				{@const percent = total > 0 ? (pocket.balance / total) * 100 : 0}
				{@const color = CHART_PALETTE[index % CHART_PALETTE.length]}
				<div class="space-y-1.5">
					<div class="flex items-center justify-between gap-2">
						<span class="truncate text-sm font-medium text-surface-900 dark:text-surface-100">{pocket.name}</span>
						<span class="shrink-0 text-sm font-semibold text-surface-900 dark:text-surface-100">
							{formatRupiah(pocket.balance)}
						</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="h-1.5 flex-1 rounded-full bg-surface-200 dark:bg-surface-700">
							<div
								class="h-1.5 rounded-full"
								style="width: {Math.min(100, percent)}%; background-color: {color}"
							></div>
						</div>
						<span class="w-12 shrink-0 text-right text-xs text-surface-500 dark:text-surface-400">
							{formatNumber(Number(percent.toFixed(1)))}%
						</span>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
