import { describe, it, expect } from 'vitest'
import { hasAnyPermission } from './permissions'
import type { User } from '$lib/types/Auth'

function makeUser(permissions: string[]): User {
	return {
		id: 1,
		name: 'Test',
		email: 'test@test.com',
		is_active: true,
		last_login_at: null,
		created_at: '2025-01-01',
		role_ids: [1],
		roles: ['admin'],
		permissions
	}
}

describe('hasAnyPermission', () => {
	it('returns true when slugs array is empty', () => {
		expect(hasAnyPermission(makeUser([]), [])).toBe(true)
	})

	it('returns true when user has at least one matching permission', () => {
		const user = makeUser(['stocks.read', 'finance.read'])
		expect(hasAnyPermission(user, ['stocks.read'])).toBe(true)
	})

	it('returns true when user has one of multiple requested', () => {
		const user = makeUser(['stocks.read'])
		expect(hasAnyPermission(user, ['stocks.read', 'admin.write'])).toBe(true)
	})

	it('returns false when user has no matching permission', () => {
		const user = makeUser(['finance.read'])
		expect(hasAnyPermission(user, ['stocks.write'])).toBe(false)
	})

	it('returns false for null user', () => {
		expect(hasAnyPermission(null, ['stocks.read'])).toBe(false)
	})

	it('returns false for undefined user', () => {
		expect(hasAnyPermission(undefined, ['stocks.read'])).toBe(false)
	})

	it('returns true for empty permissions user with empty slugs', () => {
		expect(hasAnyPermission(makeUser([]), [])).toBe(true)
	})

	it('returns false for empty permissions user with non-empty slugs', () => {
		expect(hasAnyPermission(makeUser([]), ['stocks.read'])).toBe(false)
	})
})
