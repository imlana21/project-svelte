<script lang="ts">
	import { untrack } from 'svelte';
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import AsyncCombobox from '$lib/components/ui/AsyncCombobox.svelte';
	import { useEmitenAdmin } from '$lib/hooks/useEmitenAdmin.svelte';
	import { useSekuritasAdmin } from '$lib/hooks/useSekuritasAdmin.svelte';
	import type { StoreTransactionPayload } from '$lib/types/Stock';

	const TREND_OPTIONS = ['extreme', 'strong', 'medium', 'weak', 'down'] as const;
	const QUADRANT_OPTIONS = ['leading', 'improving', 'weakening', 'lagging'] as const;

	interface Props {
		open: boolean;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: StoreTransactionPayload) => void;
	}

	let { open, saving, onOpenChange, onSubmit }: Props = $props();

	const emitens = useEmitenAdmin();
	const sekuritas = useSekuritasAdmin();

	let emitenId = $state(0);
	let sekuritasId = $state(0);
	let date = $state(new Date().toISOString().split('T')[0]);
	let price = $state(0);
	let lot = $state(0);
	let fee = $state(0);
	let trend = $state<string>('extreme');
	let quadrant = $state<string>('leading');
	let planSL = $state(0);
	let planTP = $state(0);
	let setup = $state('');
	let errors = $state<Record<string, string>>({});

	let emitenItems = $derived(
		emitens.items.map((e) => ({ label: `${e.ticker} - ${e.name}`, value: e.id.toString() }))
	);
	let sekuritasItems = $derived(
		sekuritas.items.map((s) => ({ label: `[${s.code}] ${s.name}`, value: s.id.toString() }))
	);

	$effect(() => {
		if (untrack(() => open)) {
			emitenId = 0;
			sekuritasId = 0;
			date = new Date().toISOString().split('T')[0];
			price = 0;
			lot = 0;
			fee = 0;
			trend = 'extreme';
			quadrant = 'leading';
			planSL = 0;
			planTP = 0;
			setup = '';
			errors = {};
			loadOptions();
		}
	});

	async function loadOptions() {
		try {
			await Promise.all([
				emitens.fetchAll({ page: 1, perPage: 100 }),
				sekuritas.fetchAll({ page: 1, perPage: 100 }),
			]);
		} catch { /* silent */ }
	}

	function validate(): boolean {
		const next: Record<string, string> = {};
		if (!emitenId) next.emiten_id = 'Emiten wajib dipilih';
		if (!sekuritasId) next.sekuritas_id = 'Sekuritas wajib dipilih';
		if (price <= 0) next.price = 'Harga harus lebih dari 0';
		if (lot <= 0) next.lot = 'Lot harus lebih dari 0';
		if (!date) next.date = 'Tanggal wajib diisi';
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		onSubmit({
			sekuritas_id: sekuritasId,
			emiten_id: emitenId,
			type: 'buy',
			date,
			price,
			lot,
			fee,
			trend,
			quadrant,
			plan_sl: planSL,
			plan_tp: planTP,
			setup,
		});
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title="Beli Saham"
	description="Catat transaksi pembelian saham"
	footer={footerSnippet}
>
	<form id="buy-form" class="flex flex-col gap-4" onsubmit={handleSubmit}>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Emiten" required error={errors.emiten_id}>
				<AsyncCombobox
					value={emitenId ? emitenId.toString() : ''}
					items={emitenItems}
					placeholder="Pilih emiten..."
					onChange={(val) => (emitenId = Number(val))}
					onSearch={(q) => emitens.fetchAll({ page: 1, perPage: 100, search: q })}
				/>
			</Field>
			<Field label="Sekuritas" required error={errors.sekuritas_id}>
				<AsyncCombobox
					value={sekuritasId ? sekuritasId.toString() : ''}
					items={sekuritasItems}
					placeholder="Pilih sekuritas..."
					onChange={(val) => (sekuritasId = Number(val))}
					onSearch={(q) => sekuritas.fetchAll({ page: 1, perPage: 100, search: q })}
				/>
			</Field>
		</div>
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
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Trend">
				<select class="input" bind:value={trend}>
					{#each TREND_OPTIONS as t}
						<option value={t}>{t}</option>
					{/each}
				</select>
			</Field>
			<Field label="Quadrant">
				<select class="input" bind:value={quadrant}>
					{#each QUADRANT_OPTIONS as q}
						<option value={q}>{q}</option>
					{/each}
				</select>
			</Field>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Plan SL">
				<input class="input" type="number" min="0" bind:value={planSL} />
			</Field>
			<Field label="Plan TP">
				<input class="input" type="number" min="0" bind:value={planTP} />
			</Field>
		</div>
		<Field label="Setup">
			<textarea class="input" rows="3" placeholder="Deskripsikan setup..." bind:value={setup}></textarea>
		</Field>
	</form>
</AppDialog>

{#snippet footerSnippet()}
	<button type="button" class="btn" onclick={() => onOpenChange(false)} disabled={saving}>Batal</button>
	<button
		type="submit"
		form="buy-form"
		class="btn bg-success-500 text-success-contrast-500"
		disabled={saving}
	>
		{saving ? 'Menyimpan...' : 'Beli'}
	</button>
{/snippet}
