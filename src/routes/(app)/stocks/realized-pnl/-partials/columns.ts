import type { ColumnDef } from '$lib/types/Api'

export const realizedPnLColumns: ColumnDef[] = [
	{ key: 'date', label: 'Tanggal', sortable: true },
	{ key: 'ticker', label: 'Emiten' },
	{ key: 'lot', label: 'Lot' },
	{ key: 'price', label: 'Harga' },
	{ key: 'realized_pnl', label: 'Realized PnL' },
]
