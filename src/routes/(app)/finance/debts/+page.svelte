<script lang="ts">
	import { onMount } from 'svelte';
	import { Check, Pencil, Plus, Trash2, X } from '@lucide/svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import { useDebtAdmin } from '$lib/hooks/useDebtAdmin.svelte';
	import { usePermission } from '$lib/hooks/usePermission.svelte';
	import { PERMISSIONS } from '$lib/utils/permission-registry';
	import { toastError, toastSuccess } from '$lib/utils/toaster.svelte';
	import { formatRupiah } from '$lib/utils/format';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { FinanceDebt } from '$lib/types/finance/Debt';
	import { debtColumns } from './-partials/columns';
	import DebtFormDialog, { type DebtForm } from './-partials/form.dialog.svelte';

	const debts = useDebtAdmin();
	const { can } = usePermission();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('due_date');
	let sortOrder = $state<SortOrder>('asc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openForm = $state(false);
	let editItem = $state<FinanceDebt | undefined>(undefined);
	let deleteId = $state<number | null>(null);
	let togglingId = $state<number | null>(null);

	async function load() {
		try {
			await debts.fetchAll({ page, perPage, search, orderBy: sortKey, orderDirection: sortOrder });
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
	function openEditFor(row: FinanceDebt) { editItem = row; openForm = true; }

	async function handleSubmit(values: DebtForm) {
		try {
			if (editItem) {
				await debts.update(editItem.id, values);
			} else {
				await debts.create(values);
			}
			openForm = false;
			toastSuccess('Data utang berhasil disimpan');
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleTogglePaid(row: FinanceDebt) {
		togglingId = row.id;
		try {
			await debts.togglePaid(row.id, row.is_paid_this_month);
			toastSuccess(row.is_paid_this_month ? 'Utang ditandai belum lunas' : 'Utang ditandai lunas');
			load();
		} catch (e) {
			toastError(e);
		} finally {
			togglingId = null;
		}
	}

	async function handleDelete() {
		if (deleteId === null) return;
		try {
			await debts.remove(deleteId);
			deleteId = null;
			toastSuccess('Utang berhasil dihapus');
			load();
		} catch (e) {
			toastError(e);
		}
	}
</script>

{#snippet cell(item: FinanceDebt, column: ColumnDef)}
	{#if column.key === 'name'}
		{item.name}
	{:else if column.key === 'pocket'}
		{item.pocket?.name ?? '-'}
	{:else if column.key === 'amount_per_month'}
		{formatRupiah(item.amount_per_month)}
	{:else if column.key === 'due_date'}
		Tgl {item.due_date}
	{:else if column.key === 'is_paid_this_month'}
		<StatusBadge value={item.is_paid_this_month} trueLabel="Lunas" falseLabel="Belum" />
	{:else if column.key === 'is_active'}
		<StatusBadge value={item.is_active} trueLabel="Aktif" falseLabel="Nonaktif" />
	{/if}
{/snippet}

{#snippet rowActions(item: FinanceDebt)}
	<div class="inline-flex items-center gap-1">
		{#if can(PERMISSIONS.financeDebts.update)}
			{#if item.is_active}
				<button
					type="button"
					class="btn btn-icon {item.is_paid_this_month ? 'text-error-600 dark:text-error-400' : 'text-success-600 dark:text-success-400'}"
					title={item.is_paid_this_month ? 'Tandai Belum Lunas' : 'Tandai Lunas'}
					disabled={togglingId === item.id}
					onclick={() => handleTogglePaid(item)}
				>
					{#if item.is_paid_this_month}
						<X size={16} />
					{:else}
						<Check size={16} />
					{/if}
				</button>
			{/if}
			<button type="button" class="btn btn-icon" title="Ubah" onclick={() => openEditFor(item)}>
				<Pencil size={16} />
			</button>
		{/if}
		{#if can(PERMISSIONS.financeDebts.delete)}
			<button type="button" class="btn btn-icon text-error-600 dark:text-error-400" title="Hapus" onclick={() => (deleteId = item.id)}>
				<Trash2 size={16} />
			</button>
		{/if}
	</div>
{/snippet}

<CrudPage
	title="Utang"
	description="Daftar utang bulanan beserta status pembayaran"
	columns={debtColumns}
	items={debts.items}
	meta={debts.meta}
	loading={debts.loading}
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
		{#if can(PERMISSIONS.financeDebts.create)}
			<button type="button" class="btn bg-primary-500 text-primary-contrast-500" onclick={openCreate}>
				<Plus size={16} /> Tambah
			</button>
		{/if}
	{/snippet}
</CrudPage>

<DebtFormDialog
	open={openForm}
	item={editItem}
	saving={debts.loading}
	onOpenChange={(o) => (openForm = o)}
	onSubmit={handleSubmit}
/>

<ConfirmDialog
	open={deleteId !== null}
	title="Hapus Utang"
	message="Yakin ingin menghapus utang ini? Utang tidak dapat dihapus jika sudah memiliki catatan transaksi pembayaran."
	confirmLabel="Hapus"
	loading={debts.loading}
	onConfirm={handleDelete}
	onClose={() => (deleteId = null)}
/>
