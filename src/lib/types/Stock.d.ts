export interface StockEmiten {
	id: number
	ticker: string
	name: string
	sector: string
	open: number
	high: number
	low: number
	close: number
	volume: number
	freq: number
	valuasi: number
	nbsa: number
	created_at: string
	updated_at: string
}

export interface StockSekuritas {
	id: number
	code: string
	name: string
	balance: string
	created_at: string
	updated_at: string
}

export interface StockPosition {
	id: number
	lot: number
	avg_price: number
	open_date: string
	close_date: string | null
	status: 'open' | 'closed'
	trend: 'extreme' | 'strong' | 'medium' | 'weak' | 'down'
	quadrant: 'leading' | 'improving' | 'weakening' | 'lagging'
	note: string | null
	plan_sl: number
	plan_tp: number
	emiten_id: number | null
	sekuritas_id: number | null
	created_at: string
	updated_at: string
	emiten?: StockEmiten
	sekuritas?: StockSekuritas
}

export interface StockTransaction {
	id: number
	type: 'buy' | 'sell'
	date: string
	price: number
	lot: number
	fee: number
	realized_pnl: number
	position_id: number | null
	created_at: string
	updated_at: string
	position?: StockPosition
	total_amount?: number
	net_amount?: number
}

export interface StockFundMutation {
	id: number
	type: 'topup' | 'withdraw' | 'adjust'
	amount: number
	note: string | null
	sekuritas_id: number | null
	created_at: string
	updated_at: string
	sekuritas?: StockSekuritas
}

export interface RealizedPnL {
	id: number
	type: string
	date: string
	lot: number
	price: number
	fee: number
	realized_pnl: number
	position?: StockPosition
}

export interface StoreEmitenPayload {
	ticker: string
	name?: string
	sector: string
}

export interface UpdateEmitenPayload {
	ticker?: string
	name?: string
	sector?: string
}

export interface StoreSekuritasPayload {
	code: string
	name: string
	balance?: number
}

export interface UpdateSekuritasPayload {
	code?: string
	name?: string
	balance?: number
}

export interface UpdatePositionPayload {
	plan_sl?: number | null
	plan_tp?: number | null
	trend?: string | null
	quadrant?: string | null
	note?: string | null
}

export interface StoreTransactionPayload {
	sekuritas_id: number
	emiten_id: number
	type: 'buy' | 'sell'
	date: string
	price: number
	lot: number
	fee?: number | null
	trend?: string | null
	quadrant?: string | null
	plan_sl?: number | null
	plan_tp?: number | null
	setup?: string | null
}

export interface StoreFundMutationPayload {
	sekuritas_id: number
	type: 'topup' | 'withdraw' | 'adjust'
	amount: number
	note?: string | null
}
