import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { StockAnalysis, StoreAnalysisPayload, UpdateAnalysisPayload } from '$lib/types/Stock'
import { http } from '$lib/utils/http'

export function fetchAnalyses(params?: RequestParams): Promise<PaginatedResponse<StockAnalysis>> {
	return http.get<PaginatedResponse<StockAnalysis>>('/stock/analyses', params)
}

export function fetchAnalysis(id: number): Promise<ApiEnvelope<StockAnalysis>> {
	return http.get<ApiEnvelope<StockAnalysis>>('/stock/analyses/' + id)
}

export function createAnalysis(payload: StoreAnalysisPayload, imageFile?: File): Promise<ApiEnvelope<StockAnalysis>> {
	if (imageFile) {
		const formData = new FormData()
		formData.append('ticker', payload.ticker)
		formData.append('range_buy', payload.range_buy)
		formData.append('tp1', String(payload.tp1))
		formData.append('tp2', String(payload.tp2))
		formData.append('sl', String(payload.sl))
		formData.append('description', payload.description)
		formData.append('source', payload.source)
		if (payload.is_valid !== undefined) formData.append('is_valid', String(payload.is_valid))
		formData.append('image', imageFile)
		return http.postMultipart<ApiEnvelope<StockAnalysis>>('/stock/analyses', formData)
	}
	return http.post<ApiEnvelope<StockAnalysis>>('/stock/analyses', payload)
}

export function updateAnalysis(id: number, payload: UpdateAnalysisPayload, imageFile?: File): Promise<ApiEnvelope<StockAnalysis>> {
	if (imageFile) {
		const formData = new FormData()
		if (payload.ticker !== undefined) formData.append('ticker', payload.ticker)
		if (payload.range_buy !== undefined) formData.append('range_buy', payload.range_buy)
		if (payload.tp1 !== undefined) formData.append('tp1', String(payload.tp1))
		if (payload.tp2 !== undefined) formData.append('tp2', String(payload.tp2))
		if (payload.sl !== undefined) formData.append('sl', String(payload.sl))
		if (payload.description !== undefined) formData.append('description', payload.description)
		if (payload.source !== undefined) formData.append('source', payload.source)
		if (payload.is_valid !== undefined) formData.append('is_valid', String(payload.is_valid))
		formData.append('image', imageFile)
		formData.append('_method', 'PUT')
		return http.postMultipart<ApiEnvelope<StockAnalysis>>('/stock/analyses/' + id, formData)
	}
	return http.put<ApiEnvelope<StockAnalysis>>('/stock/analyses/' + id, payload)
}

export function deleteAnalysis(id: number): Promise<ApiEnvelope<null>> {
	return http.delete<ApiEnvelope<null>>('/stock/analyses/' + id)
}
