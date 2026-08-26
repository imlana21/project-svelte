<script lang="ts">
	import { formatDate, formatRupiah } from '$lib/utils/format'
	import type { FinanceTransaction, FinanceTransactionType } from '$lib/types/finance/Transaction'

	let {
		transactions,
		limit = 8
	}: {
		transactions: FinanceTransaction[]
		limit?: number
	} = $props()

	const TYPE_LABEL: Record<FinanceTransactionType, string> = {
		income: 'Income',
		expense: 'Expense',
		debt_payment: 'Debt Payment',
		transfer: 'Transfer'
	}

	const TYPE_COLOR: Record<FinanceTransactionType, string> = {
		income: 'bg-green-500',
		expense: 'bg-red-500',
		debt_payment: 'bg-orange-500',
		transfer: 'bg-blue-500'
	}

	const AMOUNT_SIGN: Record<FinanceTransactionType, '+' | '-'> = {
		income: '+',
		expense: '-',
		debt_payment: '-',
		transfer: '-'
	}

	const rows = $derived(
		[...transactions]
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, limit)
	)
</script>

<div class="rounded-xl border border-surface-300 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
	<div class="mb-4">
		<h3 class="text-sm font-medium text-surface-500 dark:text-surface-400">Recent Transactions</h3>
	</div>

	{#if rows.length === 0}
		<p class="py-6 text-center text-sm text-surface-500 dark:text-surface-400">Belum ada transaksi</p>
	{:else}
		<div class="divide-y divide-surface-200 dark:divide-surface-700">
			{#each rows as row}
				{@const isPositive = AMOUNT_SIGN[row.type] === '+'}
				<div class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
					<div class="min-w-0 space-y-1">
						<div class="flex items-center gap-2">
							<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white {TYPE_COLOR[row.type]}">
								{TYPE_LABEL[row.type]}
							</span>
							{#if row.category_tag}
								<span class="inline-flex items-center rounded-full bg-surface-200 px-2 py-0.5 text-xs font-medium text-surface-700 dark:bg-surface-700 dark:text-surface-300">
									{row.category_tag}
								</span>
							{/if}
						</div>
						<p class="truncate text-sm font-medium text-surface-900 dark:text-surface-100">{row.description}</p>
						<p class="text-xs text-surface-500 dark:text-surface-400">
							{formatDate(row.date)} &middot; {row.pocket?.name ?? '-'}
						</p>
					</div>
					<span class="shrink-0 text-sm font-semibold {isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
						{AMOUNT_SIGN[row.type]}{formatRupiah(row.amount)}
					</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
