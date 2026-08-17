import type { ColumnDef } from '$lib/types/Api'

export const allocationConfigColumns: ColumnDef[] = [
	{ key: 'sort_order', label: 'Urutan', sortable: true },
	{ key: 'category_name', label: 'Kategori', sortable: true },
	{ key: 'percentage', label: 'Persentase', sortable: true },
	{ key: 'is_active', label: 'Status', sortable: true },
]
