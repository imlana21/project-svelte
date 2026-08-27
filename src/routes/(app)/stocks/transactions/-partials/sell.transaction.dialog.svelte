<script lang="ts">
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import AsyncCombobox from '$lib/components/ui/AsyncCombobox.svelte';
	import { usePositionAdmin } from '$lib/hooks/usePositionAdmin.svelte';
	import type { StoreTransactionPayload } from '$lib/types/Stock';

	interface Props {
		open: boolean;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: StoreTransactionPayload) => void;
	}

	let { open, saving, onOpenChange, onSubmit }: Props = $props();

	const positions = usePositionAdmin();

	let positionId = $state(0);
	let date = $state(new Date().toISOString().split('T')[0]);
	let price = $state(0);
	let lot = $state(0);
	let fee = $state(0);
	let errors = $state<Record<string, string>>({});

	let positionItems = $derived(
		positions.items
			.filter((p) => p.status === 'open')
			.map((p) => ({
				label: `${p.emiten?.ticker ?? '?'} - Lot: ${p.lot} @ ${p.avg_price}`,
				value: p.id.toString(),
			}))
	);

	$effect(() => {
		if (open) {
			positionId = 0;
			date = new Date().toISOString().split('T')[0];
			price = 0;
			lot = 0;
			fee = 0;
			errors = {};
			loadOptions();
		}
		if (!open) { errors = {}; }
	});

	async function loadOptions() {
		try {
			await positions.fetchAll({ page: 1, perPage: 100, orderBy: 'created_at', orderDirection: 'asc' });
		} catch { /* silent */ }
	}

	function validate(): boolean {
		const next: Record<string, string> = {};
		if (!positionId) next.position_id = 'Posisi wajib dipilih';
		if (price <= 0) next.price = 'Harga harus lebih dari 0';
		if (lot <= 0) next.lot = 'Lot harus lebih dari 0';
		if (!date) next.date = 'Tanggal wajib diisi';
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		const pos = positions.items.find((p) => p.id === positionId);
		if (!pos) return;
		onSubmit({
			sekuritas_id: pos.sekuritas_id ?? 0,
			emiten_id: pos.emiten_id ?? 0,
			type: 'sell',
			date,
			price,
			lot,
			fee,
		});
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title="Jual Saham"
	description="Catat transaksi penjualan saham"
	footer={footerSnippet}
>
	<form id="sell-form" class="flex flex-col gap-4" onsubmit={handleSubmit}>
		<Field label="Posisi" required error={errors.position_id}>
			<AsyncCombobox
				value={positionId ? positionId.toString() : ''}
				items={positionItems}
				placeholder="Pilih posisi..."
				onChange={(val) => (positionId = Number(val))}
				onSearch={(q) => positions.fetchAll({ page: 1, perPage: 100, search: q, orderBy: 'created_at', orderDirection: 'asc' })}
			/>
		</Field>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Tanggal" required error={errors.date}>
				<input class="input" type="date" bind:value={date} />
			</Field>
			<Field label="Harga" required error={errors.price}>
				<input class="input" type="number" min="1" bind:value={price} />
			</Field>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Lot" required error={errors.lot}>
				<input class="input" type="number" min="1" bind:value={lot} />
			</Field>
			<Field label="Fee" error={errors.fee}>
				<input class="input" type="number" min="0" bind:value={fee} />
			</Field>
		</div>
	</form>
</AppDialog>

{#snippet footerSnippet()}
	<button type="button" class="btn" onclick={() => onOpenChange(false)} disabled={saving}>Batal</button>
	<button
		type="submit"
		form="sell-form"
		class="btn bg-error-500 text-error-contrast-500"
		disabled={saving}
	>
		{saving ? 'Menyimpan...' : 'Jual'}
	</button>
{/snippet}
