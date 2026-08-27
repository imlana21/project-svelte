<script lang="ts">
	import { onMount } from 'svelte';
	import { Pencil, Plus, Trash2, Eye } from '@lucide/svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import { useAnalysisAdmin } from '$lib/hooks/useAnalysisAdmin.svelte';
	import { usePermission } from '$lib/hooks/usePermission.svelte';
	import { PERMISSIONS } from '$lib/utils/permission-registry';
	import { toastError, toastSuccess } from '$lib/utils/toaster.svelte';
	import { formatDate } from '$lib/utils/format';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { StockAnalysis } from '$lib/types/Stock';
	import { analysisColumns } from './-partials/columns';
	import AnalysisDetailDialog from './-partials/detail.dialog.svelte';
	import AnalysisFormDialog from './-partials/form.dialog.svelte';

	const analyses = useAnalysisAdmin();
	const { can } = usePermission();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('created_at');
	let sortOrder = $state<SortOrder>('desc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openDetail = $state(false);
	let openForm = $state(false);
	let editItem = $state<StockAnalysis | undefined>(undefined);
	let detailItem = $state<StockAnalysis | undefined>(undefined);
	let deleteId = $state<number | null>(null);

	async function load() {
		try {
			await analyses.fetchAll({ page, perPage, search, orderBy: sortKey, orderDirection: sortOrder });
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

	function openCreate() {
		editItem = undefined;
		openForm = true;
	}

	function openEdit(row: StockAnalysis) {
		editItem = row;
		openForm = true;
	}

	function openDetailFor(row: StockAnalysis) {
		detailItem = row;
		openDetail = true;
	}

	async function handleSubmit(values: any, imageFile?: File) {
		try {
			if (editItem) {
				if (imageFile) {
					await analyses.updateWithImage(editItem.id, values, imageFile);
				} else {
					await analyses.update(editItem.id, values);
				}
				toastSuccess('Analisis berhasil diperbarui');
			} else {
				if (imageFile) {
					await analyses.createWithImage(values, imageFile);
				} else {
					await analyses.create(values);
				}
				toastSuccess('Analisis berhasil ditambahkan');
			}
			openForm = false;
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleDelete() {
		if (deleteId === null) return;
		try {
			await analyses.remove(deleteId);
			deleteId = null;
			toastSuccess('Analisis berhasil dihapus');
			load();
		} catch (e) {
			toastError(e);
		}
	}
</script>

{#snippet cell(item: StockAnalysis, column: ColumnDef)}
	{#if column.key === 'ticker'}
		<span class="badge">{item.ticker}</span>
	{:else if column.key === 'range_buy'}
		<span class="text-sm">{item.range_buy}</span>
	{:else if column.key === 'tp1'}
		{item.tp1}
	{:else if column.key === 'tp2'}
		{item.tp2}
	{:else if column.key === 'sl'}
		{item.sl}
	{:else if column.key === 'source'}
		<span class="text-sm">{item.source}</span>
	{:else if column.key === 'is_valid'}
		<span class="badge {item.is_valid ? 'bg-success-500 text-success-contrast-500' : 'bg-surface-500 text-surface-contrast-500'}">
			{item.is_valid ? 'Valid' : 'Invalid'}
		</span>
	{:else if column.key === 'created_at'}
		{formatDate(item.created_at)}
	{/if}
{/snippet}

{#snippet rowActions(item: StockAnalysis)}
	<div class="flex items-center gap-1">
		{#if can(PERMISSIONS.stocksAnalyses.read)}
			<button type="button" class="btn btn-icon" title="Detail" onclick={() => openDetailFor(item)}>
				<Eye size={16} />
			</button>
		{/if}
		{#if can(PERMISSIONS.stocksAnalyses.update)}
			<button type="button" class="btn btn-icon" title="Edit" onclick={() => openEdit(item)}>
				<Pencil size={16} />
			</button>
		{/if}
		{#if can(PERMISSIONS.stocksAnalyses.delete)}
			<button type="button" class="btn btn-icon text-error-600 dark:text-error-400" title="Hapus" onclick={() => (deleteId = item.id)}>
				<Trash2 size={16} />
			</button>
		{/if}
	</div>
{/snippet}

<CrudPage
	title="Analisis"
	description="Daftar analisis saham"
	columns={analysisColumns}
	items={analyses.items}
	meta={analyses.meta}
	loading={analyses.loading}
	{search}
	{sortConfig}
	onSearch={handleSearch}
	onSort={handleSort}
	onPageChange={handlePageChange}
	onPerPageChange={handlePerPageChange}
	{cell}
	{rowActions}
>
	{#snippet actions()}
		{#if can(PERMISSIONS.stocksAnalyses.create)}
			<button type="button" class="btn bg-primary-500 text-primary-contrast-500" onclick={openCreate}>
				<Plus size={16} /> Tambah
			</button>
		{/if}
	{/snippet}
</CrudPage>

<AnalysisDetailDialog
	open={openDetail}
	item={detailItem}
	onOpenChange={(o) => (openDetail = o)}
/>

<AnalysisFormDialog
	open={openForm}
	item={editItem}
	saving={analyses.loading}
	onOpenChange={(o) => (openForm = o)}
	onSubmit={handleSubmit}
/>

<ConfirmDialog
	open={deleteId !== null}
	title="Hapus Analisis"
	message="Yakin ingin menghapus analisis ini?"
	confirmLabel="Hapus"
	loading={analyses.loading}
	onConfirm={handleDelete}
	onClose={() => (deleteId = null)}
/>
