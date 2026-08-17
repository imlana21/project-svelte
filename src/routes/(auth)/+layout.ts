import { redirectIfAuthenticated } from '$lib/hooks/useGuard.svelte'

export const load = () => {
	redirectIfAuthenticated()
}
