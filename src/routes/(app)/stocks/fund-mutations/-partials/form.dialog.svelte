<script lang="ts">
	import { untrack } from 'svelte';
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import type { StockSekuritas, StoreFundMutationPayload } from '$lib/types/Stock';
	import { fetchSekuritas } from '$lib/services/sekuritas.service';

	interface Props {
		open: boolean;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: StoreFundMutationPayload) => void;
	}

	let { open, saving, onOpenChange, onSubmit }: Props = $props();

	let type = $state<'topup' | 'withdraw' | 'adjust'>('topup');
	let amount = $state(0);
	let sekuritasId = $state(0);
	let note = $state('');
	let errors = $state<Record<string, string>>({});

	let sekuritasOptions = $state<StockSekuritas[]>([]);

	$effect(() => {
		if (untrack(() => open)) {
			type = 'topup';
			amount = 0;
			sekuritasId = 0;
			note = '';
			errors = {};
			loadSekuritas();
		}
	});

	async function loadSekuritas() {
		try {
			const res = await fetchSekuritas({ page: 1, perPage: 100 });
			sekuritasOptions = res.data;
		} catch { /* silent */ }
	}

	function validate(): boolean {
		const next: Record<string, string> = {};
		if (!sekuritasId) next.sekuritas_id = 'Sekuritas wajib dipilih';
		if (amount <= 0) next.amount = 'Jumlah harus lebih dari 0';
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		onSubmit({ sekuritas_id: sekuritasId, type, amount, note: note.trim() || undefined });
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title="Mutasi Dana"
	description="Catat mutasi dana masuk/keluar"
	footer={footerSnippet}
>
	<form id="mutation-form" class="flex flex-col gap-4" onsubmit={handleSubmit}>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Tipe" required>
				<select class="input" bind:value={type}>
					<option value="topup">Topup</option>
					<option value="withdraw">Withdraw</option>
					<option value="adjust">Adjust</option>
				</select>
			</Field>
			<Field label="Jumlah" required error={errors.amount}>
				<input class="input" type="number" min="1" bind:value={amount} />
			</Field>
		</div>
		<Field label="Sekuritas" required error={errors.sekuritas_id}>
			<select class="input" bind:value={sekuritasId}>
				<option value={0}>Pilih sekuritas...</option>
				{#each sekuritasOptions as s (s.id)}
					<option value={s.id}>[{s.code}] {s.name}</option>
				{/each}
			</select>
		</Field>
		<Field label="Catatan">
			<textarea class="input min-h-16" placeholder="Opsional" bind:value={note}></textarea>
		</Field>
	</form>
</AppDialog>

{#snippet footerSnippet()}
	<button type="button" class="btn" onclick={() => onOpenChange(false)} disabled={saving}>Batal</button>
	<button type="submit" form="mutation-form" class="btn bg-primary-500 text-primary-contrast-500" disabled={saving}>
		{saving ? 'Menyimpan...' : 'Simpan'}
	</button>
{/snippet}
