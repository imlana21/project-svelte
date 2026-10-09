<script lang="ts">
	import AppDialog from "$lib/components/ui/AppDialog.svelte";
	import Field from "$lib/components/ui/Field.svelte";
	import type { StockAnalysis, StoreAnalysisPayload } from "$lib/types/Stock";

	interface Props {
		open: boolean;
		item: StockAnalysis | undefined;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: StoreAnalysisPayload) => void;
	}

	let { open, item, saving, onOpenChange, onSubmit }: Props = $props();

	let ticker = $state("");
	let rangeBuy = $state("");
	let tp1 = $state(0);
	let tp2 = $state(0);
	let sl = $state(0);
	let imagePreview = $state<string>("");
	let description = $state("");
	let source = $state("");
	let isValid = $state(true);
	let errors = $state<Record<string, string>>({});

	$effect(() => {
		if (open && item) {
			ticker = item.ticker;
			rangeBuy = item.range_buy;
			tp1 = item.tp1;
			tp2 = item.tp2;
			sl = item.sl;
			imagePreview = item.image || "";
			description = item.description ?? "";
			source = item.source ?? "";
			isValid = item.is_valid;
			errors = {};
		}
		if (!open) {
			ticker = "";
			rangeBuy = "";
			tp1 = 0;
			tp2 = 0;
			sl = 0;
			imagePreview = "";
			description = "";
			source = "";
			isValid = true;
			errors = {};
		}
	});

	function validate(): boolean {
		const next: Record<string, string> = {};
		if (!ticker.trim()) next.ticker = "Ticker wajib diisi";
		if (!rangeBuy.trim()) next.range_buy = "Range Buy wajib diisi";
		if (tp1 < 0) next.tp1 = "TP1 tidak boleh negatif";
		if (tp2 < 0) next.tp2 = "TP2 tidak boleh negatif";
		if (sl < 0) next.sl = "SL tidak boleh negatif";
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		onSubmit(
			{
				ticker: ticker.trim().toUpperCase(),
				range_buy: rangeBuy.trim(),
				tp1,
				tp2,
				sl,
				image: imagePreview.trim() || null,
				description: description.trim(),
				source: source.trim(),
				is_valid: isValid,
			},
		);
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title={item ? "Edit Analisis" : "Tambah Analisis"}
	description={item
		? "Ubah detail analisis saham"
		: "Tambah analisis saham baru"}
	footer={footerSnippet}
>
	<form id="analysis-form" class="flex flex-col gap-4" onsubmit={handleSubmit}>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Ticker" required error={errors.ticker}>
				<input
					class="input"
					type="text"
					placeholder="BBCA"
					maxlength="10"
					bind:value={ticker}
				/>
			</Field>
			<Field label="Range Buy" required error={errors.range_buy}>
				<input
					class="input"
					type="text"
					placeholder="9000-9500"
					bind:value={rangeBuy}
				/>
			</Field>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<Field label="TP1" required error={errors.tp1}>
				<input class="input" type="number" min="0" step="any" bind:value={tp1} />
			</Field>
			<Field label="TP2" required error={errors.tp2}>
				<input class="input" type="number" min="0" step="any" bind:value={tp2} />
			</Field>
			<Field label="SL" required error={errors.sl}>
				<input class="input" type="number" min="0" step="any" bind:value={sl} />
			</Field>
		</div>
		<Field label="URL Gambar" error={errors.image}>
			<input class="input" type="url" placeholder="https://example.com/analisis.png" bind:value={imagePreview} />
			<p class="text-xs text-surface-500">Kosongkan untuk menghapus gambar.</p>
		</Field>
		<Field label="Source" error={errors.source}>
			<input
				class="input"
				type="text"
				placeholder="TradingView"
				bind:value={source}
			/>
		</Field>
		<Field label="Deskripsi" error={errors.description}>
			<textarea
				class="input"
				rows="3"
				placeholder="Deskripsi analisis..."
				bind:value={description}
			></textarea>
		</Field>
		<label class="flex items-center gap-2">
			<input type="checkbox" class="checkbox" bind:checked={isValid} />
			<span class="text-sm">Valid</span>
		</label>
	</form>
</AppDialog>

{#snippet footerSnippet()}
	<button
		type="button"
		class="btn"
		onclick={() => onOpenChange(false)}
		disabled={saving}>Batal</button
	>
	<button
		type="submit"
		form="analysis-form"
		class="btn bg-primary-500 text-primary-contrast-500"
		disabled={saving}
	>
		{saving ? "Menyimpan..." : "Simpan"}
	</button>
{/snippet}
