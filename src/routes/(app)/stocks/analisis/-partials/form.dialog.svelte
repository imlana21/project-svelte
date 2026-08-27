<script lang="ts">
	import { untrack } from 'svelte';
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import type { StockAnalysis, StoreAnalysisPayload } from '$lib/types/Stock';

	interface Props {
		open: boolean;
		item: StockAnalysis | undefined;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: StoreAnalysisPayload) => void;
	}

	let { open, item, saving, onOpenChange, onSubmit }: Props = $props();

	let ticker = $state('');
	let rangeBuy = $state('');
	let tp1 = $state(0);
	let tp2 = $state(0);
	let sl = $state(0);
	let image = $state('');
	let description = $state('');
	let source = $state('');
	let isValid = $state(true);
	let errors = $state<Record<string, string>>({});

	$effect(() => {
		if (untrack(() => open)) {
			ticker = item?.ticker ?? '';
			rangeBuy = item?.range_buy ?? '';
			tp1 = item?.tp1 ?? 0;
			tp2 = item?.tp2 ?? 0;
			sl = item?.sl ?? 0;
			image = item?.image ?? '';
			description = item?.description ?? '';
			source = item?.source ?? '';
			isValid = item?.is_valid ?? true;
			errors = {};
		}
	});

	function validate(): boolean {
		const next: Record<string, string> = {};
		if (!ticker.trim()) next.ticker = 'Ticker wajib diisi';
		if (!rangeBuy.trim()) next.range_buy = 'Range Buy wajib diisi';
		if (tp1 <= 0) next.tp1 = 'TP1 harus lebih dari 0';
		if (tp2 <= 0) next.tp2 = 'TP2 harus lebih dari 0';
		if (sl <= 0) next.sl = 'SL harus lebih dari 0';
		if (!description.trim()) next.description = 'Deskripsi wajib diisi';
		if (!source.trim()) next.source = 'Source wajib diisi';
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		onSubmit({
			ticker: ticker.trim().toUpperCase(),
			range_buy: rangeBuy.trim(),
			tp1,
			tp2,
			sl,
			image: image.trim() || null,
			description: description.trim(),
			source: source.trim(),
			is_valid: isValid,
		});
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title={item ? 'Edit Analisis' : 'Tambah Analisis'}
	description={item ? 'Ubah detail analisis saham' : 'Tambah analisis saham baru'}
	footer={footerSnippet}
>
	<form id="analysis-form" class="flex flex-col gap-4" onsubmit={handleSubmit}>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Ticker" required error={errors.ticker}>
				<input class="input" type="text" placeholder="BBCA" maxlength="10" bind:value={ticker} />
			</Field>
			<Field label="Range Buy" required error={errors.range_buy}>
				<input class="input" type="text" placeholder="9000-9500" bind:value={rangeBuy} />
			</Field>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<Field label="TP1" required error={errors.tp1}>
				<input class="input" type="number" min="1" bind:value={tp1} />
			</Field>
			<Field label="TP2" required error={errors.tp2}>
				<input class="input" type="number" min="1" bind:value={tp2} />
			</Field>
			<Field label="SL" required error={errors.sl}>
				<input class="input" type="number" min="1" bind:value={sl} />
			</Field>
		</div>
		<Field label="Image URL" error={errors.image}>
			<input class="input" type="url" placeholder="https://example.com/image.jpg" bind:value={image} />
		</Field>
		<Field label="Source" required error={errors.source}>
			<input class="input" type="text" placeholder="TradingView" bind:value={source} />
		</Field>
		<Field label="Deskripsi" required error={errors.description}>
			<textarea class="input" rows="3" placeholder="Deskripsi analisis..." bind:value={description}></textarea>
		</Field>
		<label class="flex items-center gap-2">
			<input type="checkbox" class="checkbox" bind:checked={isValid} />
			<span class="text-sm">Valid</span>
		</label>
	</form>
</AppDialog>

{#snippet footerSnippet()}
	<button type="button" class="btn" onclick={() => onOpenChange(false)} disabled={saving}>Batal</button>
	<button type="submit" form="analysis-form" class="btn bg-primary-500 text-primary-contrast-500" disabled={saving}>
		{saving ? 'Menyimpan...' : 'Simpan'}
	</button>
{/snippet}
