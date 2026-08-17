import type { ColumnDef } from '$lib/types/Api'

export const userColumns: ColumnDef[] = [
	{ key: 'name', label: 'Nama', sortable: true },
	{ key: 'email', label: 'Email', sortable: true },
	{ key: 'roles', label: 'Role' },
	{ key: 'last_login_at', label: 'Login Terakhir', sortable: true },
	{ key: 'is_active', label: 'Status', sortable: true },
]
