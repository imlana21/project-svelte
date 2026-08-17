import type { ColumnDef } from '$lib/types/Api'

export const transactionColumns: ColumnDef[] = [
	{ key: 'type', label: 'Jenis', sortable: true },
	{ key: 'ticker', label: 'Emiten', sortable: true },
	{ key: 'lot', label: 'Lot' },
	{ key: 'price', label: 'Harga' },
	{ key: 'fee', label: 'Fee' },
	{ key: 'total', label: 'Total' },
	{ key: 'date', label: 'Tanggal', sortable: true },
]
