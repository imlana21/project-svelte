<script lang="ts">
	import { onMount } from 'svelte';
	import { Eye } from '@lucide/svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import { useCrud } from '$lib/hooks/useCrud.svelte';
	import { toastError } from '$lib/utils/toaster.svelte';
	import { formatDate, formatNumber, formatRupiah } from '$lib/utils/format';
	import * as transactionService from '$lib/services/transaction.service';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { RealizedPnL } from '$lib/types/Stock';
	import { realizedPnLColumns } from './-partials/columns';
	import RealizedPnLDetailDialog from './-partials/detail.dialog.svelte';

	const realized = useCrud<RealizedPnL>({
		fetchAll: transactionService.fetchRealizedHistory,
	});

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('date');
	let sortOrder = $state<SortOrder>('desc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openDetail = $state(false);

	async function load() {
		try {
			await realized.fetchAll({ page, perPage, search, orderBy: sortKey, orderDirection: sortOrder });
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

	function openDetailFor(row: RealizedPnL) {
		realized.setItem(row);
		openDetail = true;
	}
</script>

{#snippet cell(item: RealizedPnL, column: ColumnDef)}
	{#if column.key === 'date'}
		{formatDate(item.date)}
	{:else if column.key === 'ticker'}
		<span class="badge">{item.position?.emiten?.ticker ?? '-'}</span>
	{:else if column.key === 'lot'}
		{formatNumber(item.lot)}
	{:else if column.key === 'price'}
		{formatRupiah(item.price)}
	{:else if column.key === 'realized_pnl'}
		<span class="font-bold {item.realized_pnl >= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}">
			{formatRupiah(item.realized_pnl)}
		</span>
	{/if}
{/snippet}

{#snippet rowActions(item: RealizedPnL)}
	<button type="button" class="btn btn-icon" title="Detail" onclick={() => openDetailFor(item)}>
		<Eye size={16} />
	</button>
{/snippet}

<CrudPage
	title="Realized PnL"
	description="Laporan realized profit and loss dari transaksi penjualan"
	columns={realizedPnLColumns}
	items={realized.items}
	meta={realized.meta}
	loading={realized.loading}
	{search}
	{sortConfig}
	onSearch={handleSearch}
	onSort={handleSort}
	onPageChange={handlePageChange}
	onPerPageChange={handlePerPageChange}
	cell={cell}
	rowActions={rowActions}
/>

<RealizedPnLDetailDialog
	open={openDetail}
	item={realized.item}
	onOpenChange={(o) => (openDetail = o)}
/>
