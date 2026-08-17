import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { StockFundMutation, StoreFundMutationPayload } from '$lib/types/Stock'
import { http } from '$lib/utils/http'

export function fetchFundMutations(params?: RequestParams): Promise<PaginatedResponse<StockFundMutation>> {
	return http.get<PaginatedResponse<StockFundMutation>>('/stock/fund-mutations', params)
}

export function fetchFundMutation(id: number): Promise<ApiEnvelope<StockFundMutation>> {
	return http.get<ApiEnvelope<StockFundMutation>>(`/stock/fund-mutations/${id}`)
}

export function createFundMutation(payload: StoreFundMutationPayload): Promise<ApiEnvelope<StockFundMutation>> {
	return http.post<ApiEnvelope<StockFundMutation>>('/stock/fund-mutations', payload)
}

export function deleteFundMutation(id: number): Promise<ApiEnvelope<null>> {
	return http.delete<ApiEnvelope<null>>(`/stock/fund-mutations/${id}`)
}
