<script lang="ts">
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import { formatRupiah } from '$lib/utils/format';
	import type { FinanceIncomeDistribution } from '$lib/types/finance/IncomeDistribution';

	interface Props {
		open: boolean;
		item: FinanceIncomeDistribution | undefined;
		onOpenChange: (open: boolean) => void;
	}

	let { open, item, onOpenChange }: Props = $props();
</script>

<AppDialog {open} {onOpenChange} title="Detail Distribusi Pemasukan">
	{#if item}
		<div class="flex flex-col gap-4">
			<div class="rounded-lg border border-surface-300 p-4 dark:border-surface-700">
				<h4 class="mb-2 text-sm font-semibold text-surface-500 dark:text-surface-400">Informasi Pemasukan</h4>
				<div class="divide-y divide-surface-200 dark:divide-surface-700">
					{#if item.income}
						<div class="flex items-center justify-between py-2">
							<span class="text-sm text-surface-500 dark:text-surface-400">Periode</span>
							<span class="text-sm font-medium">{new Date(item.income.period).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
						</div>
						<div class="flex items-center justify-between py-2">
							<span class="text-sm text-surface-500 dark:text-surface-400">Sumber</span>
							<span class="text-sm font-medium">{item.income.source || '-'}</span>
						</div>
						<div class="flex items-center justify-between py-2">
							<span class="text-sm text-surface-500 dark:text-surface-400">Total Pemasukan</span>
							<span class="text-sm font-bold">{formatRupiah(item.income.amount)}</span>
						</div>
					{/if}
				</div>
			</div>

			<div class="rounded-lg border border-surface-300 p-4 dark:border-surface-700">
				<h4 class="mb-2 text-sm font-semibold text-surface-500 dark:text-surface-400">Informasi Distribusi</h4>
				<div class="divide-y divide-surface-200 dark:divide-surface-700">
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Pocket</span>
						<span class="text-sm font-medium">{item.pocket?.name ?? '-'}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Kategori</span>
						<span class="badge bg-primary-500 text-primary-contrast-500">{item.category_name}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Persentase</span>
						<span class="text-sm font-medium">{(item.percentage_snapshot * 100).toFixed(1)}%</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Jumlah</span>
						<span class="text-sm font-bold">{formatRupiah(item.amount)}</span>
					</div>
				</div>
			</div>
		</div>
	{/if}
</AppDialog>
