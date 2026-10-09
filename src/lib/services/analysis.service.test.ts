import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { StoreAnalysisPayload } from '$lib/types/Stock'

vi.mock('$lib/utils/http', () => ({ http: { post: vi.fn(), put: vi.fn() } }))
import { http } from '$lib/utils/http'
import { createAnalysis, updateAnalysis } from './analysis.service'

beforeEach(() => vi.clearAllMocks())

describe('kontrak analisis', () => {
	it.each([true, false])('mengirim URL gambar dan boolean JSON %s', async (is_valid) => {
		const payload: StoreAnalysisPayload = {
			ticker: 'BBCA', range_buy: '9000-9500', tp1: 10000, tp2: 11000, sl: 8500,
			image: 'https://example.com/chart.png', description: '', source: '', is_valid,
		}
		await createAnalysis(payload)
		expect(http.post).toHaveBeenCalledWith('/stock/analyses', payload)
	})
	it('menghapus gambar melalui null tanpa mengubah field lain', async () => {
		await updateAnalysis(5, { image: null, is_valid: false })
		expect(http.put).toHaveBeenCalledWith('/stock/analyses/5', { image: null, is_valid: false })
	})
})
