import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { StockEmiten, StoreEmitenPayload, UpdateEmitenPayload } from '$lib/types/Stock'
import { http } from '$lib/utils/http'

export function fetchEmitens(params?: RequestParams): Promise<PaginatedResponse<StockEmiten>> {
	return http.get<PaginatedResponse<StockEmiten>>('/stock/emitens', params)
}

export function fetchEmiten(id: number): Promise<ApiEnvelope<StockEmiten>> {
	return http.get<ApiEnvelope<StockEmiten>>(`/stock/emitens/${id}`)
}

export function createEmiten(payload: StoreEmitenPayload): Promise<ApiEnvelope<StockEmiten>> {
	return http.post<ApiEnvelope<StockEmiten>>('/stock/emitens', payload)
}

export function updateEmiten(id: number, payload: UpdateEmitenPayload): Promise<ApiEnvelope<StockEmiten>> {
	return http.put<ApiEnvelope<StockEmiten>>(`/stock/emitens/${id}`, payload)
}

export function deleteEmiten(id: number): Promise<ApiEnvelope<null>> {
	return http.delete<ApiEnvelope<null>>(`/stock/emitens/${id}`)
}

export function importEod(file: File): Promise<ApiEnvelope<{ updated: number; skipped: number; errors: string[] }>> {
	const formData = new FormData()
	formData.append('file', file)
	return http.post<ApiEnvelope<{ updated: number; skipped: number; errors: string[] }>>('/stock/eod-import', formData)
}
