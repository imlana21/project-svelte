import type { ColumnDef } from '$lib/types/Api'

export const analysisColumns: ColumnDef[] = [
	{ key: 'ticker', label: 'Ticker', sortable: true },
	{ key: 'range_buy', label: 'Range Buy', sortable: true },
	{ key: 'tp1', label: 'TP1', sortable: true },
	{ key: 'tp2', label: 'TP2', sortable: true },
	{ key: 'sl', label: 'SL', sortable: true },
	{ key: 'source', label: 'Source', sortable: true },
	{ key: 'is_valid', label: 'Valid', sortable: true },
	{ key: 'created_at', label: 'Tanggal', sortable: true },
]
