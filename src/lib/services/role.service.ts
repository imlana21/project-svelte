import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { AssignPermissionsPayload, AuthRole, StoreRolePayload, UpdateRolePayload } from '$lib/types/Auth'
import { http } from '$lib/utils/http'

export function fetchRoles(params?: RequestParams): Promise<PaginatedResponse<AuthRole>> {
	return http.get<PaginatedResponse<AuthRole>>('/auth/roles', params)
}

export function fetchRole(id: number): Promise<ApiEnvelope<AuthRole>> {
	return http.get<ApiEnvelope<AuthRole>>(`/auth/roles/${id}`)
}

export function createRole(payload: StoreRolePayload): Promise<ApiEnvelope<AuthRole>> {
	return http.post<ApiEnvelope<AuthRole>>('/auth/roles', payload)
}

export function updateRole(id: number, payload: UpdateRolePayload): Promise<ApiEnvelope<AuthRole>> {
	return http.put<ApiEnvelope<AuthRole>>(`/auth/roles/${id}`, payload)
}

export function toggleRoleStatus(id: number): Promise<ApiEnvelope<AuthRole>> {
	return http.patch<ApiEnvelope<AuthRole>>(`/auth/roles/${id}/toggle-status`)
}

export function syncRolePermissions(id: number, payload: AssignPermissionsPayload): Promise<ApiEnvelope<AuthRole>> {
	return http.post<ApiEnvelope<AuthRole>>(`/auth/roles/${id}/permissions`, payload)
}

export function deleteRole(id: number): Promise<ApiEnvelope<null>> {
	return http.delete<ApiEnvelope<null>>(`/auth/roles/${id}`)
}
