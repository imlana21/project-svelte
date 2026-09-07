<script lang="ts">
	import { formatRupiah } from '$lib/utils/format'
	import type { FinanceDebt } from '$lib/types/finance/Debt'
	import { buildUnpaidDebts } from '$lib/hooks/useFinanceDashboard.svelte'

	let { debts }: { debts: FinanceDebt[] } = $props()

	const rows = $derived(buildUnpaidDebts(debts, new Date()))
	const total = $derived(rows.reduce((sum, d) => sum + d.amount_per_month, 0))
</script>

<div class="rounded-xl border border-surface-300 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
	<div class="mb-4 flex items-center justify-between">
		<h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">Unpaid Debt</h3>
		<span class="inline-flex items-center rounded-full bg-surface-200 px-2 py-0.5 text-xs font-medium text-surface-700 dark:bg-surface-700 dark:text-surface-300">
			{rows.length} belum bayar
		</span>
	</div>

	<div class="space-y-3">
		<p class="text-sm text-surface-500 dark:text-surface-400">
			Total belum dibayar bulan ini: <span class="font-semibold text-surface-900 dark:text-surface-100">{formatRupiah(total)}</span>
		</p>

		{#if rows.length === 0}
			<p class="py-6 text-center text-sm text-surface-500 dark:text-surface-400">Semua cicilan bulan ini sudah lunas</p>
		{:else}
			<div class="divide-y divide-surface-200 dark:divide-surface-700">
				{#each rows as row}
					<div class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
						<div class="min-w-0 space-y-1">
							<p class="truncate text-sm font-medium text-surface-900 dark:text-surface-100">{row.name}</p>
							<p class="text-xs text-surface-500 dark:text-surface-400">{row.pocket?.name ?? '-'}</p>
						</div>
						<div class="shrink-0 text-right">
							<p class="text-sm font-semibold text-surface-900 dark:text-surface-100">{formatRupiah(row.amount_per_month)}</p>
							<p class="text-xs font-medium {row.isOverdue ? 'text-red-600 dark:text-red-400' : 'text-surface-500 dark:text-surface-400'}">
								{row.isOverdue
									? `Terlambat, jatuh tempo tgl ${row.due_date}`
									: row.dueInDays === 0
										? 'Jatuh tempo hari ini'
										: `Jatuh tempo ${row.dueInDays} hari lagi`}
							</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
