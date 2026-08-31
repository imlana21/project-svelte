<script lang="ts">
	import AppDialog from "$lib/components/ui/AppDialog.svelte";
	import { formatDate, formatNumber, formatRupiah } from "$lib/utils/format";
	import type { RealizedPnL } from "$lib/types/Stock";

	interface Props {
		open: boolean;
		item: RealizedPnL | undefined;
		onOpenChange: (open: boolean) => void;
	}

	let { open, item, onOpenChange }: Props = $props();
</script>

<AppDialog {open} {onOpenChange} title="Detail Realized PnL">
	{#if item}
		<div class="flex flex-col gap-4">
			<div
				class="rounded-lg border border-surface-300 p-4 dark:border-surface-700"
			>
				<h4
					class="mb-2 text-sm font-semibold text-surface-500 dark:text-surface-400"
				>
					Informasi Transaksi
				</h4>
				<div class="divide-y divide-surface-200 dark:divide-surface-700">
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400"
							>Tanggal</span
						>
						<span class="text-sm font-medium">{formatDate(item.date)}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400"
							>Tipe</span
						>
						<span class="badge capitalize">{item.type}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400"
							>Harga</span
						>
						<span class="text-sm font-medium">{formatRupiah(item.price)}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400"
							>Lot</span
						>
						<span class="text-sm font-medium">{formatNumber(item.lot)}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400"
							>Fee</span
						>
						<span class="text-sm font-medium">{formatRupiah(item.fee)}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400"
							>Realized PnL</span
						>
						<span
							class="text-sm font-bold {item.realized_pnl >= 0
								? 'text-success-600 dark:text-success-400'
								: 'text-error-600 dark:text-error-400'}"
						>
							{formatRupiah(item.realized_pnl)}
						</span>
					</div>
				</div>
			</div>

			{#if item.position}
				<div
					class="rounded-lg border border-surface-300 p-4 dark:border-surface-700"
				>
					<h4
						class="mb-2 text-sm font-semibold text-surface-500 dark:text-surface-400"
					>
						Informasi Posisi
					</h4>
					<div class="divide-y divide-surface-200 dark:divide-surface-700">
						<div class="flex items-center justify-between py-2">
							<span class="text-sm text-surface-500 dark:text-surface-400"
								>Emiten</span
							>
							<span class="badge">{item.position.emiten?.ticker ?? "-"}</span>
						</div>
						<div class="flex items-center justify-between py-2">
							<span class="text-sm text-surface-500 dark:text-surface-400"
								>Sekuritas</span
							>
							<span class="text-sm font-medium"
								>{item.position.sekuritas?.name ?? "-"}</span
							>
						</div>
						<div class="flex items-center justify-between py-2">
							<span class="text-sm text-surface-500 dark:text-surface-400"
								>Trend</span
							>
							<span class="badge capitalize">{item.position.trend}</span>
						</div>
						<div class="flex items-center justify-between py-2">
							<span class="text-sm text-surface-500 dark:text-surface-400"
								>Avg Price</span
							>
							<span class="text-sm font-medium"
								>{formatRupiah(item.position.avg_price)}</span
							>
						</div>
						<div class="flex items-center justify-between py-2">
							<span class="text-sm text-surface-500 dark:text-surface-400"
								>Lot Posisi</span
							>
							<span class="text-sm font-medium"
								>{formatNumber(item.position.lot)}</span
							>
						</div>
						<div class="flex items-center justify-between py-2">
							<span class="text-sm text-surface-500 dark:text-surface-400"
								>Tanggal Buka</span
							>
							<span class="text-sm font-medium"
								>{formatDate(item.position.open_date)}</span
							>
						</div>
						{#if item.position.close_date}
							<div class="flex items-center justify-between py-2">
								<span class="text-sm text-surface-500 dark:text-surface-400"
									>Tanggal Tutup</span
								>
								<span class="text-sm font-medium"
									>{formatDate(item.position.close_date)}</span
								>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</AppDialog>
