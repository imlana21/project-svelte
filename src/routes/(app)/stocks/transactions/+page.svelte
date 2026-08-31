<script lang="ts">
	import { onMount } from "svelte";
	import { Download, FileSpreadsheet, Upload } from "@lucide/svelte";
	import CrudPage from "$lib/components/ui/CrudPage.svelte";
	import ConfirmDialog from "$lib/components/ui/ConfirmDialog.svelte";
	import { useTransactionAdmin } from "$lib/hooks/useTransactionAdmin.svelte";
	import { usePermission } from "$lib/hooks/usePermission.svelte";
	import { PERMISSIONS } from "$lib/utils/permission-registry";
	import { toastError, toastSuccess } from "$lib/utils/toaster.svelte";
	import { formatDate, formatNumber, formatRupiah } from "$lib/utils/format";
	import type { ColumnDef, SortOrder } from "$lib/types/Api";
	import type {
		StockTransaction,
		StoreTransactionPayload,
	} from "$lib/types/Stock";
	// import { transactionColumns } from "./-partials/columns";
	import BuyDialog from "./-partials/buy.transaction.dialog.svelte";
	import SellDialog from "./-partials/sell.transaction.dialog.svelte";
	import ImportDialog from "./-partials/import.dialog.svelte";
	import type { ImportTransactionResult } from "$lib/services/transaction.service";

	const transactions = useTransactionAdmin();
	const { can } = usePermission();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state("");
	let sortKey = $state("date");
	let sortOrder = $state<SortOrder>("desc");
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openBuyForm = $state(false);
	let openSellForm = $state(false);
	let openImportDialog = $state(false);
	let deleteId = $state<number | null>(null);

	async function load() {
		try {
			await transactions.fetchAll({
				page,
				perPage,
				search,
				orderBy: sortKey,
				orderDirection: sortOrder,
			});
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
	function handlePageChange(next: number) {
		page = next;
		load();
	}
	function handlePerPageChange(next: number) {
		perPage = next;
		page = 1;
		load();
	}
	function handleSort(key: string) {
		if (sortKey === key) sortOrder = sortOrder === "asc" ? "desc" : "asc";
		else {
			sortKey = key;
			sortOrder = "asc";
		}
		load();
	}

	function openBuy() {
		openBuyForm = true;
	}
	function openSell() {
		openSellForm = true;
	}

	async function handleSubmit(values: StoreTransactionPayload) {
		try {
			await transactions.create(values);
			openBuyForm = false;
			openSellForm = false;
			toastSuccess("Transaksi berhasil dicatat");
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
			toastSuccess("Transaksi berhasil dihapus");
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleImport(file: File): Promise<ImportTransactionResult> {
		const res = await transactions.importTransactions(file);
		toastSuccess(`Import selesai: ${res.data.imported} berhasil, ${res.data.skipped} dilewati`);
		load();
		return res.data;
	}

	const transactionColumns: ColumnDef[] = [
		{ key: "type", label: "Jenis", sortable: true, className: "text-center" },
		{ key: "ticker", label: "Emiten", sortable: true },
		{ key: "lot", label: "Lot" },
		{ key: "price", label: "Harga" },
		{ key: "fee", label: "Fee" },
		{ key: "total", label: "Total" },
		{ key: "date", label: "Tanggal", sortable: true },
	];
</script>

{#snippet cell(item: StockTransaction, column: ColumnDef)}
	{#if column.key === "type"}
		<span
			class="badge {item.type === 'buy'
				? 'bg-success-500 text-success-contrast-500'
				: 'bg-error-500 text-error-contrast-500'} capitalize"
		>
			{item.type}
		</span>
	{:else if column.key === "ticker"}
		<span class="badge">{item.position?.emiten?.ticker ?? "-"}</span>
	{:else if column.key === "lot"}
		{formatNumber(item.lot)}
	{:else if column.key === "price"}
		{formatRupiah(item.price)}
	{:else if column.key === "fee"}
		{formatRupiah(item.fee)}
	{:else if column.key === "total"}
		{formatRupiah(item.price * item.lot * 100 + item.fee)}
	{:else if column.key === "date"}
		{formatDate(item.date)}
	{/if}
{/snippet}

<CrudPage
	title="Transaksi"
	description="Catat transaksi beli dan jual saham"
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
	canEdit={false}
	canDelete={can(PERMISSIONS.stocksTransactions.delete)}
	onDelete={(item) => { deleteId = item.id; }}
>
	{#snippet actions()}
		{#if can(PERMISSIONS.stocksTransactions.create)}
			<button
				type="button"
				class="btn bg-success-500 text-success-contrast-500"
				onclick={openBuy}
			>
				<Upload size={16} /> Beli
			</button>
			<button
				type="button"
				class="btn bg-error-500 text-error-contrast-500"
				onclick={openSell}
			>
				<Download size={16} /> Jual
			</button>
			<button
				type="button"
				class="btn"
				onclick={() => (openImportDialog = true)}
				disabled={transactions.importing}
			>
				<FileSpreadsheet size={16} /> {transactions.importing ? 'Importing...' : 'Import'}
			</button>
		{/if}
	{/snippet}
</CrudPage>

<BuyDialog
	open={openBuyForm}
	saving={transactions.loading}
	onOpenChange={(o) => (openBuyForm = o)}
	onSubmit={handleSubmit}
/>

<SellDialog
	open={openSellForm}
	saving={transactions.loading}
	onOpenChange={(o) => (openSellForm = o)}
	onSubmit={handleSubmit}
/>

<ImportDialog
	open={openImportDialog}
	saving={transactions.importing}
	onOpenChange={(o) => (openImportDialog = o)}
	onSubmit={handleImport}
/>

<ConfirmDialog
	open={deleteId !== null}
	title="Hapus Transaksi"
	message="Yakin ingin menghapus transaksi ini? Saldo sekuritas akan dikembalikan."
	confirmLabel="Hapus"
	loading={transactions.loading}
	onConfirm={handleDelete}
	onClose={() => (deleteId = null)}
/>
