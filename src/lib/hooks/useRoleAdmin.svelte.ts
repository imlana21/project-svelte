import type { AuthPermission, AuthRole, StoreRolePayload, UpdateRolePayload } from '$lib/types/Auth'
import { fetchPermissions } from '$lib/services/permission.service'
import {
	createRole,
	deleteRole,
	fetchRole,
	fetchRoles,
	syncRolePermissions,
	toggleRoleStatus,
	updateRole,
} from '$lib/services/role.service'
import { useCrud } from './useCrud.svelte'

export function useRoleAdmin() {
	const crud = useCrud<AuthRole, StoreRolePayload, UpdateRolePayload>({
		fetchAll: fetchRoles,
		fetchById: fetchRole,
		create: createRole,
		update: updateRole,
		remove: deleteRole,
	})

	let permissions = $state<AuthPermission[]>([])
	let permissionsLoading = $state(false)

	async function loadPermissions(): Promise<void> {
		permissionsLoading = true
		try {
			const res = await fetchPermissions({ page: 1, perPage: 200 })
			permissions = res.data
		} finally {
			permissionsLoading = false
		}
	}

	async function toggleStatus(id: number): Promise<void> {
		await toggleRoleStatus(id)
	}

	async function syncPermissions(id: number, permissionIds: number[]): Promise<void> {
		await syncRolePermissions(id, { permission_ids: permissionIds })
	}

	return { ...crud, permissions, permissionsLoading, loadPermissions, toggleStatus, syncPermissions }
}
