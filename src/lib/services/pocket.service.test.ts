import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('$lib/utils/http', () => ({
	http: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn()
	}
}))

import { http } from '$lib/utils/http'
import {
	fetchPockets,
	fetchPocket,
	createPocket,
	updatePocket,
	deletePocket
} from './pocket.service'

const mockGet = vi.mocked(http.get)
const mockPost = vi.mocked(http.post)
const mockPut = vi.mocked(http.put)
const mockDelete = vi.mocked(http.delete)

beforeEach(() => {
	vi.clearAllMocks()
})

describe('pocket.service', () => {
	describe('fetchPockets', () => {
		it('calls http.get with correct path', async () => {
			mockGet.mockResolvedValue({ data: [], meta: {} })
			await fetchPockets({ page: 1, perPage: 10 })
			expect(mockGet).toHaveBeenCalledWith('/finance/pockets', { page: 1, perPage: 10 })
		})

		it('calls http.get without params', async () => {
			mockGet.mockResolvedValue({ data: [], meta: {} })
			await fetchPockets()
			expect(mockGet).toHaveBeenCalledWith('/finance/pockets', undefined)
		})
	})

	describe('fetchPocket', () => {
		it('calls http.get with id in path', async () => {
			mockGet.mockResolvedValue({ data: { id: 5 } })
			await fetchPocket(5)
			expect(mockGet).toHaveBeenCalledWith('/finance/pockets/5')
		})
	})

	describe('createPocket', () => {
		it('calls http.post with path and payload', async () => {
			const payload = { name: 'Tabungan', allocation_config_id: 1 }
			mockPost.mockResolvedValue({ data: {} })
			await createPocket(payload as any)
			expect(mockPost).toHaveBeenCalledWith('/finance/pockets', payload)
		})
	})

	describe('updatePocket', () => {
		it('calls http.put with id path and payload', async () => {
			const payload = { name: 'Updated' }
			mockPut.mockResolvedValue({ data: {} })
			await updatePocket(3, payload as any)
			expect(mockPut).toHaveBeenCalledWith('/finance/pockets/3', payload)
		})
	})

	describe('deletePocket', () => {
		it('calls http.delete with id path', async () => {
			mockDelete.mockResolvedValue({ data: null })
			await deletePocket(7)
			expect(mockDelete).toHaveBeenCalledWith('/finance/pockets/7')
		})
	})
})
