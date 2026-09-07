import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@skeletonlabs/skeleton-svelte', () => ({
	createToaster: vi.fn(() => ({
		create: vi.fn()
	}))
}))

describe('getErrorMessage', () => {
	let getErrorMessage: typeof import('./toaster.svelte').getErrorMessage
	let ApiError: typeof import('./http').ApiError

	beforeEach(async () => {
		vi.stubEnv('DEV', false)
		vi.resetModules()
		const httpMod = await import('./http')
		ApiError = httpMod.ApiError
		const mod = await import('./toaster.svelte')
		getErrorMessage = mod.getErrorMessage
	})

	afterEach(() => {
		vi.unstubAllEnvs()
	})

	describe('with ApiError', () => {
		it('returns HTTP message for known status', () => {
			const err = new ApiError(404, 'Not found')
			expect(getErrorMessage(err)).toBe('Data tidak ditemukan.')
		})

		it('returns fallback for unknown status', () => {
			const err = new ApiError(418, "I'm a teapot")
			expect(getErrorMessage(err)).toBe('Terjadi kesalahan (418)')
		})

		it('returns message for status 0 (network error)', () => {
			const err = new ApiError(0, 'Network error')
			expect(getErrorMessage(err)).toBe('Tidak dapat terhubung ke server.')
		})

		it('returns message for status 500', () => {
			const err = new ApiError(500, 'Internal error')
			expect(getErrorMessage(err)).toBe('Terjadi kesalahan pada server.')
		})
	})

	describe('with generic Error', () => {
		it('returns fallback message', () => {
			const err = new Error('something broke')
			expect(getErrorMessage(err)).toBe('Terjadi kesalahan yang tidak diketahui.')
		})
	})

	describe('with unknown value', () => {
		it('returns fallback for string', () => {
			expect(getErrorMessage('oops')).toBe('Terjadi kesalahan yang tidak diketahui.')
		})

		it('returns fallback for null', () => {
			expect(getErrorMessage(null)).toBe('Terjadi kesalahan yang tidak diketahui.')
		})

		it('returns fallback for undefined', () => {
			expect(getErrorMessage(undefined)).toBe('Terjadi kesalahan yang tidak diketahui.')
		})
	})
})
