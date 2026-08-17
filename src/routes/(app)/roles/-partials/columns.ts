import type { ColumnDef } from '$lib/types/Api'

export const roleColumns: ColumnDef[] = [
	{ key: 'name', label: 'Nama', sortable: true },
	{ key: 'slug', label: 'Slug' },
	{ key: 'description', label: 'Deskripsi' },
	{ key: 'permissions', label: 'Permission' },
	{ key: 'is_active', label: 'Status', sortable: true },
]
