<script lang="ts">
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import { formatDate } from '$lib/utils/format';
	import type { StockAnalysis } from '$lib/types/Stock';

	interface Props {
		open: boolean;
		item: StockAnalysis | undefined;
		onOpenChange: (open: boolean) => void;
	}

	let { open, item, onOpenChange }: Props = $props();
</script>

<AppDialog {open} {onOpenChange} title="Detail Analisis">
	{#if item}
		<div class="flex flex-col gap-4">
			{#if item.image}
				<div class="overflow-hidden rounded-lg border border-surface-300 dark:border-surface-700">
					<img src={item.image} alt="Analisis {item.ticker}" class="w-full object-cover" />
				</div>
			{/if}

			<div class="rounded-lg border border-surface-300 p-4 dark:border-surface-700">
				<h4 class="mb-2 text-sm font-semibold text-surface-500 dark:text-surface-400">Informasi Emiten</h4>
				<div class="divide-y divide-surface-200 dark:divide-surface-700">
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Ticker</span>
						<span class="badge">{item.ticker}</span>
					</div>
					{#if item.emiten}
						<div class="flex items-center justify-between py-2">
							<span class="text-sm text-surface-500 dark:text-surface-400">Nama Perusahaan</span>
							<span class="text-sm font-medium">{item.emiten.name}</span>
						</div>
					{/if}
				</div>
			</div>

			<div class="rounded-lg border border-surface-300 p-4 dark:border-surface-700">
				<h4 class="mb-2 text-sm font-semibold text-surface-500 dark:text-surface-400">Informasi Harga</h4>
				<div class="divide-y divide-surface-200 dark:divide-surface-700">
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Range Buy</span>
						<span class="text-sm font-medium">{item.range_buy}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">TP1</span>
						<span class="text-sm font-medium">{item.tp1}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">TP2</span>
						<span class="text-sm font-medium">{item.tp2}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">SL</span>
						<span class="text-sm font-medium">{item.sl}</span>
					</div>
				</div>
			</div>

			<div class="rounded-lg border border-surface-300 p-4 dark:border-surface-700">
				<h4 class="mb-2 text-sm font-semibold text-surface-500 dark:text-surface-400">Detail</h4>
				<div class="divide-y divide-surface-200 dark:divide-surface-700">
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Source</span>
						<span class="text-sm font-medium">{item.source}</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Valid</span>
						<span class="badge {item.is_valid ? 'bg-success-500 text-success-contrast-500' : 'bg-surface-500 text-surface-contrast-500'}">
							{item.is_valid ? 'Ya' : 'Tidak'}
						</span>
					</div>
					<div class="flex items-center justify-between py-2">
						<span class="text-sm text-surface-500 dark:text-surface-400">Tanggal Dibuat</span>
						<span class="text-sm font-medium">{formatDate(item.created_at)}</span>
					</div>
				</div>
			</div>

			{#if item.description}
				<div class="rounded-lg border border-surface-300 p-4 dark:border-surface-700">
					<h4 class="mb-2 text-sm font-semibold text-surface-500 dark:text-surface-400">Deskripsi</h4>
					<p class="text-sm text-surface-700 dark:text-surface-300">{item.description}</p>
				</div>
			{/if}
		</div>
	{/if}
</AppDialog>
