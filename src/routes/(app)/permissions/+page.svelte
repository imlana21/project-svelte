<script lang="ts">
	import { onMount } from "svelte";
	import { Eye } from "@lucide/svelte";
	import CrudPage from "$lib/components/ui/CrudPage.svelte";
	import { usePermissionAdmin } from "$lib/hooks/usePermissionAdmin.svelte";
	import { toastError } from "$lib/utils/toaster.svelte";
	import type { ColumnDef, SortOrder } from "$lib/types/Api";
	import type { AuthPermission } from "$lib/types/Auth";
	import { permissionColumns } from "./-partials/columns";
	import PermissionDetailDialog from "./-partials/detail.dialog.svelte";

	const crud = usePermissionAdmin();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state("");
	let sortKey = $state("name");
	let sortOrder = $state<SortOrder>("asc");
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openDetail = $state(false);

	async function load() {
		try {
			const res = await crud.fetchAll({
				page,
				perPage,
				search,
				orderBy: sortKey,
				orderDirection: sortOrder,
			});
			return res;
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
		if (sortKey === key) {
			sortOrder = sortOrder === "asc" ? "desc" : "asc";
		} else {
			sortKey = key;
			sortOrder = "asc";
		}
		load();
	}

	async function openDetailFor(row: AuthPermission) {
		crud.setItem(row);
		openDetail = true;
		try {
			await crud.fetchById(row.id);
		} catch (e) {
			toastError(e);
		}
	}
</script>

{#snippet cell(item: AuthPermission, column: ColumnDef)}
	{#if column.key === "name"}
		{item.name}
	{:else if column.key === "slug"}
		<span class="badge font-mono">{item.slug}</span>
	{:else if column.key === "description"}
		{item.description || "-"}
	{/if}
{/snippet}

{#snippet rowActions(item: AuthPermission)}
	<button
		type="button"
		class="btn btn-icon"
		title="Detail"
		onclick={() => openDetailFor(item)}
	>
		<Eye size={16} />
	</button>
{/snippet}

<CrudPage
	title="Permissions"
	description="Daftar permission yang tersedia di sistem (dikelola lewat backend/seed)"
	columns={permissionColumns}
	items={crud.items}
	meta={crud.meta}
	loading={crud.loading}
	{search}
	{sortConfig}
	onSearch={handleSearch}
	onSort={handleSort}
	onPageChange={handlePageChange}
	onPerPageChange={handlePerPageChange}
	{cell}
	{rowActions}
/>

<PermissionDetailDialog
	open={openDetail}
	item={crud.item}
	onOpenChange={(o) => (openDetail = o)}
/>
