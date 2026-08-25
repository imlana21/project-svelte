<script lang="ts">
	import { onMount } from 'svelte';
	import { Eye, Pencil, Power, Trash2 } from '@lucide/svelte';
	import CrudPage from '$lib/components/ui/CrudPage.svelte';
	import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import { useUserAdmin } from '$lib/hooks/useUserAdmin.svelte';
	import { usePermission } from '$lib/hooks/usePermission.svelte';
	import { PERMISSIONS } from '$lib/utils/permission-registry';
	import { toastError, toastSuccess } from '$lib/utils/toaster.svelte';
	import { formatDate } from '$lib/utils/format';
	import type { ColumnDef, SortOrder } from '$lib/types/Api';
	import type { User } from '$lib/types/Auth';
	import { userColumns } from './-partials/columns';
	import EditUserDialog, { type EditUserForm } from './-partials/edit.dialog.svelte';
	import DetailDialog from './-partials/detail.dialog.svelte';
	import AssignRolesDialog from './-partials/assign-roles.dialog.svelte';

	const users = useUserAdmin();
	const { can } = usePermission();

	let page = $state(1);
	let perPage = $state(10);
	let search = $state('');
	let sortKey = $state('name');
	let sortOrder = $state<SortOrder>('asc');
	let sortConfig = $derived({ key: sortKey, order: sortOrder });

	let openEdit = $state(false);
	let openDetail = $state(false);
	let openAssign = $state(false);
	let deleteId = $state<number | null>(null);

	async function load() {
		try {
			await users.fetchAll({ page, perPage, search, orderBy: sortKey, orderDirection: sortOrder });
		} catch (e) {
			toastError(e);
		}
	}

	onMount(() => {
		load();
		if (can(PERMISSIONS.roles.read)) users.loadRoles();
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

	function openEditFor(row: User) {
		users.setItem(row);
		openEdit = true;
	}

	function openDetailFor(row: User) {
		users.setItem(row);
		openDetail = true;
	}

	async function handleToggleStatus(row: User) {
		try {
			await users.toggleStatus(row.id);
			toastSuccess(row.is_active ? 'Pengguna dinonaktifkan' : 'Pengguna diaktifkan');
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleEditSubmit(values: EditUserForm) {
		const current = users.item;
		if (!current) return;
		try {
			await users.update(current.id, values);
			openEdit = false;
			toastSuccess('Profil pengguna berhasil disimpan');
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleAssignRoles(roleIds: number[]) {
		const current = users.item;
		if (!current) return;
		try {
			await users.assignRoles(current.id, roleIds);
			openAssign = false;
			toastSuccess('Role pengguna berhasil diperbarui');
			load();
		} catch (e) {
			toastError(e);
		}
	}

	async function handleDelete() {
		if (deleteId === null) return;
		try {
			await users.remove(deleteId);
			deleteId = null;
			toastSuccess('Pengguna berhasil dihapus');
			load();
		} catch (e) {
			toastError(e);
		}
	}
</script>

{#snippet cell(item: User, column: ColumnDef)}
	{#if column.key === 'name'}
		{item.name}
	{:else if column.key === 'email'}
		{item.email}
	{:else if column.key === 'roles'}
		{#if item.roles.length > 0}
			<div class="flex flex-wrap gap-1">
				{#each item.roles as role (role)}
					<span class="badge capitalize">{role}</span>
				{/each}
			</div>
		{:else}
			<span class="text-surface-500 dark:text-surface-400">Belum ada role</span>
		{/if}
	{:else if column.key === 'last_login_at'}
		{item.last_login_at ? formatDate(item.last_login_at) : '-'}
	{:else if column.key === 'is_active'}
		<StatusBadge value={item.is_active} />
	{/if}
{/snippet}

{#snippet rowActions(item: User)}
	<div class="inline-flex items-center gap-1">
		<button type="button" class="btn btn-icon" title="Detail" onclick={() => openDetailFor(item)}>
			<Eye size={16} />
		</button>
		{#if can(PERMISSIONS.users.update)}
			<button type="button" class="btn btn-icon" title="Ubah" onclick={() => openEditFor(item)}>
				<Pencil size={16} />
			</button>
			<button
				type="button"
				class="btn btn-icon"
				title={item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
				onclick={() => handleToggleStatus(item)}
			>
				<Power size={16} />
			</button>
		{/if}
		{#if can(PERMISSIONS.users.delete)}
			<button
				type="button"
				class="btn btn-icon text-error-600 dark:text-error-400"
				title="Hapus"
				onclick={() => (deleteId = item.id)}
			>
				<Trash2 size={16} />
			</button>
		{/if}
	</div>
{/snippet}

<CrudPage
	title="User Management"
	description="Kelola akun pengguna dan role yang dimiliki"
	columns={userColumns}
	items={users.items}
	meta={users.meta}
	loading={users.loading}
	{search}
	{sortConfig}
	onSearch={handleSearch}
	onSort={handleSort}
	onPageChange={handlePageChange}
	onPerPageChange={handlePerPageChange}
	cell={cell}
	rowActions={rowActions}
/>

<EditUserDialog
	open={openEdit}
	item={users.item}
	saving={users.loading}
	onOpenChange={(o) => (openEdit = o)}
	onSubmit={handleEditSubmit}
/>

<DetailDialog
	open={openDetail}
	item={users.item}
	canManageRoles={can(PERMISSIONS.users.update)}
	onOpenChange={(o) => (openDetail = o)}
	onManageRoles={() => {
		openDetail = false;
		openAssign = true;
	}}
/>

<AssignRolesDialog
	open={openAssign}
	item={users.item}
	roles={users.roles}
	saving={users.loading}
	onOpenChange={(o) => (openAssign = o)}
	onSubmit={handleAssignRoles}
/>

<ConfirmDialog
	open={deleteId !== null}
	title="Hapus Pengguna"
	message="Yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan."
	confirmLabel="Hapus"
	loading={users.loading}
	onConfirm={handleDelete}
	onClose={() => (deleteId = null)}
/>
