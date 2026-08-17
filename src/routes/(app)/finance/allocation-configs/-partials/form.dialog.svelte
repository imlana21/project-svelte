<script lang="ts">
	import { untrack } from 'svelte';
	import AppDialog from '$lib/components/ui/AppDialog.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import type { FinanceAllocationConfig } from '$lib/types/finance/AllocationConfig';

	export interface AllocationConfigForm {
		category_name: string;
		percentage: number;
		sort_order: number;
		is_active: boolean;
	}

	interface Props {
		open: boolean;
		item: FinanceAllocationConfig | undefined;
		saving: boolean;
		onOpenChange: (open: boolean) => void;
		onSubmit: (values: AllocationConfigForm) => void;
	}

	let { open, item, saving, onOpenChange, onSubmit }: Props = $props();

	let categoryName = $state('');
	let percentage = $state(0);
	let sortOrder = $state(0);
	let isActive = $state(true);
	let errors = $state<Record<string, string>>({});

	$effect(() => {
		if (untrack(() => open)) {
			categoryName = item?.category_name ?? '';
			percentage = item ? item.percentage * 100 : 0;
			sortOrder = item?.sort_order ?? 0;
			isActive = item?.is_active ?? true;
			errors = {};
		}
	});

	function validate(): boolean {
		const next: Record<string, string> = {};
		if (!categoryName.trim()) next.category_name = 'Nama kategori wajib diisi';
		if (percentage <= 0 || percentage > 100) next.percentage = 'Persentase harus antara 1-100';
		if (sortOrder < 0) next.sort_order = 'Urutan tidak boleh negatif';
		errors = next;
		return Object.keys(next).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;
		onSubmit({
			category_name: categoryName.trim(),
			percentage: percentage / 100,
			sort_order: sortOrder,
			is_active: isActive,
		});
	}
</script>

<AppDialog
	{open}
	{onOpenChange}
	title="Alokasi Dana"
	description={item ? 'Ubah konfigurasi alokasi' : 'Tambah alokasi baru'}
	footer={footerSnippet}
>
	<form id="allocation-form" class="flex flex-col gap-4" onsubmit={handleSubmit}>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Nama Kategori" required error={errors.category_name}>
				<input class="input" type="text" placeholder="Tabungan" bind:value={categoryName} />
			</Field>
			<Field label="Persentase (%)" required error={errors.percentage}>
				<input class="input" type="number" min="1" max="100" step="0.01" bind:value={percentage} />
			</Field>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field label="Urutan" error={errors.sort_order}>
				<input class="input" type="number" min="0" bind:value={sortOrder} />
			</Field>
			<div class="flex items-center gap-2 pt-6">
				<input type="checkbox" class="checkbox" bind:checked={isActive} />
				<span class="label">Aktif</span>
			</div>
		</div>
	</form>
</AppDialog>

{#snippet footerSnippet()}
	<button type="button" class="btn" onclick={() => onOpenChange(false)} disabled={saving}>Batal</button>
	<button type="submit" form="allocation-form" class="btn bg-primary-500 text-primary-contrast-500" disabled={saving}>
		{saving ? 'Menyimpan...' : 'Simpan'}
	</button>
{/snippet}
