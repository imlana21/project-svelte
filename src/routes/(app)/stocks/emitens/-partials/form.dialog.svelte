<script lang="ts">
	import { untrack } from 'svelte';
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import type { StockEmiten } from '$lib/types/Stock';

	export interface EmitenForm {
		ticker: string;
		name: string;
		sector: string;
	}

	interface Props {
		open: boolean;
		item: StockEmiten | undefined;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: EmitenForm) => void;
	}

	let { open, item, saving, onOpenChange, onSubmit }: Props = $props();

	let ticker = $state('');
	let name = $state('');
	let sector = $state('');
	let errors = $state<{ ticker?: string; name?: string; sector?: string }>({});

	const sectors = [
		'Energy', 'Basic Materials', 'Industrials', 'Consumer Cyclical',
		'Consumer Non-Cyclicals', 'Healthcare', 'Financials',
		'Properties & Real Estate', 'Technology', 'Infrastructure',
		'Transportation & Logistics',
	];

	$effect(() => {
		if (open) {
			const currentItem = untrack(() => item);
			ticker = currentItem?.ticker ?? '';
			name = currentItem?.name ?? '';
			sector = currentItem?.sector ?? 'Energy';
			errors = {};
		}
		if (!open) { errors = {}; }
	});

	function validate(): boolean {
		const next: typeof errors = {};
		if (!ticker.trim()) next.ticker = 'Ticker wajib diisi';
		else if (ticker.trim().length > 5) next.ticker = 'Maksimal 5 karakter';
		if (!name.trim()) name = ticker.trim();
		if (!sector) next.sector = 'Sektor wajib dipilih';
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		onSubmit({ ticker: ticker.trim().toUpperCase(), name: name.trim(), sector });
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title="Emiten"
	description={item ? 'Ubah data emiten' : 'Tambah emiten baru'}
	footer={footerSnippet}
>
	<form id="emiten-form" class="flex flex-col gap-4" onsubmit={handleSubmit}>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Ticker" required error={errors.ticker}>
				<input class="input" type="text" placeholder="BBCA" maxlength="5" bind:value={ticker} />
			</Field>
			<Field label="Nama" error={errors.name}>
				<input class="input" type="text" placeholder="Bank Central Asia" bind:value={name} />
			</Field>
		</div>
		<Field label="Sektor" required error={errors.sector}>
			<select class="input" bind:value={sector}>
				{#each sectors as s (s)}
					<option value={s}>{s}</option>
				{/each}
			</select>
		</Field>
	</form>
</AppDialog>

{#snippet footerSnippet()}
	<button type="button" class="btn" onclick={() => onOpenChange(false)} disabled={saving}>Batal</button>
	<button type="submit" form="emiten-form" class="btn bg-primary-500 text-primary-contrast-500" disabled={saving}>
		{saving ? 'Menyimpan...' : 'Simpan'}
	</button>
{/snippet}
