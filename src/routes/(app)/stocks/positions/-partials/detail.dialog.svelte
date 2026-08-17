<script lang="ts">
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import { formatDate, formatRupiah } from '$lib/utils/format';
	import type { StockPosition } from '$lib/types/Stock';

	interface Props {
		open: boolean;
		item: StockPosition | undefined;
		onOpenChange: (open: boolean) => void;
	}

	let { open, item, onOpenChange }: Props = $props();
</script>

<AppDialog {open} {onOpenChange} title="Detail Posisi">
	{#if item}
		<div class="flex flex-col gap-4">
			<div class="rounded-lg border border-surface-300 p-4 dark:border-surface-700">
				<h4 class="mb-2 text-sm font-semibold text-surface-500 dark:text-surface-400">Informasi Emiten</h4>
				<div class="divide-y divide-surface-200 dark:divide-surface-700">
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Ticker</span>
						<span class="badge">{item.emiten?.ticker ?? '-'}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Perusahaan</span>
						<span class="text-sm font-medium">{item.emiten?.name ?? '-'}</span>
					</div>
				</div>
			</div>

			<div class="rounded-lg border border-surface-300 p-4 dark:border-surface-700">
				<h4 class="mb-2 text-sm font-semibold text-surface-500 dark:text-surface-400">Informasi Posisi</h4>
				<div class="divide-y divide-surface-200 dark:divide-surface-700">
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Sekuritas</span>
						<span class="text-sm font-medium">{item.sekuritas?.name ?? '-'}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Lot</span>
						<span class="text-sm font-medium">{item.lot}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Harga Rata-rata</span>
						<span class="text-sm font-medium">{formatRupiah(item.avg_price)}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Status</span>
						<StatusBadge value={item.status === 'open'} trueLabel="Open" falseLabel="Closed" />
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Tanggal Buka</span>
						<span class="text-sm font-medium">{formatDate(item.open_date)}</span>
					</div>
					{#if item.close_date}
						<div class="flex items-center justify-between py-2">
							<span class="text-sm text-surface-500 dark:text-surface-400">Tanggal Tutup</span>
							<span class="text-sm font-medium">{formatDate(item.close_date)}</span>
						</div>
					{/if}
				</div>
			</div>

			<div class="rounded-lg border border-surface-300 p-4 dark:border-surface-700">
				<h4 class="mb-2 text-sm font-semibold text-surface-500 dark:text-surface-400">Informasi Analisis</h4>
				<div class="divide-y divide-surface-200 dark:divide-surface-700">
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Plan SL</span>
						<span class="text-sm font-medium">{formatRupiah(item.plan_sl)}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Plan TP</span>
						<span class="text-sm font-medium">{formatRupiah(item.plan_tp)}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Trend</span>
						<span class="badge capitalize">{item.trend}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Quadrant</span>
						<span class="badge capitalize">{item.quadrant}</span>
					</div>
					{#if item.note}
						<div class="flex items-center justify-between gap-4 py-2">
							<span class="text-sm text-surface-500 dark:text-surface-400">Catatan</span>
							<span class="text-right text-sm font-medium">{item.note}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</AppDialog>
