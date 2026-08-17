import { requirePermission } from '$lib/hooks/useGuard.svelte'
import { PERMISSIONS } from '$lib/utils/permission-registry'

export const load = () => {
	requirePermission(PERMISSIONS.stocksFundMutations.read)
}
