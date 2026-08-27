<script lang="ts">
	import { untrack } from 'svelte';
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import { usePocketAdmin } from '$lib/hooks/usePocketAdmin.svelte';
	import type { FinanceDebt } from '$lib/types/finance/Debt';

	export interface DebtForm {
		name: string;
		amount_per_month: number;
		due_date: number;
		pocket_id: number;
		category_tag?: string;
		is_active: boolean;
		note?: string;
	}

	interface Props {
		open: boolean;
		item: FinanceDebt | undefined;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: DebtForm) => void;
	}

	let { open, item, saving, onOpenChange, onSubmit }: Props = $props();

	const pockets = usePocketAdmin();

	let name = $state('');
	let amountPerMonth = $state(0);
	let dueDate = $state(1);
	let pocketId = $state(0);
	let categoryTag = $state('');
	let isActive = $state(true);
	let note = $state('');
	let errors = $state<Record<string, string>>({});

	loadPocketOptions();

	$effect(() => {
		if (open) {
			const currentItem = untrack(() => item);
			if (currentItem) {
				name = currentItem.name;
				amountPerMonth = currentItem.amount_per_month;
				dueDate = currentItem.due_date;
				pocketId = currentItem.pocket_id;
				categoryTag = currentItem.category_tag ?? '';
				isActive = currentItem.is_active;
				note = currentItem.note ?? '';
			} else {
				name = '';
				amountPerMonth = 0;
				dueDate = 1;
				pocketId = 0;
				categoryTag = '';
				isActive = true;
				note = '';
			}
			errors = {};
		}
		if (!open) {
			errors = {};
		}
	});

	async function loadPocketOptions() {
		try {
			await pockets.fetchAll({ page: 1, perPage: 100 });
		} catch { /* silent */ }
	}

	function validate(): boolean {
		const next: Record<string, string> = {};
		if (!name.trim()) next.name = 'Nama utang wajib diisi';
		if (amountPerMonth <= 0) next.amount_per_month = 'Jumlah harus lebih dari 0';
		if (dueDate < 1 || dueDate > 31) next.due_date = 'Tanggal harus antara 1-31';
		if (!pocketId) next.pocket_id = 'Pocket wajib dipilih';
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		onSubmit({
			name: name.trim(),
			amount_per_month: amountPerMonth,
			due_date: dueDate,
			pocket_id: pocketId,
			category_tag: categoryTag.trim() || undefined,
			is_active: isActive,
			note: note.trim() || undefined,
		});
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title="Utang"
	description={item ? 'Ubah data utang' : 'Tambah utang baru'}
	footer={footerSnippet}
>
	<form id="debt-form" class="flex flex-col gap-4" onsubmit={handleSubmit}>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Nama" required error={errors.name}>
				<input class="input" type="text" placeholder="Kartu Kredit BCA" bind:value={name} />
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
			<Field label="Jumlah/Bulan" required error={errors.amount_per_month}>
				<input class="input" type="number" min="1" bind:value={amountPerMonth} />
			</Field>
			<Field label="Tanggal Jatuh Tempo" required error={errors.due_date}>
				<input class="input" type="number" min="1" max="31" bind:value={dueDate} />
			</Field>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Tag Kategori">
				<input class="input" type="text" placeholder="Opsional" bind:value={categoryTag} />
			</Field>
			<div class="flex items-center gap-2 pt-6">
				<input type="checkbox" class="checkbox" bind:checked={isActive} />
				<span class="label">Aktif</span>
			</div>
		</div>
		<Field label="Catatan">
			<textarea class="input min-h-16" placeholder="Opsional" bind:value={note}></textarea>
		</Field>
	</form>
</AppDialog>

{#snippet footerSnippet()}
	<button type="button" class="btn" onclick={() => onOpenChange(false)} disabled={saving}>Batal</button>
	<button type="submit" form="debt-form" class="btn bg-primary-500 text-primary-contrast-500" disabled={saving}>
		{saving ? 'Menyimpan...' : 'Simpan'}
	</button>
{/snippet}
