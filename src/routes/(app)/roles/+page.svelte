<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, Power } from '@lucide/svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import { useRoleAdmin } from '$lib/hooks/useRoleAdmin.svelte';
	import { usePermission } from '$lib/hooks/usePermission.svelte';
	import { PERMISSIONS } from '$lib/utils/permission-registry';
	import { toastError, toastSuccess } from '$lib/utils/toaster.svelte';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { AuthRole } from '$lib/types/Auth';
	import { roleColumns } from './-partials/columns';
	import RoleFormDialog, { type RoleForm } from './-partials/form.dialog.svelte';
	import RoleDetailDialog from './-partials/detail.dialog.svelte';

	const roles = useRoleAdmin();
	const { can } = usePermission();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('name');
	let sortOrder = $state<SortOrder>('asc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openForm = $state(false);
	let openDetail = $state(false);
	let editItem = $state<AuthRole | undefined>(undefined);
	let detailItem = $state<AuthRole | undefined>(undefined);
	let deleteId = $state<number | null>(null);

	async function load() {
		try {
			await roles.fetchAll({ page, perPage, search, orderBy: sortKey, orderDirection: sortOrder });
		} catch (e) {
			toastError(e);
		}
	}

	onMount(() => {
		load();
		if (can(PERMISSIONS.permissions.read)) roles.loadPermissions();
	});

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
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortOrder = 'asc';
		}
		load();
	}

	function openCreate() {
		editItem = undefined;
		openForm = true;
	}

	function openEditFor(row: AuthRole) {
		editItem = row;
		openForm = true;
	}

	function openDetailFor(row: AuthRole) {
		detailItem = row;
		openDetail = true;
	}

	async function handleSubmit(values: RoleForm) {
		try {
			if (editItem) {
				await roles.update(editItem.id, values);
			} else {
				await roles.create(values);
			}
			openForm = false;
			toastSuccess('Data role berhasil disimpan');
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleToggleStatus(row: AuthRole) {
		try {
			await roles.toggleStatus(row.id);
			toastSuccess(row.is_active ? 'Role dinonaktifkan' : 'Role diaktifkan');
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleSyncPermissions(permissionIds: number[]) {
		if (!detailItem) return;
		try {
			await roles.syncPermissions(detailItem.id, permissionIds);
			toastSuccess('Permission role berhasil diperbarui');
			openDetail = false;
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleDelete() {
		if (deleteId === null) return;
		try {
			await roles.remove(deleteId);
			deleteId = null;
			toastSuccess('Role berhasil dihapus');
			load();
		} catch (e) {
			toastError(e);
		}
	}
</script>

{#snippet cell(item: AuthRole, column: ColumnDef)}
	{#if column.key === 'name'}
		{item.name}
	{:else if column.key === 'slug'}
		<span class="badge font-mono">{item.slug}</span>
	{:else if column.key === 'description'}
		{item.description || '-'}
	{:else if column.key === 'permissions'}
		{item.permissions?.length ?? 0} permission
	{:else if column.key === 'is_active'}
		<StatusBadge value={item.is_active} />
	{/if}
{/snippet}

<CrudPage
	title="Roles & Permissions"
	description="Kelola role beserta akses permission-nya"
	columns={roleColumns}
	items={roles.items}
	meta={roles.meta}
	loading={roles.loading}
	{search}
	{sortConfig}
	onSearch={handleSearch}
	onSort={handleSort}
	onPageChange={handlePageChange}
	onPerPageChange={handlePerPageChange}
	{cell}
	canEdit={can(PERMISSIONS.roles.update)}
	canDelete={can(PERMISSIONS.roles.delete)}
	onDetail={openDetailFor}
	onEdit={openEditFor}
	onDelete={(item) => { deleteId = item.id; }}
>
	{#snippet actions()}
		{#if can(PERMISSIONS.roles.create)}
			<button type="button" class="btn bg-primary-500 text-primary-contrast-500" onclick={openCreate}>
				<Plus size={16} />
				Tambah
			</button>
		{/if}
	{/snippet}
</CrudPage>

<RoleFormDialog
	open={openForm}
	item={editItem}
	saving={roles.loading}
	onOpenChange={(o) => (openForm = o)}
	onSubmit={handleSubmit}
/>

<RoleDetailDialog
	open={openDetail}
	item={detailItem}
	permissions={roles.permissions}
	canManagePermissions={can(PERMISSIONS.roles.update)}
	saving={roles.loading}
	onOpenChange={(o) => (openDetail = o)}
	onSubmit={handleSyncPermissions}
/>

<ConfirmDialog
	open={deleteId !== null}
	title="Hapus Role"
	message="Yakin ingin menghapus role ini? Pengguna dengan role ini akan kehilangan aksesnya."
	confirmLabel="Hapus"
	loading={roles.loading}
	onConfirm={handleDelete}
	onClose={() => (deleteId = null)}
/>
