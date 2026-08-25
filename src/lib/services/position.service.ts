import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { StockPosition } from '$lib/types/Stock'
import { http } from '$lib/utils/http'

export function fetchPositions(params?: RequestParams): Promise<PaginatedResponse<StockPosition>> {
	return http.get<PaginatedResponse<StockPosition>>('/stock/positions', params)
}

export function fetchPosition(id: number): Promise<ApiEnvelope<StockPosition>> {
	return http.get<ApiEnvelope<StockPosition>>(`/stock/positions/${id}`)
}
