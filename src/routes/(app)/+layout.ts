import { requireAuth } from '$lib/hooks/useGuard.svelte'

export const load = () => {
	requireAuth()
}
