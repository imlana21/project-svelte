<script lang="ts">
	import { onMount } from 'svelte';
	import { Pencil, Plus, Trash2, Upload } from '@lucide/svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import { useCrud } from '$lib/hooks/useCrud.svelte';
	import { usePermission } from '$lib/hooks/usePermission.svelte';
	import { PERMISSIONS } from '$lib/utils/permission-registry';
	import { toastError, toastSuccess } from '$lib/utils/toaster.svelte';
	import { formatNumber } from '$lib/utils/format';
	import * as emitenService from '$lib/services/emiten.service';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { StockEmiten, StoreEmitenPayload } from '$lib/types/Stock';
	import { emitenColumns } from './-partials/columns';
	import EmitenFormDialog, { type EmitenForm } from './-partials/form.dialog.svelte';

	const emitens = useCrud<StockEmiten, StoreEmitenPayload>({
		fetchAll: emitenService.fetchEmitens,
		fetchById: emitenService.fetchEmiten,
		create: emitenService.createEmiten,
		update: emitenService.updateEmiten,
		remove: emitenService.deleteEmiten,
	});

	const { can } = usePermission();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('ticker');
	let sortOrder = $state<SortOrder>('asc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openForm = $state(false);
	let deleteId = $state<number | null>(null);
	let importing = $state(false);

	async function load() {
		try {
			await emitens.fetchAll({ page, perPage, search, orderBy: sortKey, orderDirection: sortOrder });
		} catch {
			toastError('Gagal memuat data emiten');
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

	function openCreate() { emitens.setItem(undefined); openForm = true; }
	function openEditFor(row: StockEmiten) { emitens.setItem(row); openForm = true; }

	async function handleSubmit(values: EmitenForm) {
		const current = emitens.item;
		try {
			if (current) {
				await emitens.update(current.id, values);
			} else {
				await emitens.create(values);
			}
			openForm = false;
			toastSuccess('Data emiten berhasil disimpan');
			load();
		} catch {
			toastError('Gagal menyimpan data emiten');
		}
	}

	async function handleDelete() {
		if (deleteId === null) return;
		try {
			await emitens.remove(deleteId);
			deleteId = null;
			toastSuccess('Emiten berhasil dihapus');
			load();
		} catch {
			toastError('Gagal menghapus emiten');
		}
	}

	async function handleImport() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.txt,.csv';
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;
			importing = true;
			try {
				const res = await emitenService.importEod(file);
				toastSuccess(`Import selesai: ${res.data.updated} diperbarui, ${res.data.skipped} dilewati`);
				load();
			} catch {
				toastError('Gagal mengimport data EOD');
			} finally {
				importing = false;
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
			<button type="button" class="btn" onclick={handleImport} disabled={importing}>
				<Upload size={16} /> {importing ? 'Importing...' : 'Import EOD'}
			</button>
		{/if}
	{/snippet}
</CrudPage>

<EmitenFormDialog
	open={openForm}
	item={emitens.item}
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
