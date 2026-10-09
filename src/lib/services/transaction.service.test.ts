import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ImportTransactionResult } from '$lib/types/StockImport'

vi.mock('$lib/utils/http', () => ({ http: { postMultipart: vi.fn(), get: vi.fn() } }))
import { http } from '$lib/utils/http'
import { fetchImportStatus, importTransactions } from './transaction.service'

beforeEach(() => vi.clearAllMocks())

describe('import saham', () => {
	it.each<ImportTransactionResult>([
		{ mode: 'sync', total: 2, success_count: 1, error_count: 1, success: [], errors: [{ row: 3, message: 'Lot tidak cukup' }] },
		{ mode: 'async', job_id: 42 },
	])('mengirim file multipart dan mempertahankan respons $mode', async (data) => {
		const file = new File(['sekuritas,emiten'], 'transactions.csv', { type: 'text/csv' })
		const envelope = { status: true, message: 'ok', data }
		vi.mocked(http.postMultipart).mockResolvedValue(envelope)
		expect(await importTransactions(file)).toEqual(envelope)
		const [path, form] = vi.mocked(http.postMultipart).mock.calls[0]
		expect(path).toBe('/stock/transactions/import')
		expect(form.get('file')).toBe(file)
	})
	it('mengambil status job dari endpoint backend', async () => {
		const result = { status: true, message: 'ok', data: { id: 42, status: 'failed', error_message: 'File tidak ditemukan' } }
		vi.mocked(http.get).mockResolvedValue(result)
		expect(await fetchImportStatus(42)).toEqual(result)
		expect(http.get).toHaveBeenCalledWith('/stock/transactions/import/42/status')
	})
})
