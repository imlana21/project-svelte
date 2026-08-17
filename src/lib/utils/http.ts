import type { ApiEnvelope } from '$lib/types/Api'

const BASE_URL: string = import.meta.env.VITE_BASE_API_URL ?? 'http://127.0.0.1:8000/api'

export const TOKEN_KEY = 'token'
export const USER_KEY = 'user'

export interface ApiErrorBody {
	message: string
	errors?: Record<string, string[]>
}

export class ApiError extends Error {
	status: number
	errors?: Record<string, string[]>

	constructor(status: number, message: string, errors?: Record<string, string[]>) {
		super(message)
		this.name = 'ApiError'
		this.status = status
		this.errors = errors
	}
}

export function getStoredToken(): string | null {
	if (!browserSafe()) return null
	return window.localStorage.getItem(TOKEN_KEY) ?? window.sessionStorage.getItem(TOKEN_KEY)
}

export function getStoredUser<T>(): T | null {
	if (!browserSafe()) return null
	const raw = window.localStorage.getItem(USER_KEY) ?? window.sessionStorage.getItem(USER_KEY)
	if (!raw) return null
	try {
		return JSON.parse(raw) as T
	} catch {
		return null
	}
}

export function setStoredSession(token: string, user: unknown, remember = true): void {
	if (!browserSafe()) return
	const storage = remember ? window.localStorage : window.sessionStorage
	const other = remember ? window.sessionStorage : window.localStorage
	storage.setItem(TOKEN_KEY, token)
	storage.setItem(USER_KEY, JSON.stringify(user))
	other.removeItem(TOKEN_KEY)
	other.removeItem(USER_KEY)
}

export function clearStoredSession(): void {
	if (!browserSafe()) return
	window.localStorage.removeItem(TOKEN_KEY)
	window.localStorage.removeItem(USER_KEY)
	window.sessionStorage.removeItem(TOKEN_KEY)
	window.sessionStorage.removeItem(USER_KEY)
}

function browserSafe(): boolean {
	return typeof window !== 'undefined'
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
	method?: HttpMethod
	body?: unknown
	query?: Record<string, string | number | boolean | undefined>
}

function buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>): string {
	const url = path.startsWith('http') ? path : `${BASE_URL}${path}`
	if (!query) return url
	const params = new URLSearchParams()
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined && value !== null && value !== '') {
			params.set(key, String(value))
		}
	}
	const qs = params.toString()
	return qs ? `${url}?${qs}` : url
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
	const { method = 'GET', body, query } = options

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'X-Requested-With': 'XMLHttpRequest',
	}

	const token = getStoredToken()
	if (token) headers.Authorization = `Bearer ${token}`

	const init: RequestInit = {
		method,
		headers,
		credentials: 'include',
	}

	if (body !== undefined) {
		init.body = JSON.stringify(body)
	}

	let response: Response
	try {
		response = await fetch(buildUrl(path, query), init)
	} catch {
		throw new ApiError(0, 'Tidak dapat terhubung ke server.')
	}

	if (response.status === 401) {
		clearStoredSession()
		if (browserSafe() && !window.location.pathname.startsWith('/login')) {
			window.location.href = '/login'
		}
		throw new ApiError(401, 'Sesi berakhir, silakan login kembali.')
	}

	const isJson = response.headers.get('content-type')?.includes('application/json')
	const data: ApiEnvelope<unknown> | unknown = isJson ? await response.json() : await response.text()

	if (!response.ok) {
		const envelope = data as ApiEnvelope<unknown>
		const errors = (envelope as { errors?: Record<string, string[]> }).errors
		throw new ApiError(response.status, envelope?.message || `Request gagal (${response.status})`, errors)
	}

	return data as T
}

export const http = {
	get<T>(path: string, query?: RequestOptions['query']): Promise<T> {
		return request<T>(path, { method: 'GET', query })
	},
	post<T>(path: string, body?: unknown): Promise<T> {
		return request<T>(path, { method: 'POST', body })
	},
	put<T>(path: string, body?: unknown): Promise<T> {
		return request<T>(path, { method: 'PUT', body })
	},
	patch<T>(path: string, body?: unknown): Promise<T> {
		return request<T>(path, { method: 'PATCH', body })
	},
	delete<T>(path: string): Promise<T> {
		return request<T>(path, { method: 'DELETE' })
	},
}
