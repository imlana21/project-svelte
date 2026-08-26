<script lang="ts">
	import { untrack } from 'svelte';
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import { useEmitenAdmin } from '$lib/hooks/useEmitenAdmin.svelte';
	import { useSekuritasAdmin } from '$lib/hooks/useSekuritasAdmin.svelte';
	import { usePositionAdmin } from '$lib/hooks/usePositionAdmin.svelte';
	import type { StoreTransactionPayload } from '$lib/types/Stock';

	interface Props {
		open: boolean;
		type: 'buy' | 'sell';
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: StoreTransactionPayload) => void;
	}

	let { open, type, saving, onOpenChange, onSubmit }: Props = $props();

	const emitens = useEmitenAdmin();
	const sekuritas = useSekuritasAdmin();
	const positions = usePositionAdmin();

	let emitenId = $state(0);
	let sekuritasId = $state(0);
	let positionId = $state(0);
	let date = $state(new Date().toISOString().split('T')[0]);
	let price = $state(0);
	let lot = $state(0);
	let fee = $state(0);
	let errors = $state<Record<string, string>>({});

	$effect(() => {
		if (untrack(() => open)) {
			emitenId = 0;
			sekuritasId = 0;
			positionId = 0;
			date = new Date().toISOString().split('T')[0];
			price = 0;
			lot = 0;
			fee = 0;
			errors = {};
			loadOptions();
		}
	});

	async function loadOptions() {
		try {
			await Promise.all([
				emitens.fetchAll({ page: 1, perPage: 100 }),
				sekuritas.fetchAll({ page: 1, perPage: 100 }),
				positions.fetchAll({ page: 1, perPage: 100, orderBy: 'created_at', orderDirection: 'asc' }),
			]);
		} catch { /* silent */ }
	}

	function validate(): boolean {
		const next: Record<string, string> = {};
		if (type === 'buy') {
			if (!emitenId) next.emiten_id = 'Emiten wajib dipilih';
			if (!sekuritasId) next.sekuritas_id = 'Sekuritas wajib dipilih';
		} else {
			if (!positionId) next.position_id = 'Posisi wajib dipilih';
		}
		if (price <= 0) next.price = 'Harga harus lebih dari 0';
		if (lot <= 0) next.lot = 'Lot harus lebih dari 0';
		if (!date) next.date = 'Tanggal wajib diisi';
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		if (type === 'buy') {
			onSubmit({ sekuritas_id: sekuritasId, emiten_id: emitenId, type: 'buy', date, price, lot, fee });
		} else {
			const pos = positions.items.find((p) => p.id === positionId);
			if (!pos) return;
			onSubmit({ sekuritas_id: pos.sekuritas_id ?? 0, emiten_id: pos.emiten_id ?? 0, type: 'sell', date, price, lot, fee });
		}
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title={type === 'buy' ? 'Beli Saham' : 'Jual Saham'}
	description={type === 'buy' ? 'Catat transaksi pembelian saham' : 'Catat transaksi penjualan saham'}
	footer={footerSnippet}
>
	<form id="transaction-form" class="flex flex-col gap-4" onsubmit={handleSubmit}>
		{#if type === 'buy'}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field label="Emiten" required error={errors.emiten_id}>
					<select class="input" bind:value={emitenId}>
						<option value={0}>Pilih emiten...</option>
						{#each emitens.items as e (e.id)}
							<option value={e.id}>{e.ticker} - {e.name}</option>
						{/each}
					</select>
				</Field>
				<Field label="Sekuritas" required error={errors.sekuritas_id}>
					<select class="input" bind:value={sekuritasId}>
						<option value={0}>Pilih sekuritas...</option>
						{#each sekuritas.items as s (s.id)}
							<option value={s.id}>[{s.code}] {s.name}</option>
						{/each}
					</select>
				</Field>
			</div>
		{:else}
			<Field label="Posisi" required error={errors.position_id}>
				<select class="input" bind:value={positionId}>
					<option value={0}>Pilih posisi...</option>
					{#each positions.items.filter((p) => p.status === 'open') as p (p.id)}
						<option value={p.id}>{p.emiten?.ticker ?? '?'} - Lot: {p.lot} @ {p.avg_price}</option>
					{/each}
				</select>
			</Field>
		{/if}
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
		form="transaction-form"
		class="btn {type === 'buy' ? 'bg-success-500 text-success-contrast-500' : 'bg-error-500 text-error-contrast-500'}"
		disabled={saving}
	>
		{saving ? 'Menyimpan...' : type === 'buy' ? 'Beli' : 'Jual'}
	</button>
{/snippet}
