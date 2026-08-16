export interface AuthPermission {
  id: number
  name: string
  slug: string
  description: string
  created_at: string
  updated_at: string

  pivot?: {
    role_id: number
    permission_id: number
    created_at: string
    updated_at: string
  }
}

export interface AuthRole {
  id: number
  name: string
  slug: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
  pivot?: {
    user_id: number
    role_id: number
    created_at: string
    updated_at: string
  }

  permissions: AuthPermission[]
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  role: string
  is_active: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string

  roles: AuthRole[]
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthSessionData {
  user: User;
  token: string;
}

export interface UpdateUserPayload {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  is_active?: boolean;
}

export interface AssignRolesPayload {
  role_ids: number[]; // minimal 1 elemen
}

export interface StoreRolePayload {
  name: string;
  slug: string; // alpha_dash, unik
  description?: string | null;
  is_active?: boolean;
}

/**
 * BARU: belum ada di Auth.d.ts sebelumnya. Diperlukan untuk fitur "kelola
 * permission" pada halaman Roles (menu Akses Role & Permission). Mengikuti
 * pola AssignRolesPayload di atas — sesuaikan nama endpoint di backend jika
 * berbeda (lihat README fitur access-control).
 */
export interface AssignPermissionsPayload {
  permission_ids: number[];
}
