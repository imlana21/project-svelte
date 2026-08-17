import type { AuthRole, UpdateUserPayload, User } from '$lib/types/Auth'
import { assignUserRoles, deleteUser, fetchUser, fetchUsers, toggleUserStatus, updateUser } from '$lib/services/user.service'
import { fetchRoles } from '$lib/services/role.service'
import { useCrud } from './useCrud.svelte'

export function useUserAdmin() {
	const crud = useCrud<User, never, UpdateUserPayload>({
		fetchAll: fetchUsers,
		fetchById: fetchUser,
		update: updateUser,
		remove: deleteUser,
	})

	let roles = $state<AuthRole[]>([])
	let rolesLoading = $state(false)

	async function loadRoles(): Promise<void> {
		rolesLoading = true
		try {
			const res = await fetchRoles({ page: 1, perPage: 100 })
			roles = res.data
		} finally {
			rolesLoading = false
		}
	}

	async function toggleStatus(id: number): Promise<void> {
		await toggleUserStatus(id)
	}

	async function assignRoles(id: number, roleIds: number[]): Promise<void> {
		await assignUserRoles(id, { role_ids: roleIds })
	}

	return { ...crud, roles, rolesLoading, loadRoles, toggleStatus, assignRoles }
}
