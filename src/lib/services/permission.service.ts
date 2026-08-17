import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { AuthPermission, StorePermissionPayload, UpdatePermissionPayload } from '$lib/types/Auth'
import { http } from '$lib/utils/http'

export function fetchPermissions(params?: RequestParams): Promise<PaginatedResponse<AuthPermission>> {
	return http.get<PaginatedResponse<AuthPermission>>('/auth/permissions', params)
}

export function fetchPermission(id: number): Promise<ApiEnvelope<AuthPermission>> {
	return http.get<ApiEnvelope<AuthPermission>>(`/auth/permissions/${id}`)
}

export function createPermission(payload: StorePermissionPayload): Promise<ApiEnvelope<AuthPermission>> {
	return http.post<ApiEnvelope<AuthPermission>>('/auth/permissions', payload)
}

export function updatePermission(
	id: number,
	payload: UpdatePermissionPayload,
): Promise<ApiEnvelope<AuthPermission>> {
	return http.put<ApiEnvelope<AuthPermission>>(`/auth/permissions/${id}`, payload)
}

export function deletePermission(id: number): Promise<ApiEnvelope<null>> {
	return http.delete<ApiEnvelope<null>>(`/auth/permissions/${id}`)
}
