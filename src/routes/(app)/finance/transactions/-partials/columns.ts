import type { ColumnDef } from '$lib/types/Api'

export const transactionColumns: ColumnDef[] = [
	{ key: 'date', label: 'Tanggal', sortable: true },
	{ key: 'type', label: 'Tipe', sortable: true },
	{ key: 'description', label: 'Deskripsi', sortable: true },
	{ key: 'pocket', label: 'Pocket' },
	{ key: 'category_tag', label: 'Kategori', sortable: true },
	{ key: 'amount', label: 'Jumlah' },
]
