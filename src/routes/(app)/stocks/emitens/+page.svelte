<script lang="ts">
	import { onMount } from 'svelte';
	import { Pencil, Plus, Trash2, Upload } from '@lucide/svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import { useEmitenAdmin } from '$lib/hooks/useEmitenAdmin.svelte';
	import { usePermission } from '$lib/hooks/usePermission.svelte';
	import { PERMISSIONS } from '$lib/utils/permission-registry';
	import { toastError, toastSuccess } from '$lib/utils/toaster.svelte';
	import { formatNumber } from '$lib/utils/format';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { StockEmiten } from '$lib/types/Stock';
	import { emitenColumns } from './-partials/columns';
	import EmitenFormDialog, { type EmitenForm } from './-partials/form.dialog.svelte';

	const emitens = useEmitenAdmin();
	const { can } = usePermission();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('ticker');
	let sortOrder = $state<SortOrder>('asc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openForm = $state(false);
	let editItem = $state<StockEmiten | undefined>(undefined);
	let deleteId = $state<number | null>(null);

	async function load() {
		try {
			await emitens.fetchAll({ page, perPage, search, orderBy: sortKey, orderDirection: sortOrder });
		} catch (e) {
			toastError(e);
		}
	}

	onMount(load);

	function handleSearch(value: string) {
		search = value;
		page = 1;
		load();
	}

	function handlePageChange(next: number) { page = next; load(); }
	function handlePerPageChange(next: number) { perPage = next; page = 1; load(); }
	function handleSort(key: string) {
		if (sortKey === key) sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		else { sortKey = key; sortOrder = 'asc'; }
		load();
	}

	function openCreate() { editItem = undefined; openForm = true; }
	function openEditFor(row: StockEmiten) { editItem = row; openForm = true; }

	async function handleSubmit(values: EmitenForm) {
		try {
			if (editItem) {
				await emitens.update(editItem.id, values);
			} else {
				await emitens.create(values);
			}
			openForm = false;
			toastSuccess('Data emiten berhasil disimpan');
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleDelete() {
		if (deleteId === null) return;
		try {
			await emitens.remove(deleteId);
			deleteId = null;
			toastSuccess('Emiten berhasil dihapus');
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleImport() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.txt,.csv';
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;
			try {
				const res = await emitens.importEod(file);
				toastSuccess(`Import selesai: ${res.data.updated} diperbarui, ${res.data.skipped} dilewati`);
				load();
			} catch (e) {
				toastError(e);
			}
		};
		input.click();
	}
</script>

{#snippet cell(item: StockEmiten, column: ColumnDef)}
	{#if column.key === 'ticker'}
		<span class="badge">{item.ticker}</span>
	{:else if column.key === 'name'}
		{item.name || '-'}
	{:else if column.key === 'sector'}
		{item.sector}
	{:else if column.key === 'close'}
		{item.close > 0 ? `Rp ${formatNumber(item.close)}` : '-'}
	{:else if column.key === 'volume'}
		{formatNumber(item.volume)}
	{/if}
{/snippet}

{#snippet rowActions(item: StockEmiten)}
	<div class="inline-flex items-center gap-1">
		{#if can(PERMISSIONS.stocksEmitens.update)}
			<button type="button" class="btn btn-icon" title="Ubah" onclick={() => openEditFor(item)}>
				<Pencil size={16} />
			</button>
		{/if}
		{#if can(PERMISSIONS.stocksEmitens.delete)}
			<button type="button" class="btn btn-icon text-error-600 dark:text-error-400" title="Hapus" onclick={() => (deleteId = item.id)}>
				<Trash2 size={16} />
			</button>
		{/if}
	</div>
{/snippet}

<CrudPage
	title="Emiten List"
	description="Daftar emiten yang terdaftar di sistem"
	columns={emitenColumns}
	items={emitens.items}
	meta={emitens.meta}
	loading={emitens.loading}
	{search}
	{sortConfig}
	onSearch={handleSearch}
	onSort={handleSort}
	onPageChange={handlePageChange}
	onPerPageChange={handlePerPageChange}
	cell={cell}
	rowActions={rowActions}
>
	{#snippet actions()}
		{#if can(PERMISSIONS.stocksEmitens.create)}
			<button type="button" class="btn bg-primary-500 text-primary-contrast-500" onclick={openCreate}>
				<Plus size={16} /> Tambah
			</button>
			<button type="button" class="btn" onclick={handleImport} disabled={emitens.importing}>
				<Upload size={16} /> {emitens.importing ? 'Importing...' : 'Import EOD'}
			</button>
		{/if}
	{/snippet}
</CrudPage>

<EmitenFormDialog
	open={openForm}
	item={editItem}
	saving={emitens.loading}
	onOpenChange={(o) => (openForm = o)}
	onSubmit={handleSubmit}
/>

<ConfirmDialog
	open={deleteId !== null}
	title="Hapus Emiten"
	message="Yakin ingin menghapus emiten ini?"
	confirmLabel="Hapus"
	loading={emitens.loading}
	onConfirm={handleDelete}
	onClose={() => (deleteId = null)}
/>
