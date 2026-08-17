import type { ColumnDef } from '$lib/types/Api'

export const permissionColumns: ColumnDef[] = [
	{ key: 'name', label: 'Nama', sortable: true },
	{ key: 'slug', label: 'Slug', sortable: true },
	{ key: 'description', label: 'Deskripsi' },
]
