import type { AuthPermission } from '$lib/types/Auth'
import { fetchPermissions } from '$lib/services/permission.service'
import { useCrud } from './useCrud.svelte'

export function usePermissionAdmin() {
	const crud = useCrud<AuthPermission>({
		fetchAll: fetchPermissions,
		fetchById: fetchPermission,
	})

	return {
		get items() { return crud.items },
		get item() { return crud.item },
		get meta() { return crud.meta },
		get loading() { return crud.loading },
		fetchAll: crud.fetchAll,
		fetchById: crud.fetchById,
		setItem: crud.setItem,
	}
}

function fetchPermission(id: number) {
	return import('$lib/services/permission.service').then(m => m.fetchPermission(id))
}
