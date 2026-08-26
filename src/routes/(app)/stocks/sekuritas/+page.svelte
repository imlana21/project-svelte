<script lang="ts">
	import { onMount } from 'svelte';
	import { Pencil, Plus, Trash2 } from '@lucide/svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import { useSekuritasAdmin } from '$lib/hooks/useSekuritasAdmin.svelte';
	import { usePermission } from '$lib/hooks/usePermission.svelte';
	import { PERMISSIONS } from '$lib/utils/permission-registry';
	import { toastError, toastSuccess } from '$lib/utils/toaster.svelte';
	import { formatRupiah } from '$lib/utils/format';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { StockSekuritas } from '$lib/types/Stock';
	import { sekuritasColumns } from './-partials/columns';
	import SekuritasFormDialog, { type SekuritasForm } from './-partials/form.dialog.svelte';

	const sekuritas = useSekuritasAdmin();
	const { can } = usePermission();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('code');
	let sortOrder = $state<SortOrder>('asc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openForm = $state(false);
	let deleteId = $state<number | null>(null);

	async function load() {
		try {
			await sekuritas.fetchAll({ page, perPage, search, orderBy: sortKey, orderDirection: sortOrder });
		} catch (e) {
			toastError(e);
		}
	}

	onMount(load);

	function handleSearch(value: string) { search = value; page = 1; load(); }
	function handlePageChange(next: number) { page = next; load(); }
	function handlePerPageChange(next: number) { perPage = next; page = 1; load(); }
	function handleSort(key: string) {
		if (sortKey === key) sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		else { sortKey = key; sortOrder = 'asc'; }
		load();
	}

	function openCreate() { sekuritas.setItem(undefined); openForm = true; }
	function openEditFor(row: StockSekuritas) { sekuritas.setItem(row); openForm = true; }

	async function handleSubmit(values: SekuritasForm) {
		const current = sekuritas.item;
		try {
			if (current) {
				await sekuritas.update(current.id, values);
			} else {
				await sekuritas.create(values);
			}
			openForm = false;
			toastSuccess('Data sekuritas berhasil disimpan');
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleDelete() {
		if (deleteId === null) return;
		try {
			await sekuritas.remove(deleteId);
			deleteId = null;
			toastSuccess('Sekuritas berhasil dihapus');
			load();
		} catch (e) {
			toastError(e);
		}
	}
</script>

{#snippet cell(item: StockSekuritas, column: ColumnDef)}
	{#if column.key === 'code'}
		<span class="badge bg-primary-500 text-primary-contrast-500">{item.code}</span>
	{:else if column.key === 'name'}
		PT. {item.name}
	{:else if column.key === 'balance'}
		{formatRupiah(item.balance)}
	{/if}
{/snippet}

{#snippet rowActions(item: StockSekuritas)}
	<div class="inline-flex items-center gap-1">
		{#if can(PERMISSIONS.stocksSekuritas.update)}
			<button type="button" class="btn btn-icon" title="Ubah" onclick={() => openEditFor(item)}>
				<Pencil size={16} />
			</button>
		{/if}
		{#if can(PERMISSIONS.stocksSekuritas.delete)}
			<button type="button" class="btn btn-icon text-error-600 dark:text-error-400" title="Hapus" onclick={() => (deleteId = item.id)}>
				<Trash2 size={16} />
			</button>
		{/if}
	</div>
{/snippet}

<CrudPage
	title="Sekuritas"
	description="Daftar sekuritas (RDI) yang terdaftar"
	columns={sekuritasColumns}
	items={sekuritas.items}
	meta={sekuritas.meta}
	loading={sekuritas.loading}
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
		{#if can(PERMISSIONS.stocksSekuritas.create)}
			<button type="button" class="btn bg-primary-500 text-primary-contrast-500" onclick={openCreate}>
				<Plus size={16} /> Tambah
			</button>
		{/if}
	{/snippet}
</CrudPage>

<SekuritasFormDialog
	open={openForm}
	item={sekuritas.item}
	saving={sekuritas.loading}
	onOpenChange={(o) => (openForm = o)}
	onSubmit={handleSubmit}
/>

<ConfirmDialog
	open={deleteId !== null}
	title="Hapus Sekuritas"
	message="Yakin ingin menghapus sekuritas ini?"
	confirmLabel="Hapus"
	loading={sekuritas.loading}
	onConfirm={handleDelete}
	onClose={() => (deleteId = null)}
/>
