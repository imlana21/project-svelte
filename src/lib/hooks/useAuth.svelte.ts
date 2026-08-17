import { authStore } from '$lib/state/auth.store.svelte'

export function useAuth() {
	return authStore
}
