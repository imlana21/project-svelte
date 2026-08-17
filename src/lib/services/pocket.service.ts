import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { FinancePocket, StorePocketPayload, UpdatePocketPayload } from '$lib/types/finance/Pocket'
import { http } from '$lib/utils/http'

export function fetchPockets(params?: RequestParams): Promise<PaginatedResponse<FinancePocket>> {
	return http.get<PaginatedResponse<FinancePocket>>('/finance/pockets', params)
}

export function fetchPocket(id: number): Promise<ApiEnvelope<FinancePocket>> {
	return http.get<ApiEnvelope<FinancePocket>>(`/finance/pockets/${id}`)
}

export function createPocket(payload: StorePocketPayload): Promise<ApiEnvelope<FinancePocket>> {
	return http.post<ApiEnvelope<FinancePocket>>('/finance/pockets', payload)
}

export function updatePocket(id: number, payload: UpdatePocketPayload): Promise<ApiEnvelope<FinancePocket>> {
	return http.put<ApiEnvelope<FinancePocket>>(`/finance/pockets/${id}`, payload)
}

export function deletePocket(id: number): Promise<ApiEnvelope<null>> {
	return http.delete<ApiEnvelope<null>>(`/finance/pockets/${id}`)
}
