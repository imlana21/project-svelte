import type { ApiEnvelope } from '$lib/types/Api'
import type { AuthSessionData, LoginPayload, RegisterPayload, User } from '$lib/types/Auth'
import { http } from '$lib/utils/http'

export async function login(payload: LoginPayload): Promise<AuthSessionData> {
	const res = await http.post<ApiEnvelope<AuthSessionData>>('/auth/login', payload)
	return res.data
}

export async function register(payload: RegisterPayload): Promise<void> {
	await http.post<ApiEnvelope<AuthSessionData>>('/auth/register', payload)
}

export async function logout(): Promise<void> {
	await http.post<ApiEnvelope<null>>('/auth/logout')
}

export async function fetchMe(): Promise<User> {
	const res = await http.get<ApiEnvelope<User>>('/auth/me')
	return res.data
}
