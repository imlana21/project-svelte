import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiEnvelope } from '$lib/types/Api'

const BASE_URL: string = import.meta.env.VITE_BASE_API_URL ?? 'http://127.0.0.1:8000/api'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

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

const instance = axios.create({
	baseURL: BASE_URL,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'X-Requested-With': 'XMLHttpRequest',
	},
	withCredentials: true,
})

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
	const token = getStoredToken()
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

instance.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error: AxiosError<ApiEnvelope<unknown>>) => {
		if (error.response?.status === 401) {
			clearStoredSession()
			if (browserSafe() && !window.location.pathname.startsWith('/login')) {
				window.location.href = '/login'
			}
			throw new ApiError(401, 'Sesi berakhir, silakan login kembali.')
		}

		const status = error.response?.status ?? 0
		const data = error.response?.data
		const message = data?.message || `Request gagal (${status})`
		const errors = (data as { errors?: Record<string, string[]> })?.errors

		if (status === 0) {
			throw new ApiError(0, 'Tidak dapat terhubung ke server.')
		}

		throw new ApiError(status, message, errors)
	}
)

export const http = {
	get<T>(path: string, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
		return instance.get<T>(path, { params: query }).then((res) => res.data as T)
	},
	post<T>(path: string, body?: unknown): Promise<T> {
		return instance.post<T>(path, body).then((res) => res.data as T)
	},
	put<T>(path: string, body?: unknown): Promise<T> {
		return instance.put<T>(path, body).then((res) => res.data as T)
	},
	patch<T>(path: string, body?: unknown): Promise<T> {
		return instance.patch<T>(path, body).then((res) => res.data as T)
	},
	delete<T>(path: string): Promise<T> {
		return instance.delete<T>(path).then((res) => res.data as T)
	},
}
