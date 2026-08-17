import { redirect } from '@sveltejs/kit'
import { authStore } from '$lib/state/auth.store.svelte'
import { hasAnyPermission } from '$lib/utils/permissions'

export function requireAuth(): void {
	if (!authStore.token || !authStore.user) {
		redirect(307, '/login')
	}
}

export function requirePermission(slugs: string | string[]): void {
	requireAuth()
	const required = Array.isArray(slugs) ? slugs : [slugs]
	if (!hasAnyPermission(authStore.user, required)) {
		redirect(307, '/403')
	}
}

export function redirectIfAuthenticated(): void {
	if (authStore.token && authStore.user) {
		redirect(307, '/dashboard')
	}
}
