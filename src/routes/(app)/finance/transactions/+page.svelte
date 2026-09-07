<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus } from '@lucide/svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import { useFinanceTransactionAdmin } from '$lib/hooks/useFinanceTransactionAdmin.svelte';
	import { usePermission } from '$lib/hooks/usePermission.svelte';
	import { PERMISSIONS } from '$lib/utils/permission-registry';
	import { toastError, toastSuccess } from '$lib/utils/toaster.svelte';
	import { formatDate, formatRupiah } from '$lib/utils/format';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { FinanceTransaction } from '$lib/types/finance/Transaction';
	import { transactionColumns } from './-partials/columns';
	import TransactionFormDialog, { type TransactionForm } from './-partials/form.dialog.svelte';

	const transactions = useFinanceTransactionAdmin();
	const { can } = usePermission();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('date');
	let sortOrder = $state<SortOrder>('desc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openForm = $state(false);
	let editItem = $state<FinanceTransaction | undefined>(undefined);
	let deleteId = $state<number | null>(null);

	async function load() {
		try {
			await transactions.fetchAll({ page, perPage, search, orderBy: sortKey, orderDirection: sortOrder });
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

	function openCreate() { editItem = undefined; openForm = true; }
	function openEditFor(row: FinanceTransaction) { editItem = row; openForm = true; }

	async function handleSubmit(values: TransactionForm) {
		try {
			if (editItem) {
				await transactions.update(editItem.id, { description: values.description, category_tag: values.category_tag, date: values.date, note: values.note });
			} else {
				await transactions.create({ type: values.type, pocket_id: values.pocket_id, amount: values.amount, description: values.description, category_tag: values.category_tag, date: values.date, note: values.note });
			}
			openForm = false;
			toastSuccess('Transaksi keuangan berhasil disimpan');
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleDelete() {
		if (deleteId === null) return;
		try {
			await transactions.remove(deleteId);
			deleteId = null;
			toastSuccess('Transaksi berhasil dihapus');
			load();
		} catch (e) {
			toastError(e);
		}
	}
</script>

{#snippet cell(item: FinanceTransaction, column: ColumnDef)}
	{#if column.key === 'date'}
		{formatDate(item.date)}
	{:else if column.key === 'type'}
		<span class="badge whitespace-nowrap {item.type === 'income' ? 'bg-success-500 text-success-contrast-500' : item.type === 'expense' ? 'bg-error-500 text-error-contrast-500' : item.type === 'debt_payment' ? 'bg-warning-500 text-warning-contrast-500' : 'bg-blue-500 text-blue-contrast-500'} capitalize">
			{item.type}
		</span>
	{:else if column.key === 'description'}
		{item.description}
	{:else if column.key === 'pocket'}
		{item.pocket?.name ?? '-'}
	{:else if column.key === 'category_tag'}
		{item.category_tag ? item.category_tag : '-'}
	{:else if column.key === 'amount'}
		<span class="font-bold tabular-nums {item.type === 'income' ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}">
			{item.type === 'income' ? '+' : '-'}{formatRupiah(item.amount)}
		</span>
	{/if}
{/snippet}

<CrudPage
	title="Transaksi Keuangan"
	description="Daftar transaksi pengeluaran, transfer, pemasukan, dan pembayaran utang"
	columns={transactionColumns}
	items={transactions.items}
	meta={transactions.meta}
	loading={transactions.loading}
	{search}
	{sortConfig}
	onSearch={handleSearch}
	onSort={handleSort}
	onPageChange={handlePageChange}
	onPerPageChange={handlePerPageChange}
	{cell}
	canEdit={can(PERMISSIONS.financeTransactions.update)}
	canDelete={can(PERMISSIONS.financeTransactions.delete)}
	onEdit={openEditFor}
	onDelete={(item) => { deleteId = item.id; }}
>
	{#snippet actions()}
		{#if can(PERMISSIONS.financeTransactions.create)}
			<button type="button" class="btn bg-primary-500 text-primary-contrast-500" onclick={openCreate}>
				<Plus size={16} /> Tambah Pengeluaran
			</button>
		{/if}
	{/snippet}
</CrudPage>

<TransactionFormDialog
	open={openForm}
	item={editItem}
	saving={transactions.loading}
	onOpenChange={(o) => (openForm = o)}
	onSubmit={handleSubmit}
/>

<ConfirmDialog
	open={deleteId !== null}
	title="Hapus Transaksi"
	message="Yakin ingin menghapus transaksi ini? Saldo pocket akan dikembalikan."
	confirmLabel="Hapus"
	loading={transactions.loading}
	onConfirm={handleDelete}
	onClose={() => (deleteId = null)}
/>
