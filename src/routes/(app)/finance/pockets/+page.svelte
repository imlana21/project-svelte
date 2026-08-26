<script lang="ts">
	import { onMount } from 'svelte';
	import { Pencil, Plus, Trash2 } from '@lucide/svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import { usePocketAdmin } from '$lib/hooks/usePocketAdmin.svelte';
	import { usePermission } from '$lib/hooks/usePermission.svelte';
	import { PERMISSIONS } from '$lib/utils/permission-registry';
	import { toastError, toastSuccess } from '$lib/utils/toaster.svelte';
	import { formatRupiah } from '$lib/utils/format';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { FinancePocket } from '$lib/types/finance/Pocket';
	import { pocketColumns } from './-partials/columns';
	import PocketFormDialog, { type PocketForm } from './-partials/form.dialog.svelte';

	const pockets = usePocketAdmin();
	const { can } = usePermission();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('name');
	let sortOrder = $state<SortOrder>('asc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openForm = $state(false);
	let deleteId = $state<number | null>(null);

	async function load() {
		try {
			await pockets.fetchAll({ page, perPage, search, orderBy: sortKey, orderDirection: sortOrder });
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

	function openCreate() { pockets.setItem(undefined); openForm = true; }
	function openEditFor(row: FinancePocket) { pockets.setItem(row); openForm = true; }

	async function handleSubmit(values: PocketForm) {
		const current = pockets.item;
		try {
			if (current) {
				await pockets.update(current.id, values);
			} else {
				await pockets.create(values);
			}
			openForm = false;
			toastSuccess('Data pocket berhasil disimpan');
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleDelete() {
		if (deleteId === null) return;
		try {
			await pockets.remove(deleteId);
			deleteId = null;
			toastSuccess('Pocket berhasil dihapus');
			load();
		} catch (e) {
			toastError(e);
		}
	}
</script>

{#snippet cell(item: FinancePocket, column: ColumnDef)}
	{#if column.key === 'name'}
		{item.name}
	{:else if column.key === 'description'}
		{item.description || '-'}
	{:else if column.key === 'balance'}
		{formatRupiah(item.balance)}
	{:else if column.key === 'allocation_category'}
		<span class="badge bg-primary-500 text-primary-contrast-500">-</span>
	{:else if column.key === 'is_active'}
		<StatusBadge value={item.is_active} trueLabel="Aktif" falseLabel="Nonaktif" />
	{/if}
{/snippet}

{#snippet rowActions(item: FinancePocket)}
	<div class="inline-flex items-center gap-1">
		{#if can(PERMISSIONS.financePockets.update)}
			<button type="button" class="btn btn-icon" title="Ubah" onclick={() => openEditFor(item)}>
				<Pencil size={16} />
			</button>
		{/if}
		{#if can(PERMISSIONS.financePockets.delete)}
			<button type="button" class="btn btn-icon text-error-600 dark:text-error-400" title="Hapus" onclick={() => (deleteId = item.id)}>
				<Trash2 size={16} />
			</button>
		{/if}
	</div>
{/snippet}

<CrudPage
	title="Pocket"
	description="Daftar pocket (rekening) untuk pengelolaan keuangan"
	columns={pocketColumns}
	items={pockets.items}
	meta={pockets.meta}
	loading={pockets.loading}
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
		{#if can(PERMISSIONS.financePockets.create)}
			<button type="button" class="btn bg-primary-500 text-primary-contrast-500" onclick={openCreate}>
				<Plus size={16} /> Tambah
			</button>
		{/if}
	{/snippet}
</CrudPage>

<PocketFormDialog
	open={openForm}
	item={pockets.item}
	saving={pockets.loading}
	onOpenChange={(o) => (openForm = o)}
	onSubmit={handleSubmit}
/>

<ConfirmDialog
	open={deleteId !== null}
	title="Hapus Pocket"
	message="Yakin ingin menghapus pocket ini? Pocket hanya bisa dihapus jika saldo 0, tanpa utang aktif, dan tanpa transaksi."
	confirmLabel="Hapus"
	loading={pockets.loading}
	onConfirm={handleDelete}
	onClose={() => (deleteId = null)}
/>
