import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { FinanceAllocationConfig, StoreAllocationConfigPayload, UpdateAllocationConfigPayload } from '$lib/types/finance/AllocationConfig'
import { http } from '$lib/utils/http'

export function fetchAllocationConfigs(params?: RequestParams): Promise<PaginatedResponse<FinanceAllocationConfig>> {
	return http.get<PaginatedResponse<FinanceAllocationConfig>>('/finance/allocation-configs', params)
}

export function fetchAllocationConfig(id: number): Promise<ApiEnvelope<FinanceAllocationConfig>> {
	return http.get<ApiEnvelope<FinanceAllocationConfig>>(`/finance/allocation-configs/${id}`)
}

export function createAllocationConfig(payload: StoreAllocationConfigPayload): Promise<ApiEnvelope<FinanceAllocationConfig>> {
	return http.post<ApiEnvelope<FinanceAllocationConfig>>('/finance/allocation-configs', payload)
}

export function updateAllocationConfig(id: number, payload: UpdateAllocationConfigPayload): Promise<ApiEnvelope<FinanceAllocationConfig>> {
	return http.put<ApiEnvelope<FinanceAllocationConfig>>(`/finance/allocation-configs/${id}`, payload)
}

export function deleteAllocationConfig(id: number): Promise<ApiEnvelope<null>> {
	return http.delete<ApiEnvelope<null>>(`/finance/allocation-configs/${id}`)
}
