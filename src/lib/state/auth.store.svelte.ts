import * as authService from '$lib/services/auth.service'
import type { AuthSessionData, LoginPayload, RegisterPayload, User } from '$lib/types/Auth'
import { clearStoredSession, getStoredToken, getStoredUser, setStoredSession } from '$lib/utils/http'

class AuthStore {
	user = $state<User | null>(null)
	token = $state<string | null>(null)
	loading = $state(false)

	constructor() {
		this.user = getStoredUser<User>()
		this.token = getStoredToken()
	}

	setSession(session: AuthSessionData, remember = true): void {
		setStoredSession(session.token, session.user, remember)
		this.token = session.token
		this.user = session.user
	}

	clearSession(): void {
		clearStoredSession()
		this.token = null
		this.user = null
	}

	async login(payload: LoginPayload, remember = true): Promise<void> {
		this.loading = true
		try {
			const session = await authService.login(payload)
			this.setSession(session, remember)
		} finally {
			this.loading = false
		}
	}

	async register(payload: RegisterPayload): Promise<void> {
		this.loading = true
		try {
			await authService.register(payload)
		} finally {
			this.loading = false
		}
	}

	async logout(): Promise<void> {
		this.loading = true
		try {
			await authService.logout()
		} catch {
			// sesi client tetap dibersihkan walau request logout gagal
		} finally {
			this.clearSession()
			this.loading = false
		}
	}

	async fetchMe(): Promise<void> {
		if (!this.token) return
		this.loading = true
		try {
			const user = await authService.fetchMe()
			this.user = user
			setStoredSession(this.token, user, !!window?.localStorage?.getItem('token'))
		} catch {
			this.clearSession()
		} finally {
			this.loading = false
		}
	}

	async updateProfile(payload: { name: string; email: string }): Promise<void> {
		this.loading = true
		try {
			const user = await authService.updateProfile(payload)
			this.user = user
			if (this.token) {
				setStoredSession(this.token, user, !!window?.localStorage?.getItem('token'))
			}
		} finally {
			this.loading = false
		}
	}

	async changePassword(payload: { current_password: string; password: string; password_confirmation: string }): Promise<void> {
		this.loading = true
		try {
			await authService.changePassword(payload)
		} finally {
			this.loading = false
		}
	}
}

export const authStore = new AuthStore()
