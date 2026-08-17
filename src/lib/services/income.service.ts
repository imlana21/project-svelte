import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { FinanceIncome, StoreIncomePayload, UpdateIncomePayload } from '$lib/types/finance/Income'
import { http } from '$lib/utils/http'

export function fetchIncomes(params?: RequestParams): Promise<PaginatedResponse<FinanceIncome>> {
	return http.get<PaginatedResponse<FinanceIncome>>('/finance/incomes', params)
}

export function fetchIncome(id: number): Promise<ApiEnvelope<FinanceIncome>> {
	return http.get<ApiEnvelope<FinanceIncome>>(`/finance/incomes/${id}`)
}

export function createIncome(payload: StoreIncomePayload): Promise<ApiEnvelope<FinanceIncome>> {
	return http.post<ApiEnvelope<FinanceIncome>>('/finance/incomes', payload)
}

export function updateIncome(id: number, payload: UpdateIncomePayload): Promise<ApiEnvelope<FinanceIncome>> {
	return http.put<ApiEnvelope<FinanceIncome>>(`/finance/incomes/${id}`, payload)
}

export function deleteIncome(id: number): Promise<ApiEnvelope<null>> {
	return http.delete<ApiEnvelope<null>>(`/finance/incomes/${id}`)
}

export function distributeIncome(id: number): Promise<ApiEnvelope<unknown>> {
	return http.post<ApiEnvelope<unknown>>(`/finance/incomes/${id}/distribute`)
}

export function rollbackDistributeIncome(id: number): Promise<ApiEnvelope<unknown>> {
	return http.post<ApiEnvelope<unknown>>(`/finance/incomes/${id}/rollback-distribute`)
}
