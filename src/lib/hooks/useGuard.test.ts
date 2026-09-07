import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('$lib/state/auth.store.svelte', () => ({
	authStore: {
		token: null as string | null,
		user: null as any
	}
}))

vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn((status: number, location: string) => {
		throw new Error(`Redirect ${status} -> ${location}`)
	})
}))

import { authStore } from '$lib/state/auth.store.svelte'
import { redirect } from '@sveltejs/kit'

beforeEach(() => {
	authStore.token = null
	authStore.user = null
	vi.clearAllMocks()
})

describe('requireAuth', () => {
	it('redirects to /login when no token', async () => {
		const { requireAuth } = await import('./useGuard.svelte')
		expect(() => requireAuth()).toThrow('Redirect 307 -> /login')
	})

	it('redirects to /login when no user', async () => {
		authStore.token = 'some-token'
		authStore.user = null
		const { requireAuth } = await import('./useGuard.svelte')
		expect(() => requireAuth()).toThrow('Redirect 307 -> /login')
	})

	it('does not redirect when authenticated', async () => {
		authStore.token = 'some-token'
		authStore.user = { id: 1, name: 'Test', permissions: [] }
		const { requireAuth } = await import('./useGuard.svelte')
		expect(() => requireAuth()).not.toThrow()
	})
})

describe('requirePermission', () => {
	it('redirects to /login when not authenticated (calls requireAuth first)', async () => {
		const { requirePermission } = await import('./useGuard.svelte')
		expect(() => requirePermission('stocks.read')).toThrow('Redirect 307 -> /login')
	})

	it('redirects to /403 when user lacks permission', async () => {
		authStore.token = 'token'
		authStore.user = { id: 1, name: 'Test', permissions: [] }
		const { requirePermission } = await import('./useGuard.svelte')
		expect(() => requirePermission('stocks.read')).toThrow('Redirect 307 -> /403')
	})

	it('does not redirect when user has permission', async () => {
		authStore.token = 'token'
		authStore.user = { id: 1, name: 'Test', permissions: ['stocks.read'] }
		const { requirePermission } = await import('./useGuard.svelte')
		expect(() => requirePermission('stocks.read')).not.toThrow()
	})

	it('does not redirect when slugs array is empty (always allowed)', async () => {
		authStore.token = 'token'
		authStore.user = { id: 1, name: 'Test', permissions: [] }
		const { requirePermission } = await import('./useGuard.svelte')
		expect(() => requirePermission([])).not.toThrow()
	})

	it('accepts array of slugs', async () => {
		authStore.token = 'token'
		authStore.user = { id: 1, name: 'Test', permissions: ['finance.read'] }
		const { requirePermission } = await import('./useGuard.svelte')
		expect(() => requirePermission(['stocks.read', 'finance.read'])).not.toThrow()
	})
})

describe('redirectIfAuthenticated', () => {
	it('redirects to /dashboard when logged in', async () => {
		authStore.token = 'token'
		authStore.user = { id: 1, name: 'Test' }
		const { redirectIfAuthenticated } = await import('./useGuard.svelte')
		expect(() => redirectIfAuthenticated()).toThrow('Redirect 307 -> /dashboard')
	})

	it('does not redirect when not logged in', async () => {
		const { redirectIfAuthenticated } = await import('./useGuard.svelte')
		expect(() => redirectIfAuthenticated()).not.toThrow()
	})
})
