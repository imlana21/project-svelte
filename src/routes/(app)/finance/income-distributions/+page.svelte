<script lang="ts">
	import { onMount } from "svelte";
	import CrudPage from "$lib/components/ui/CrudPage.svelte";
	import { useIncomeDistributionAdmin } from "$lib/hooks/useIncomeDistributionAdmin.svelte";
	import { toastError } from "$lib/utils/toaster.svelte";
	import { formatRupiah } from "$lib/utils/format";
	import type { ColumnDef, SortOrder } from "$lib/types/Api";
	import type { FinanceIncomeDistribution } from "$lib/types/finance/IncomeDistribution";
	import { incomeDistributionColumns } from "./-partials/columns";
	import { Eye } from "@lucide/svelte";

	const distributions = useIncomeDistributionAdmin();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state("");
	let sortKey = $state("created_at");
	let sortOrder = $state<SortOrder>("desc");
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openDetail = $state(false);
	let detailItem = $state<FinanceIncomeDistribution | undefined>(undefined);

	async function load() {
		try {
			await distributions.fetchAll({
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
</script>

{#snippet cell(item: FinanceIncomeDistribution, column: ColumnDef)}
	{#if column.key === "income_period"}
		{item.income
			? new Date(item.income.period).toLocaleDateString("id-ID", {
					year: "numeric",
					month: "long",
				})
			: "-"}
	{:else if column.key === "pocket"}
		{item.pocket?.name ?? "-"}
	{:else if column.key === "category_name"}
		<span class="badge bg-primary-500 text-primary-contrast-500"
			>{item.category_name}</span
		>
	{:else if column.key === "percentage_snapshot"}
		{(item.percentage_snapshot * 100).toFixed(1)}%
	{:else if column.key === "amount"}
		{formatRupiah(item.amount)}
	{/if}
{/snippet}

{#snippet rowActions(item: FinanceIncomeDistribution)}
	<button
		type="button"
		class="btn btn-icon"
		title="Detail"
		onclick={() => {
			detailItem = item;
			openDetail = true;
		}}
	>
		<Eye size={16} />
	</button>
{/snippet}

<CrudPage
	title="Distribusi Pemasukan"
	description="Lihat distribusi pemasukan ke masing-masing pocket berdasarkan alokasi dana"
	columns={incomeDistributionColumns}
	items={distributions.items}
	meta={distributions.meta}
	loading={distributions.loading}
	{search}
	{sortConfig}
	onSearch={handleSearch}
	onSort={handleSort}
	onPageChange={handlePageChange}
	onPerPageChange={handlePerPageChange}
	{rowActions}
	{cell}
	canEdit={false}
	canDelete={false}
	onDetail={(item) => {
		detailItem = item;
		openDetail = true;
	}}
/>

<IncomeDistributionDetailDialog
	open={openDetail}
	item={detailItem}
	onOpenChange={(o) => (openDetail = o)}
/>
