import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { FinanceDebt, StoreDebtPayload, UpdateDebtPayload } from '$lib/types/finance/Debt'
import { http } from '$lib/utils/http'

export function fetchDebts(params?: RequestParams): Promise<PaginatedResponse<FinanceDebt>> {
	return http.get<PaginatedResponse<FinanceDebt>>('/finance/debts', params)
}

export function fetchDebt(id: number): Promise<ApiEnvelope<FinanceDebt>> {
	return http.get<ApiEnvelope<FinanceDebt>>(`/finance/debts/${id}`)
}

export function createDebt(payload: StoreDebtPayload): Promise<ApiEnvelope<FinanceDebt>> {
	return http.post<ApiEnvelope<FinanceDebt>>('/finance/debts', payload)
}

export function updateDebt(id: number, payload: UpdateDebtPayload): Promise<ApiEnvelope<FinanceDebt>> {
	return http.put<ApiEnvelope<FinanceDebt>>(`/finance/debts/${id}`, payload)
}

export function deleteDebt(id: number): Promise<ApiEnvelope<null>> {
	return http.delete<ApiEnvelope<null>>(`/finance/debts/${id}`)
}

export function markDebtAsPaid(id: number): Promise<ApiEnvelope<{ debt: FinanceDebt }>> {
	return http.post<ApiEnvelope<{ debt: FinanceDebt }>>(`/finance/debts/${id}/mark-paid`)
}

export function unmarkDebtAsPaid(id: number): Promise<ApiEnvelope<{ debt: FinanceDebt }>> {
	return http.post<ApiEnvelope<{ debt: FinanceDebt }>>(`/finance/debts/${id}/unmark-paid`)
}
