<script lang="ts">
	import { onMount } from 'svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import { usePositionAdmin } from '$lib/hooks/usePositionAdmin.svelte';
	import { usePermission } from '$lib/hooks/usePermission.svelte';
	import { PERMISSIONS } from '$lib/utils/permission-registry';
	import { toastError, toastSuccess } from '$lib/utils/toaster.svelte';
	import { formatRupiah } from '$lib/utils/format';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { StockPosition } from '$lib/types/Stock';
	import { positionColumns } from './-partials/columns';
	import PositionDetailDialog from './-partials/detail.dialog.svelte';
	import PositionEditDialog, { type PositionEditForm } from './-partials/edit.dialog.svelte';

	const positions = usePositionAdmin();
	const { can } = usePermission();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('created_at');
	let sortOrder = $state<SortOrder>('asc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openDetail = $state(false);
	let openEdit = $state(false);
	let editItem = $state<StockPosition | undefined>(undefined);
	let detailItem = $state<StockPosition | undefined>(undefined);

	async function load() {
		try {
			await positions.fetchAll({ page, perPage, search, orderBy: sortKey, orderDirection: sortOrder });
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

	function openDetailFor(row: StockPosition) {
		detailItem = row;
		openDetail = true;
	}

	function openEditFor(row: StockPosition) {
		editItem = row;
		openEdit = true;
	}

	async function handleSubmit(values: PositionEditForm) {
		if (!editItem) return;
		try {
			await positions.update(editItem.id, values);
			openEdit = false;
			toastSuccess('Data posisi berhasil disimpan');
			load();
		} catch (e) {
			toastError(e);
		}
	}
</script>

{#snippet cell(item: StockPosition, column: ColumnDef)}
	{#if column.key === 'emiten'}
		<span class="badge">{item.emiten?.ticker ?? '-'}</span>
	{:else if column.key === 'lot'}
		{item.lot}
	{:else if column.key === 'avg_price'}
		{formatRupiah(item.avg_price)}
	{:else if column.key === 'status'}
		<StatusBadge value={item.status === 'open'} trueLabel="Open" falseLabel="Closed" />
	{:else if column.key === 'trend'}
		<span class="badge capitalize">{item.trend}</span>
	{:else if column.key === 'open_date'}
		{new Date(item.open_date).toLocaleDateString('id-ID')}
	{/if}
{/snippet}

<CrudPage
	title="Posisi"
	description="Daftar posisi saham aktif dan tertutup"
	columns={positionColumns}
	items={positions.items}
	meta={positions.meta}
	loading={positions.loading}
	{search}
	{sortConfig}
	onSearch={handleSearch}
	onSort={handleSort}
	onPageChange={handlePageChange}
	onPerPageChange={handlePerPageChange}
	{cell}
	canEdit={can(PERMISSIONS.stocksPositions.update)}
	canDelete={false}
	onEdit={openEditFor}
	onDetail={openDetailFor}
/>

<PositionDetailDialog
	open={openDetail}
	item={detailItem}
	onOpenChange={(o) => (openDetail = o)}
/>

<PositionEditDialog
	open={openEdit}
	item={editItem}
	saving={positions.loading}
	onOpenChange={(o) => (openEdit = o)}
	onSubmit={handleSubmit}
/>
