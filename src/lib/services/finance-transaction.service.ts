import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { FinanceTransaction, StoreFinanceTransactionPayload, UpdateFinanceTransactionPayload } from '$lib/types/finance/Transaction'
import { http } from '$lib/utils/http'

export function fetchFinanceTransactions(params?: RequestParams): Promise<PaginatedResponse<FinanceTransaction>> {
	return http.get<PaginatedResponse<FinanceTransaction>>('/finance/transactions', params)
}

export function fetchFinanceTransaction(id: number): Promise<ApiEnvelope<FinanceTransaction>> {
	return http.get<ApiEnvelope<FinanceTransaction>>(`/finance/transactions/${id}`)
}

export function createFinanceTransaction(payload: StoreFinanceTransactionPayload): Promise<ApiEnvelope<FinanceTransaction>> {
	return http.post<ApiEnvelope<FinanceTransaction>>('/finance/transactions', payload)
}

export function updateFinanceTransaction(id: number, payload: UpdateFinanceTransactionPayload): Promise<ApiEnvelope<FinanceTransaction>> {
	return http.put<ApiEnvelope<FinanceTransaction>>(`/finance/transactions/${id}`, payload)
}

export function deleteFinanceTransaction(id: number): Promise<ApiEnvelope<null>> {
	return http.delete<ApiEnvelope<null>>(`/finance/transactions/${id}`)
}
