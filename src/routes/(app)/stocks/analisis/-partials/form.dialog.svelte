<script lang="ts">
	import { Upload, X } from "@lucide/svelte";
	import AppDialog from "$lib/components/ui/AppDialog.svelte";
	import Field from "$lib/components/ui/Field.svelte";
	import type { StockAnalysis, StoreAnalysisPayload } from "$lib/types/Stock";

	interface Props {
		open: boolean;
		item: StockAnalysis | undefined;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: StoreAnalysisPayload, imageFile?: File) => void;
	}

	let { open, item, saving, onOpenChange, onSubmit }: Props = $props();

	let ticker = $state("");
	let rangeBuy = $state("");
	let tp1 = $state(0);
	let tp2 = $state(0);
	let sl = $state(0);
	let imageFile = $state<File | undefined>(undefined);
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
			imageFile = undefined;
			imagePreview = item.image_url || item.image || "";
			description = item.description;
			source = item.source;
			isValid = item.is_valid;
			errors = {};
		}
		if (!open) {
			ticker = "";
			rangeBuy = "";
			tp1 = 0;
			tp2 = 0;
			sl = 0;
			imageFile = undefined;
			imagePreview = "";
			description = "";
			source = "";
			isValid = true;
			errors = {};
		}
	});

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			errors = { ...errors, image: "File harus berupa gambar" };
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			errors = { ...errors, image: "Ukuran file maksimal 5MB" };
			return;
		}

		imageFile = file;
		errors = { ...errors, image: "" };

		const reader = new FileReader();
		reader.onload = (event) => {
			imagePreview = event.target?.result as string;
		};
		reader.readAsDataURL(file);
	}

	function removeImage() {
		imageFile = undefined;
		imagePreview = "";
	}

	function validate(): boolean {
		const next: Record<string, string> = {};
		if (!ticker.trim()) next.ticker = "Ticker wajib diisi";
		if (!rangeBuy.trim()) next.range_buy = "Range Buy wajib diisi";
		if (tp1 <= 0) next.tp1 = "TP1 harus lebih dari 0";
		if (tp2 <= 0) next.tp2 = "TP2 harus lebih dari 0";
		if (sl <= 0) next.sl = "SL harus lebih dari 0";
		if (!description.trim()) next.description = "Deskripsi wajib diisi";
		if (!source.trim()) next.source = "Source wajib diisi";
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
				image: imageFile ? null : imagePreview || null,
				image_url: imageFile ? null : item?.image_url || null,
				description: description.trim(),
				source: source.trim(),
				is_valid: isValid,
			},
			imageFile,
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
				<input class="input" type="number" min="1" bind:value={tp1} />
			</Field>
			<Field label="TP2" required error={errors.tp2}>
				<input class="input" type="number" min="1" bind:value={tp2} />
			</Field>
			<Field label="SL" required error={errors.sl}>
				<input class="input" type="number" min="1" bind:value={sl} />
			</Field>
		</div>
		<Field label="Image" error={errors.image}>
			<div class="flex flex-col gap-2">
				{#if imagePreview}
					<div
						class="relative overflow-hidden rounded-lg border border-surface-300 dark:border-surface-700"
					>
						<img
							src={imagePreview}
							alt="Preview"
							class="max-h-48 w-full object-cover"
						/>
						<button
							type="button"
							class="absolute right-2 top-2 rounded-full bg-surface-900/60 p-1 text-white transition-colors-fast hover:bg-surface-900/80"
							onclick={removeImage}
						>
							<X size={14} />
						</button>
					</div>
				{:else}
					<label
						class="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-surface-300 py-6 transition-colors-fast hover:border-primary-400 hover:bg-surface-100 dark:border-surface-700 dark:hover:border-primary-500 dark:hover:bg-surface-800"
					>
						<Upload size={24} class="text-surface-400" />
						<span class="text-sm text-surface-500 dark:text-surface-400"
							>Pilih gambar</span
						>
						<span class="text-xs text-surface-400 dark:text-surface-500"
							>JPG, PNG, WebP (maks 5MB)</span
						>
						<input
							type="file"
							accept="image/*"
							class="hidden"
							onchange={handleFileSelect}
						/>
					</label>
				{/if}
			</div>
		</Field>
		<Field label="Source" required error={errors.source}>
			<input
				class="input"
				type="text"
				placeholder="TradingView"
				bind:value={source}
			/>
		</Field>
		<Field label="Deskripsi" required error={errors.description}>
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
