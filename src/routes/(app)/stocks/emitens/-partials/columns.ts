import type { ColumnDef } from '$lib/types/Api'

export const emitenColumns: ColumnDef[] = [
	{ key: 'ticker', label: 'Kode', sortable: true },
	{ key: 'name', label: 'Nama', sortable: true },
	{ key: 'sector', label: 'Sektor', sortable: true },
	{ key: 'close', label: 'Harga', sortable: true },
	{ key: 'volume', label: 'Volume', sortable: true },
]
