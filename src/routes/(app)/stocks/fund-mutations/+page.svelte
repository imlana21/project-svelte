<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Trash2 } from '@lucide/svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import { useCrud } from '$lib/hooks/useCrud.svelte';
	import { usePermission } from '$lib/hooks/usePermission.svelte';
	import { PERMISSIONS } from '$lib/utils/permission-registry';
	import { toastError, toastSuccess } from '$lib/utils/toaster.svelte';
	import { formatDate, formatRupiah } from '$lib/utils/format';
	import * as fundMutationService from '$lib/services/fund-mutation.service';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { StockFundMutation, StoreFundMutationPayload } from '$lib/types/Stock';
	import { fundMutationColumns } from './-partials/columns';
	import FundMutationFormDialog from './-partials/form.dialog.svelte';

	const mutations = useCrud<StockFundMutation, StoreFundMutationPayload>({
		fetchAll: fundMutationService.fetchFundMutations,
		fetchById: fundMutationService.fetchFundMutation,
		create: fundMutationService.createFundMutation,
		remove: fundMutationService.deleteFundMutation,
	});

	const { can } = usePermission();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('created_at');
	let sortOrder = $state<SortOrder>('desc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openForm = $state(false);
	let deleteId = $state<number | null>(null);

	async function load() {
		try {
			await mutations.fetchAll({ page, perPage, search, orderBy: sortKey, orderDirection: sortOrder });
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

	async function handleSubmit(values: StoreFundMutationPayload) {
		try {
			await mutations.create(values);
			openForm = false;
			toastSuccess('Mutasi dana berhasil dicatat');
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleDelete() {
		if (deleteId === null) return;
		try {
			await mutations.remove(deleteId);
			deleteId = null;
			toastSuccess('Mutasi dana berhasil dihapus');
			load();
		} catch (e) {
			toastError(e);
		}
	}
</script>

{#snippet cell(item: StockFundMutation, column: ColumnDef)}
	{#if column.key === 'created_at'}
		{formatDate(item.created_at)}
	{:else if column.key === 'type'}
		<span class="badge {item.type === 'topup' ? 'bg-success-500 text-success-contrast-500' : item.type === 'withdraw' ? 'bg-error-500 text-error-contrast-500' : 'bg-surface-300 text-surface-700 dark:bg-surface-700 dark:text-surface-200'} capitalize">
			{item.type}
		</span>
	{:else if column.key === 'amount'}
		{formatRupiah(item.amount)}
	{:else if column.key === 'sekuritas'}
		{item.sekuritas?.name ?? '-'}
	{:else if column.key === 'note'}
		{item.note || '-'}
	{/if}
{/snippet}

{#snippet rowActions(item: StockFundMutation)}
	{#if can(PERMISSIONS.stocksFundMutations.delete)}
		<button type="button" class="btn btn-icon text-error-600 dark:text-error-400" title="Hapus" onclick={() => (deleteId = item.id)}>
			<Trash2 size={16} />
		</button>
	{/if}
{/snippet}

<CrudPage
	title="Mutasi Dana"
	description="Catat mutasi dana masuk/keluar dari RDI"
	columns={fundMutationColumns}
	items={mutations.items}
	meta={mutations.meta}
	loading={mutations.loading}
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
		{#if can(PERMISSIONS.stocksFundMutations.create)}
			<button type="button" class="btn bg-primary-500 text-primary-contrast-500" onclick={() => (openForm = true)}>
				<Plus size={16} /> Tambah
			</button>
		{/if}
	{/snippet}
</CrudPage>

<FundMutationFormDialog
	open={openForm}
	saving={mutations.loading}
	onOpenChange={(o) => (openForm = o)}
	onSubmit={handleSubmit}
/>

<ConfirmDialog
	open={deleteId !== null}
	title="Hapus Mutasi Dana"
	message="Yakin ingin menghapus mutasi dana ini? Saldo sekuritas akan dikembalikan."
	confirmLabel="Hapus"
	loading={mutations.loading}
	onConfirm={handleDelete}
	onClose={() => (deleteId = null)}
/>
