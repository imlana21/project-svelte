import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { StockAnalysis, StoreAnalysisPayload, UpdateAnalysisPayload } from '$lib/types/Stock'
import { http } from '$lib/utils/http'

export function fetchAnalyses(params?: RequestParams): Promise<PaginatedResponse<StockAnalysis>> {
	return http.get<PaginatedResponse<StockAnalysis>>('/stock/analyses', params)
}

export function fetchAnalysis(id: number): Promise<ApiEnvelope<StockAnalysis>> {
	return http.get<ApiEnvelope<StockAnalysis>>('/stock/analyses/' + id)
}

export function createAnalysis(payload: StoreAnalysisPayload): Promise<ApiEnvelope<StockAnalysis>> {
	return http.post<ApiEnvelope<StockAnalysis>>('/stock/analyses', payload)
}

export function updateAnalysis(id: number, payload: UpdateAnalysisPayload): Promise<ApiEnvelope<StockAnalysis>> {
	return http.put<ApiEnvelope<StockAnalysis>>('/stock/analyses/' + id, payload)
}

export function deleteAnalysis(id: number): Promise<ApiEnvelope<null>> {
	return http.delete<ApiEnvelope<null>>('/stock/analyses/' + id)
}
