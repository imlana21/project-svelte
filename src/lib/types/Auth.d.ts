export interface AuthPermission {
	id: number
	name: string
	slug: string
	description: string | null
	created_at: string
	updated_at: string

	/** Hanya tersedia pada endpoint detail (`GET /auth/permissions/{id}`). */
	roles?: Pick<AuthRole, 'id' | 'name'>[]
}

export interface AuthRole {
	id: number
	name: string
	slug: string
	description: string | null
	is_active: boolean
	created_at: string
	updated_at: string
	users_count?: number

	permissions: AuthPermission[]
}

/**
 * Shape user dari `UserResource` backend — roles/permissions di-flatten
 * menjadi array string (BUKAN array object).
 */
export interface User {
	id: number
	name: string
	email: string
	is_active: boolean
	last_login_at: string | null
	created_at: string
	role_ids: number[]
	roles: string[]
	permissions: string[]
}

export interface RegisterPayload {
	name: string
	email: string
	password: string
	password_confirmation: string
}

export interface LoginPayload {
	email: string
	password: string
}

export interface AuthSessionData {
	user: User
	token: string
}

export interface UpdateUserPayload {
	name: string
	email: string
	password?: string
	password_confirmation?: string
	is_active?: boolean
}

export interface AssignRolesPayload {
	role_ids: number[] // minimal 1 elemen
}

export interface StoreRolePayload {
	name: string
	slug: string // alpha_dash, unik
	description?: string | null
	is_active?: boolean
}

export interface UpdateRolePayload {
	name: string
	slug: string
	description?: string | null
	is_active?: boolean
}

export interface AssignPermissionsPayload {
	permission_ids: number[] // array kosong = lepas semua
}

export interface StorePermissionPayload {
	name: string
	slug: string
	description?: string | null
}

export interface UpdatePermissionPayload {
	name: string
	slug: string
	description?: string | null
}
