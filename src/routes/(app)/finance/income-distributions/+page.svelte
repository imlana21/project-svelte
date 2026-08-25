<script lang="ts">
	import { onMount } from 'svelte';
	import { Eye } from '@lucide/svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import { useCrud } from '$lib/hooks/useCrud.svelte';
	import { toastError } from '$lib/utils/toaster.svelte';
	import { formatRupiah } from '$lib/utils/format';
	import * as incomeService from '$lib/services/income.service';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { FinanceIncome } from '$lib/types/finance/Income';
	import { incomeDistributionColumns } from './-partials/columns';
	import IncomeDistributionDetailDialog from './-partials/detail.dialog.svelte';

	const incomes = useCrud<FinanceIncome>({
		fetchAll: incomeService.fetchIncomes,
	});

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('period');
	let sortOrder = $state<SortOrder>('desc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openDetail = $state(false);

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
</script>

{#snippet cell(item: FinanceIncome, column: ColumnDef)}
	{#if column.key === 'period'}
		{new Date(item.period).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
	{:else if column.key === 'source'}
		{item.source || '-'}
	{:else if column.key === 'amount'}
		{formatRupiah(item.amount)}
	{:else if column.key === 'is_distributed'}
		{#if item.is_distributed}
			<span class="badge bg-success-500 text-success-contrast-500">Terdistribusi</span>
		{:else}
			<span class="badge bg-surface-300 text-surface-700 dark:bg-surface-700 dark:text-surface-200">Belum</span>
		{/if}
	{/if}
{/snippet}

{#snippet rowActions(item: FinanceIncome)}
	<button type="button" class="btn btn-icon" title="Detail" onclick={() => { incomes.setItem(item); openDetail = true; }}>
		<Eye size={16} />
	</button>
{/snippet}

<CrudPage
	title="Distribusi Pemasukan"
	description="Lihat distribusi pemasukan ke masing-masing pocket berdasarkan alokasi dana"
	columns={incomeDistributionColumns}
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
/>

<IncomeDistributionDetailDialog
	open={openDetail}
	item={incomes.item?.distributions?.[0]}
	onOpenChange={(o) => (openDetail = o)}
/>
