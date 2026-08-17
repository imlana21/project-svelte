import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { AssignRolesPayload, UpdateUserPayload, User } from '$lib/types/Auth'
import { http } from '$lib/utils/http'

export function fetchUsers(params?: RequestParams): Promise<PaginatedResponse<User>> {
	return http.get<PaginatedResponse<User>>('/auth/users', params)
}

export function fetchUser(id: number): Promise<ApiEnvelope<User>> {
	return http.get<ApiEnvelope<User>>(`/auth/users/${id}`)
}

export function updateUser(id: number, payload: UpdateUserPayload): Promise<ApiEnvelope<User>> {
	return http.put<ApiEnvelope<User>>(`/auth/users/${id}`, payload)
}

export function toggleUserStatus(id: number): Promise<ApiEnvelope<User>> {
	return http.patch<ApiEnvelope<User>>(`/auth/users/${id}/toggle-status`)
}

export function assignUserRoles(id: number, payload: AssignRolesPayload): Promise<ApiEnvelope<User>> {
	return http.post<ApiEnvelope<User>>(`/auth/users/${id}/roles`, payload)
}

export function deleteUser(id: number): Promise<ApiEnvelope<null>> {
	return http.delete<ApiEnvelope<null>>(`/auth/users/${id}`)
}
