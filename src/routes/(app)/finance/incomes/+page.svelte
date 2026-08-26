<script lang="ts">
	import { onMount } from 'svelte';
	import { Pencil, Plus, RefreshCcw, Trash2 } from '@lucide/svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import { useIncomeAdmin } from '$lib/hooks/useIncomeAdmin.svelte';
	import { usePermission } from '$lib/hooks/usePermission.svelte';
	import { PERMISSIONS } from '$lib/utils/permission-registry';
	import { toastError, toastSuccess } from '$lib/utils/toaster.svelte';
	import { formatRupiah } from '$lib/utils/format';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { FinanceIncome } from '$lib/types/finance/Income';
	import { incomeColumns } from './-partials/columns';
	import IncomeFormDialog, { type IncomeForm } from './-partials/form.dialog.svelte';

	const incomes = useIncomeAdmin();
	const { can } = usePermission();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('period');
	let sortOrder = $state<SortOrder>('desc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openForm = $state(false);
	let deleteId = $state<number | null>(null);
	let distributingId = $state<number | null>(null);

	async function load() {
		try {
			await incomes.fetchAll({ page, perPage, search, orderBy: sortKey, orderDirection: sortOrder });
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

	function openCreate() { incomes.setItem(undefined); openForm = true; }
	function openEditFor(row: FinanceIncome) { incomes.setItem(row); openForm = true; }

	async function handleSubmit(values: IncomeForm) {
		const current = incomes.item;
		try {
			if (current) {
				await incomes.update(current.id, { source: values.source, note: values.note });
			} else {
				await incomes.create({ amount: values.amount, source: values.source, note: values.note, period: values.period });
			}
			openForm = false;
			toastSuccess('Data pemasukan berhasil disimpan');
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleDistribute(row: FinanceIncome) {
		distributingId = row.id;
		try {
			await incomes.distribute(row.id);
			toastSuccess('Pemasukan berhasil didistribusikan');
			load();
		} catch (e) {
			toastError(e);
		} finally {
			distributingId = null;
		}
	}

	async function handleRollback(row: FinanceIncome) {
		distributingId = row.id;
		try {
			await incomes.rollback(row.id);
			toastSuccess('Distribusi pemasukan berhasil dibatalkan');
			load();
		} catch (e) {
			toastError(e);
		} finally {
			distributingId = null;
		}
	}

	async function handleDelete() {
		if (deleteId === null) return;
		try {
			await incomes.remove(deleteId);
			deleteId = null;
			toastSuccess('Pemasukan berhasil dihapus');
			load();
		} catch (e) {
			toastError(e);
		}
	}
</script>

{#snippet cell(item: FinanceIncome, column: ColumnDef)}
	{#if column.key === 'period'}
		{new Date(item.period).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
	{:else if column.key === 'source'}
		{item.source || '-'}
	{:else if column.key === 'amount'}
		{formatRupiah(item.amount)}
	{:else if column.key === 'is_distributed'}
		<StatusBadge value={item.is_distributed} trueLabel="Terdistribusi" falseLabel="Belum" />
	{/if}
{/snippet}

{#snippet rowActions(item: FinanceIncome)}
	<div class="inline-flex items-center gap-1">
		{#if can(PERMISSIONS.financeIncomes.update)}
			{#if item.is_distributed}
				<button
					type="button"
					class="btn btn-icon text-error-600 dark:text-error-400"
					title="Batalkan Distribusi"
					disabled={distributingId === item.id}
					onclick={() => handleRollback(item)}
				>
					<RefreshCcw size={16} />
				</button>
			{:else}
				<button
					type="button"
					class="btn btn-icon text-success-600 dark:text-success-400"
					title="Distribusikan"
					disabled={distributingId === item.id}
					onclick={() => handleDistribute(item)}
				>
					<RefreshCcw size={16} />
				</button>
				<button type="button" class="btn btn-icon" title="Ubah" onclick={() => openEditFor(item)}>
					<Pencil size={16} />
				</button>
			{/if}
		{/if}
		{#if can(PERMISSIONS.financeIncomes.delete)}
			{#if !item.is_distributed}
				<button type="button" class="btn btn-icon text-error-600 dark:text-error-400" title="Hapus" onclick={() => (deleteId = item.id)}>
					<Trash2 size={16} />
				</button>
			{/if}
		{/if}
	</div>
{/snippet}

<CrudPage
	title="Pemasukan"
	description="Catat pemasukan dan distribusikan ke pocket berdasarkan alokasi"
	columns={incomeColumns}
	items={incomes.items}
	meta={incomes.meta}
	loading={incomes.loading}
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
		{#if can(PERMISSIONS.financeIncomes.create)}
			<button type="button" class="btn bg-primary-500 text-primary-contrast-500" onclick={openCreate}>
				<Plus size={16} /> Tambah
			</button>
		{/if}
	{/snippet}
</CrudPage>

<IncomeFormDialog
	open={openForm}
	item={incomes.item}
	saving={incomes.loading}
	onOpenChange={(o) => (openForm = o)}
	onSubmit={handleSubmit}
/>

<ConfirmDialog
	open={deleteId !== null}
	title="Hapus Pemasukan"
	message="Yakin ingin menghapus pemasukan ini? Pemasukan yang sudah terdistribusi tidak dapat dihapus."
	confirmLabel="Hapus"
	loading={incomes.loading}
	onConfirm={handleDelete}
	onClose={() => (deleteId = null)}
/>
