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

	return {
		get items() { return crud.items },
		get item() { return crud.item },
		get meta() { return crud.meta },
		get loading() { return crud.loading },
		get params() { return crud.params },
		get roles() { return roles },
		get rolesLoading() { return rolesLoading },
		fetchAll: crud.fetchAll,
		fetchById: crud.fetchById,
		create: crud.create,
		update: crud.update,
		remove: crud.remove,
		setItem: crud.setItem,
		setParams: crud.setParams,
		reset: crud.reset,
		loadRoles,
		toggleStatus,
		assignRoles,
	}
}
