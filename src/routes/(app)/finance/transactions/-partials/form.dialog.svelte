<script lang="ts">
	import { untrack } from 'svelte';
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import { usePocketAdmin } from '$lib/hooks/usePocketAdmin.svelte';
	import type { FinanceTransaction } from '$lib/types/finance/Transaction';
	import type { FinanceCategoryTag } from '$lib/types/finance/Transaction';

	const categoryTags: FinanceCategoryTag[] = ['makan', 'jajan', 'transportasi', 'rumah', 'hiburan', 'lainnya'];

	export interface TransactionForm {
		type: 'expense' | 'transfer';
		pocket_id: number;
		amount: number;
		description: string;
		category_tag?: string;
		date: string;
		note?: string;
	}

	interface Props {
		open: boolean;
		item: FinanceTransaction | undefined;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: TransactionForm) => void;
	}

	let { open, item, saving, onOpenChange, onSubmit }: Props = $props();

	const pockets = usePocketAdmin();

	let type = $state<'expense' | 'transfer'>('expense');
	let pocketId = $state(0);
	let amount = $state(0);
	let description = $state('');
	let categoryTag = $state('');
	let date = $state(new Date().toISOString().split('T')[0]);
	let note = $state('');
	let errors = $state<Record<string, string>>({});

	$effect(() => {
		if (untrack(() => open)) {
			if (item) {
				type = 'expense';
				pocketId = item.pocket_id;
				amount = item.amount;
				description = item.description;
				categoryTag = item.category_tag ?? '';
				date = item.date;
				note = item.note ?? '';
			} else {
				type = 'expense';
				pocketId = 0;
				amount = 0;
				description = '';
				categoryTag = '';
				date = new Date().toISOString().split('T')[0];
				note = '';
			}
			errors = {};
			loadPocketOptions();
		}
	});

	async function loadPocketOptions() {
		try {
			await pockets.fetchAll({ page: 1, perPage: 100 });
		} catch { /* silent */ }
	}

	function validate(): boolean {
		const next: Record<string, string> = {};
		if (!item) {
			if (!pocketId) next.pocket_id = 'Pocket wajib dipilih';
			if (amount <= 0) next.amount = 'Jumlah harus lebih dari 0';
		}
		if (!description.trim()) next.description = 'Deskripsi wajib diisi';
		if (!date) next.date = 'Tanggal wajib diisi';
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		if (item) {
			onSubmit({ description: description.trim(), category_tag: categoryTag || undefined, date, note: note.trim() || undefined } as TransactionForm);
		} else {
			onSubmit({
				type,
				pocket_id: pocketId,
				amount,
				description: description.trim(),
				category_tag: categoryTag || undefined,
				date,
				note: note.trim() || undefined,
			});
		}
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title={item ? 'Ubah Transaksi' : 'Catat Pengeluaran'}
	description={item ? 'Ubah metadata transaksi' : 'Catat pengeluaran atau transfer antar pocket'}
	footer={footerSnippet}
>
	<form id="transaction-form" class="flex flex-col gap-4" onsubmit={handleSubmit}>
		{#if !item}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field label="Tipe" required>
					<select class="input" bind:value={type}>
						<option value="expense">Pengeluaran</option>
						<option value="transfer">Transfer</option>
					</select>
				</Field>
				<Field label="Pocket" required error={errors.pocket_id}>
					<select class="input" bind:value={pocketId}>
						<option value={0}>Pilih pocket...</option>
						{#each pockets.items as p (p.id)}
							<option value={p.id}>{p.name}</option>
						{/each}
					</select>
				</Field>
			</div>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<Field label="Jumlah" required error={errors.amount}>
					<input class="input" type="number" min="1" bind:value={amount} />
				</Field>
				<Field label="Tanggal" required error={errors.date}>
					<input class="input" type="date" bind:value={date} />
				</Field>
			</div>
		{/if}
		<Field label="Deskripsi" required error={errors.description}>
			<input class="input" type="text" placeholder="Makan siang, Beli kopi, dll." bind:value={description} />
		</Field>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Kategori">
				<select class="input" bind:value={categoryTag}>
					<option value="">Pilih kategori...</option>
					{#each categoryTags as tag (tag)}
						<option value={tag}>{tag}</option>
					{/each}
				</select>
			</Field>
			{#if item}
				<Field label="Tanggal" required error={errors.date}>
					<input class="input" type="date" bind:value={date} />
				</Field>
			{/if}
		</div>
		<Field label="Catatan">
			<textarea class="input min-h-16" placeholder="Opsional" bind:value={note}></textarea>
		</Field>
	</form>
</AppDialog>

{#snippet footerSnippet()}
	<button type="button" class="btn" onclick={() => onOpenChange(false)} disabled={saving}>Batal</button>
	<button type="submit" form="transaction-form" class="btn bg-primary-500 text-primary-contrast-500" disabled={saving}>
		{saving ? 'Menyimpan...' : 'Simpan'}
	</button>
{/snippet}
