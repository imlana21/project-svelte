import { describe, expect, it, vi } from 'vitest'
import type { PaginatedResponse, RequestParams } from '$lib/types/Api'
import { fetchAllPages } from './pagination.service'

function response(page: number, total: number): PaginatedResponse<{ id: number }> {
	return {
		status: true, message: 'ok',
		data: Array.from({ length: Math.min(100, Math.max(0, total - (page - 1) * 100)) }, (_, i) => ({ id: (page - 1) * 100 + i + 1 })),
		meta: { current_page: page, last_page: Math.max(1, Math.ceil(total / 100)), total, perPage: 100, from: null, to: null, links: [], path: '/' },
		links: { first: null, last: null, prev: null, next: null },
	}
}

describe('fetchAllPages', () => {
	it('mengambil seluruh data di atas 100 baris dengan urutan stabil', async () => {
		const fetchPage = vi.fn(async (params: RequestParams) => response(params.page, 235))
		const data = await fetchAllPages(fetchPage)
		expect(data).toHaveLength(235)
		expect(data[234].id).toBe(235)
		expect(fetchPage.mock.calls.map(([params]) => params)).toEqual([1, 2, 3].map(page => ({ page, perPage: 100, orderBy: 'id', orderDirection: 'asc' })))
	})
	it('berhenti pada halaman kosong pertama', async () => {
		const fetchPage = vi.fn(async () => response(1, 0))
		expect(await fetchAllPages(fetchPage)).toEqual([])
		expect(fetchPage).toHaveBeenCalledTimes(1)
	})
	it('tidak mengembalikan total parsial ketika halaman berikutnya gagal', async () => {
		const fetchPage = vi.fn(async ({ page }: RequestParams) => {
			if (page === 2) throw new Error('Jaringan gagal')
			return response(page, 235)
		})
		await expect(fetchAllPages(fetchPage)).rejects.toThrow('Jaringan gagal')
	})
})
