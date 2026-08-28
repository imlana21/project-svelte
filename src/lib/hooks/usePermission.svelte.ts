import { authStore } from '$lib/state/auth.store.svelte'
import { hasAnyPermission } from '$lib/utils/permissions'

export function usePermission() {
	function can(slug: string): boolean {
		return hasAnyPermission(authStore.user, [slug])
	}

	return { can }
}
