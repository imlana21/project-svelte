import type { ColumnDef } from '$lib/types/Api'

export const fundMutationColumns: ColumnDef[] = [
	{ key: 'created_at', label: 'Tanggal', sortable: true },
	{ key: 'type', label: 'Tipe', sortable: true },
	{ key: 'amount', label: 'Jumlah' },
	{ key: 'sekuritas', label: 'Sekuritas' },
	{ key: 'note', label: 'Catatan' },
]
