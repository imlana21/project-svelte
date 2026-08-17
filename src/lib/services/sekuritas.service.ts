import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { StockSekuritas, StoreSekuritasPayload, UpdateSekuritasPayload } from '$lib/types/Stock'
import { http } from '$lib/utils/http'

export function fetchSekuritas(params?: RequestParams): Promise<PaginatedResponse<StockSekuritas>> {
	return http.get<PaginatedResponse<StockSekuritas>>('/stock/sekuritas', params)
}

export function fetchSekuritasById(id: number): Promise<ApiEnvelope<StockSekuritas>> {
	return http.get<ApiEnvelope<StockSekuritas>>(`/stock/sekuritas/${id}`)
}

export function createSekuritas(payload: StoreSekuritasPayload): Promise<ApiEnvelope<StockSekuritas>> {
	return http.post<ApiEnvelope<StockSekuritas>>('/stock/sekuritas', payload)
}

export function updateSekuritas(id: number, payload: UpdateSekuritasPayload): Promise<ApiEnvelope<StockSekuritas>> {
	return http.put<ApiEnvelope<StockSekuritas>>(`/stock/sekuritas/${id}`, payload)
}

export function deleteSekuritas(id: number): Promise<ApiEnvelope<null>> {
	return http.delete<ApiEnvelope<null>>(`/stock/sekuritas/${id}`)
}
