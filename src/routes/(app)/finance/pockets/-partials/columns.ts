import type { ColumnDef } from '$lib/types/Api'

export const pocketColumns: ColumnDef[] = [
	{ key: 'name', label: 'Nama', sortable: true },
	{ key: 'description', label: 'Deskripsi' },
	{ key: 'balance', label: 'Saldo', sortable: true },
	{ key: 'allocation_category', label: 'Kategori Alokasi', sortable: true },
	{ key: 'is_active', label: 'Status', sortable: true },
]
