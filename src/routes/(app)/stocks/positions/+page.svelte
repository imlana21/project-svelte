<script lang="ts">
	import { onMount } from 'svelte';
	import { Eye } from '@lucide/svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import { useCrud } from '$lib/hooks/useCrud.svelte';
	import { toastError } from '$lib/utils/toaster.svelte';
	import { formatRupiah } from '$lib/utils/format';
	import * as positionService from '$lib/services/position.service';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { StockPosition } from '$lib/types/Stock';
	import { positionColumns } from './-partials/columns';
	import PositionDetailDialog from './-partials/detail.dialog.svelte';

	const positions = useCrud<StockPosition>({
		fetchAll: positionService.fetchPositions,
		fetchById: positionService.fetchPosition,
	});

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('created_at');
	let sortOrder = $state<SortOrder>('asc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openDetail = $state(false);

	async function load() {
		try {
			await positions.fetchAll({ page, perPage, search, orderBy: sortKey, orderDirection: sortOrder });
		} catch {
			toastError('Gagal memuat data posisi');
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

	async function openDetailFor(row: StockPosition) {
		positions.setItem(row);
		openDetail = true;
		try { await positions.fetchById(row.id); } catch { toastError('Gagal memuat detail posisi'); }
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

{#snippet rowActions(item: StockPosition)}
	<button type="button" class="btn btn-icon" title="Detail" onclick={() => openDetailFor(item)}>
		<Eye size={16} />
	</button>
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
	cell={cell}
	rowActions={rowActions}
/>

<PositionDetailDialog
	open={openDetail}
	item={positions.item}
	onOpenChange={(o) => (openDetail = o)}
/>
