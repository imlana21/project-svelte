import type { ColumnDef } from '$lib/types/Api'

export const sekuritasColumns: ColumnDef[] = [
	{ key: 'code', label: 'Kode', sortable: true },
	{ key: 'name', label: 'Nama', sortable: true },
	{ key: 'balance', label: 'Saldo', sortable: true },
]
