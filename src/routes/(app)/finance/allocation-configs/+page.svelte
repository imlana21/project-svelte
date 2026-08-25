<script lang="ts">
	import { onMount } from 'svelte';
	import { Pencil, Plus, Trash2 } from '@lucide/svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import { useCrud } from '$lib/hooks/useCrud.svelte';
	import { usePermission } from '$lib/hooks/usePermission.svelte';
	import { PERMISSIONS } from '$lib/utils/permission-registry';
	import { toastError, toastSuccess } from '$lib/utils/toaster.svelte';
	import * as allocationConfigService from '$lib/services/allocation-config.service';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { FinanceAllocationConfig, StoreAllocationConfigPayload, UpdateAllocationConfigPayload } from '$lib/types/finance/AllocationConfig';
	import { allocationConfigColumns } from './-partials/columns';
	import AllocationConfigFormDialog, { type AllocationConfigForm } from './-partials/form.dialog.svelte';

	const allocationConfigs = useCrud<FinanceAllocationConfig, StoreAllocationConfigPayload, UpdateAllocationConfigPayload>({
		fetchAll: allocationConfigService.fetchAllocationConfigs,
		fetchById: allocationConfigService.fetchAllocationConfig,
		create: allocationConfigService.createAllocationConfig,
		update: allocationConfigService.updateAllocationConfig,
		remove: allocationConfigService.deleteAllocationConfig,
	});

	const { can } = usePermission();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('sort_order');
	let sortOrder = $state<SortOrder>('asc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openForm = $state(false);
	let deleteId = $state<number | null>(null);

	async function load() {
		try {
			await allocationConfigs.fetchAll({ page, perPage, search, orderBy: sortKey, orderDirection: sortOrder });
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

	function openCreate() { allocationConfigs.setItem(undefined); openForm = true; }
	function openEditFor(row: FinanceAllocationConfig) { allocationConfigs.setItem(row); openForm = true; }

	async function handleSubmit(values: AllocationConfigForm) {
		const current = allocationConfigs.item;
		try {
			if (current) {
				await allocationConfigs.update(current.id, values);
			} else {
				await allocationConfigs.create(values);
			}
			openForm = false;
			toastSuccess('Data alokasi berhasil disimpan');
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleDelete() {
		if (deleteId === null) return;
		try {
			await allocationConfigs.remove(deleteId);
			deleteId = null;
			toastSuccess('Alokasi berhasil dihapus');
			load();
		} catch (e) {
			toastError(e);
		}
	}
</script>

{#snippet cell(item: FinanceAllocationConfig, column: ColumnDef)}
	{#if column.key === 'sort_order'}
		{item.sort_order}
	{:else if column.key === 'category_name'}
		{item.category_name}
	{:else if column.key === 'percentage'}
		{(item.percentage * 100).toFixed(1)}%
	{:else if column.key === 'is_active'}
		<StatusBadge value={item.is_active} trueLabel="Aktif" falseLabel="Nonaktif" />
	{/if}
{/snippet}

{#snippet rowActions(item: FinanceAllocationConfig)}
	<div class="inline-flex items-center gap-1">
		{#if can(PERMISSIONS.financeAllocationConfigs.update)}
			<button type="button" class="btn btn-icon" title="Ubah" onclick={() => openEditFor(item)}>
				<Pencil size={16} />
			</button>
		{/if}
		{#if can(PERMISSIONS.financeAllocationConfigs.delete)}
			<button type="button" class="btn btn-icon text-error-600 dark:text-error-400" title="Hapus" onclick={() => (deleteId = item.id)}>
				<Trash2 size={16} />
			</button>
		{/if}
	</div>
{/snippet}

<CrudPage
	title="Alokasi Dana"
	description="Konfigurasi persentase alokasi pemasukan ke masing-masing kategori"
	columns={allocationConfigColumns}
	items={allocationConfigs.items}
	meta={allocationConfigs.meta}
	loading={allocationConfigs.loading}
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
		{#if can(PERMISSIONS.financeAllocationConfigs.create)}
			<button type="button" class="btn bg-primary-500 text-primary-contrast-500" onclick={openCreate}>
				<Plus size={16} /> Tambah
			</button>
		{/if}
	{/snippet}
</CrudPage>

<AllocationConfigFormDialog
	open={openForm}
	item={allocationConfigs.item}
	saving={allocationConfigs.loading}
	onOpenChange={(o) => (openForm = o)}
	onSubmit={handleSubmit}
/>

<ConfirmDialog
	open={deleteId !== null}
	title="Hapus Alokasi"
	message="Yakin ingin menghapus alokasi ini? Jika masih terkait dengan pocket, alokasi tidak dapat dihapus."
	confirmLabel="Hapus"
	loading={allocationConfigs.loading}
	onConfirm={handleDelete}
	onClose={() => (deleteId = null)}
/>
