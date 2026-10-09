import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { RealizedPnL, StockTransaction, StoreTransactionPayload } from '$lib/types/Stock'
import { http } from '$lib/utils/http'
import type { ImportTransactionResult, StockImportStatus } from '$lib/types/StockImport'

export function fetchTransactions(params?: RequestParams): Promise<PaginatedResponse<StockTransaction>> {
	return http.get<PaginatedResponse<StockTransaction>>('/stock/transactions', params)
}

export function fetchTransaction(id: number): Promise<ApiEnvelope<StockTransaction>> {
	return http.get<ApiEnvelope<StockTransaction>>(`/stock/transactions/${id}`)
}

export function createTransaction(payload: StoreTransactionPayload): Promise<ApiEnvelope<StockTransaction>> {
	return http.post<ApiEnvelope<StockTransaction>>('/stock/transactions', payload)
}

export function deleteTransaction(id: number): Promise<ApiEnvelope<null>> {
	return http.delete<ApiEnvelope<null>>(`/stock/transactions/${id}`)
}

export function fetchRealizedHistory(params?: RequestParams): Promise<PaginatedResponse<RealizedPnL>> {
	return http.get<PaginatedResponse<RealizedPnL>>('/stock/transactions/realized-history', params)
}

export function importTransactions(file: File): Promise<ApiEnvelope<ImportTransactionResult>> {
	const formData = new FormData()
	formData.append('file', file)
	return http.postMultipart<ApiEnvelope<ImportTransactionResult>>('/stock/transactions/import', formData)
}

export function fetchImportStatus(jobId: number): Promise<ApiEnvelope<StockImportStatus>> {
	return http.get<ApiEnvelope<StockImportStatus>>(`/stock/transactions/import/${jobId}/status`)
}
