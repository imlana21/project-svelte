import type { StockPosition, StockTransaction, StockFundMutation, StockSekuritas } from '$lib/types/Stock'
import type { RequestParams } from '$lib/types/Api'
import { fetchTransactions } from '$lib/services/transaction.service'
import { fetchSekuritas } from '$lib/services/sekuritas.service'
import { fetchPositions } from '$lib/services/position.service'
import { fetchFundMutations } from '$lib/services/fund-mutation.service'

const LOT_SIZE = 100

export type RangeKey = '1W' | '1M' | '3M' | 'YTD' | '1Y' | 'ALL'

export const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
	{ key: '1W', label: '1W' },
	{ key: '1M', label: '1M' },
	{ key: '3M', label: '3M' },
	{ key: 'YTD', label: 'YTD' },
	{ key: '1Y', label: '1Y' },
	{ key: 'ALL', label: 'All' }
]

export type TradePeriodKey = 'MTD' | '1M' | '3M' | 'YTD' | 'ALL'

export const TRADE_PERIOD_OPTIONS: { key: TradePeriodKey; label: string }[] = [
	{ key: 'MTD', label: 'Month to Date' },
	{ key: '1M', label: '1 Bulan Terakhir' },
	{ key: '3M', label: '3 Bulan Terakhir' },
	{ key: 'YTD', label: 'Year to Date' },
	{ key: 'ALL', label: 'Semua Waktu' }
]

export type EquityPoint = {
	date: string
	equity: number
	pnl: number
	pnlPercent: number
}

export type ReturnPoint = {
	date: string
	returnPercent: number
}

export type AllocationMode = 'stock' | 'sector'

type AllocationSlice = {
	key: string
	label: string
	value: number
	percent: number
	color: string
}

export type TopGainer = {
	ticker: string
	trades: number
	pnl: number
}

export type TradeSummary = {
	totalTrades: number
	wins: number
	losses: number
	winRate: number
	totalTransactionValue: number
	totalOrders: number
	maxProfit: number
	maxProfitPercent: number
	maxLoss: number
	maxLossPercent: number
	avgProfit: number
	avgLoss: number
	topGainers: TopGainer[]
	topLosers: TopGainer[]
}

export type RealizedGainSummary = {
	total: number
	gain: number
	loss: number
	series: { date: string; cumulative: number }[]
}

const CHART_COLORS = [
	'var(--color-primary)',
	'var(--color-secondary)',
	'#f97316',
	'#8b5cf6',
	'#06b6d4'
]

const BULK_PARAMS: RequestParams = { page: 1, perPage: 1000 }

function toDateKey(value: string | null | undefined): string | null {
	if (!value) return null
	const d = new Date(value)
	if (Number.isNaN(d.getTime())) return null
	return d.toISOString().slice(0, 10)
}

function rangeStartDate(range: RangeKey | TradePeriodKey, reference: Date): Date | null {
	const d = new Date(reference)
	switch (range) {
		case '1W':
			d.setDate(d.getDate() - 7)
			return d
		case '1M':
			d.setMonth(d.getMonth() - 1)
			return d
		case '3M':
			d.setMonth(d.getMonth() - 3)
			return d
		case 'MTD':
			return new Date(reference.getFullYear(), reference.getMonth(), 1)
		case 'YTD':
			return new Date(reference.getFullYear(), 0, 1)
		case '1Y':
			d.setFullYear(d.getFullYear() - 1)
			return d
		case 'ALL':
		default:
			return null
	}
}

function buildDashboardTimeline(
	fundMutations: StockFundMutation[],
	transactions: StockTransaction[]
): { equity: EquityPoint[]; returns: ReturnPoint[] } {
	type Event = { date: string; ts: number; cashDelta: number; costBasisDelta: number; depositDelta: number }
	const events: Event[] = []

	for (const fm of fundMutations) {
		const date = toDateKey(fm.created_at)
		if (!date) continue
		const ts = new Date(fm.created_at).getTime()
		let cashDelta = 0
		let depositDelta = 0
		if (fm.type === 'topup') {
			cashDelta = Math.abs(fm.amount)
			depositDelta = Math.abs(fm.amount)
		} else if (fm.type === 'withdraw') {
			cashDelta = -Math.abs(fm.amount)
			depositDelta = -Math.abs(fm.amount)
		} else {
			cashDelta = fm.amount
			depositDelta = fm.amount
		}
		events.push({ date, ts, cashDelta, costBasisDelta: 0, depositDelta })
	}

	const txByPosition = new Map<number, StockTransaction[]>()
	for (const tx of transactions) {
		const key = tx.position_id ?? 0
		const list = txByPosition.get(key) ?? []
		list.push(tx)
		txByPosition.set(key, list)
	}

	for (const list of txByPosition.values()) {
		const sorted = [...list].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		let lot = 0
		let costBasis = 0
		for (const tx of sorted) {
			const date = toDateKey(tx.date)
			if (!date) continue
			const ts = new Date(tx.date).getTime()
			const gross = tx.price * tx.lot * LOT_SIZE
			if (tx.type === 'buy') {
				events.push({ date, ts, cashDelta: -(gross + tx.fee), costBasisDelta: gross, depositDelta: 0 })
				lot += tx.lot
				costBasis += gross
			} else {
				const avgCostPerLot = lot > 0 ? costBasis / lot : 0
				const soldCostBasis = avgCostPerLot * tx.lot
				events.push({ date, ts, cashDelta: gross - tx.fee, costBasisDelta: -soldCostBasis, depositDelta: 0 })
				lot = Math.max(0, lot - tx.lot)
				costBasis = Math.max(0, costBasis - soldCostBasis)
			}
		}
	}

	events.sort((a, b) => a.ts - b.ts)

	const byDate = new Map<string, { cash: number; cost: number; deposit: number }>()
	for (const e of events) {
		const cur = byDate.get(e.date) ?? { cash: 0, cost: 0, deposit: 0 }
		cur.cash += e.cashDelta
		cur.cost += e.costBasisDelta
		cur.deposit += e.depositDelta
		byDate.set(e.date, cur)
	}

	const dates = Array.from(byDate.keys()).sort()
	let cash = 0
	let cost = 0
	let deposit = 0
	let prevEquity = 0

	const equity: EquityPoint[] = []
	const returns: ReturnPoint[] = []

	for (const date of dates) {
		const d = byDate.get(date)!
		cash += d.cash
		cost += d.cost
		deposit += d.deposit
		const value = cash + cost
		const pnl = value - prevEquity
		const pnlPercent = prevEquity !== 0 ? (pnl / Math.abs(prevEquity)) * 100 : 0
		equity.push({ date, equity: value, pnl, pnlPercent })
		returns.push({
			date,
			returnPercent: deposit > 0 ? ((value - deposit) / deposit) * 100 : 0
		})
		prevEquity = value
	}

	return { equity, returns }
}

function currentTotalEquity(
	sekuritasList: StockSekuritas[],
	positions: StockPosition[]
): number {
	const cash = sekuritasList.reduce((sum, s) => sum + (parseFloat(s.balance) || 0), 0)
	const openPositions = positions.filter((p) => !p.close_date)
	const marketValue = openPositions.reduce((sum, p) => {
		const price = p.emiten?.close ?? p.avg_price
		return sum + price * p.lot * LOT_SIZE
	}, 0)
	return cash + marketValue
}

export function filterByRange<T extends { date: string }>(points: T[], range: RangeKey, reference: Date): T[] {
	const start = rangeStartDate(range, reference)
	if (!start) return points
	const startKey = start.toISOString().slice(0, 10)
	return points.filter((p) => p.date >= startKey)
}

export function buildAllocation(positions: StockPosition[], mode: AllocationMode): AllocationSlice[] {
	const open = positions.filter((p) => !p.close_date)
	const groups = new Map<string, { label: string; value: number }>()

	for (const p of open) {
		const price = p.emiten?.close ?? p.avg_price
		const value = price * p.lot * LOT_SIZE
		const key = mode === 'stock' ? (p.emiten?.ticker ?? `#${p.emiten_id}`) : (p.emiten?.sector ?? 'Lainnya')
		const cur = groups.get(key) ?? { label: key, value: 0 }
		cur.value += value
		groups.set(key, cur)
	}

	const total = Array.from(groups.values()).reduce((sum, g) => sum + g.value, 0)

	return Array.from(groups.entries())
		.map(([key, g], index) => ({
			key,
			label: g.label,
			value: g.value,
			percent: total > 0 ? (g.value / total) * 100 : 0,
			color: CHART_COLORS[index % CHART_COLORS.length]
		}))
		.sort((a, b) => b.value - a.value)
}

function buildTradeSummary(transactions: StockTransaction[]): TradeSummary {
	const sells = transactions.filter((t) => t.type === 'sell')
	const wins = sells.filter((t) => t.realized_pnl > 0)
	const losses = sells.filter((t) => t.realized_pnl < 0)

	const pnlPercentOf = (t: StockTransaction): number => {
		const avg = t.position?.avg_price
		if (!avg) return 0
		return (t.realized_pnl / (avg * t.lot * LOT_SIZE)) * 100
	}

	const maxProfitTx = wins.reduce<StockTransaction | undefined>(
		(best, t) => (!best || t.realized_pnl > best.realized_pnl ? t : best),
		undefined
	)
	const maxLossTx = losses.reduce<StockTransaction | undefined>(
		(worst, t) => (!worst || t.realized_pnl < worst.realized_pnl ? t : worst),
		undefined
	)

	const byTicker = new Map<string, { trades: number; pnl: number }>()
	for (const t of sells) {
		const ticker = t.position?.emiten?.ticker ?? `#${t.position_id}`
		const cur = byTicker.get(ticker) ?? { trades: 0, pnl: 0 }
		cur.trades += 1
		cur.pnl += t.realized_pnl
		byTicker.set(ticker, cur)
	}

	const topGainers: TopGainer[] = Array.from(byTicker.entries())
		.map(([ticker, v]) => ({ ticker, trades: v.trades, pnl: v.pnl }))
		.sort((a, b) => b.pnl - a.pnl)
		.slice(0, 5)

	const topLosers: TopGainer[] = Array.from(byTicker.entries())
		.map(([ticker, v]) => ({ ticker, trades: v.trades, pnl: v.pnl }))
		.sort((a, b) => a.pnl - b.pnl)
		.slice(0, 5)

	return {
		totalTrades: sells.length,
		wins: wins.length,
		losses: losses.length,
		winRate: sells.length > 0 ? (wins.length / sells.length) * 100 : 0,
		totalTransactionValue: transactions.reduce((sum, t) => sum + t.price * t.lot * LOT_SIZE, 0),
		totalOrders: transactions.length,
		maxProfit: maxProfitTx?.realized_pnl ?? 0,
		maxProfitPercent: maxProfitTx ? pnlPercentOf(maxProfitTx) : 0,
		maxLoss: maxLossTx?.realized_pnl ?? 0,
		maxLossPercent: maxLossTx ? pnlPercentOf(maxLossTx) : 0,
		avgProfit: wins.length > 0 ? wins.reduce((s, t) => s + t.realized_pnl, 0) / wins.length : 0,
		avgLoss: losses.length > 0 ? losses.reduce((s, t) => s + t.realized_pnl, 0) / losses.length : 0,
		topGainers,
		topLosers
	}
}

function buildRealizedGain(transactions: StockTransaction[]): RealizedGainSummary {
	const sells = [...transactions.filter((t) => t.type === 'sell')].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
	)

	let cumulative = 0
	const series = sells.map((t) => {
		cumulative += t.realized_pnl
		return { date: toDateKey(t.date) ?? t.date, cumulative }
	})

	return {
		total: cumulative,
		gain: sells.filter((t) => t.realized_pnl > 0).reduce((s, t) => s + t.realized_pnl, 0),
		loss: sells.filter((t) => t.realized_pnl < 0).reduce((s, t) => s + t.realized_pnl, 0),
		series
	}
}

export function initialsOf(ticker: string): string {
	return ticker.slice(0, 2).toUpperCase()
}

export function useStockDashboard() {
	let sekuritasList = $state<StockSekuritas[]>([])
	let positions = $state<StockPosition[]>([])
	let transactions = $state<StockTransaction[]>([])
	let fundMutations = $state<StockFundMutation[]>([])
	let loading = $state(false)

	let equityRange = $state<RangeKey>('YTD')
	let returnRange = $state<RangeKey>('YTD')
	let tradePeriod = $state<TradePeriodKey>('MTD')

	async function loadAll() {
		loading = true
		try {
			const [sekRes, posRes, txRes, fmRes] = await Promise.all([
				fetchSekuritas(BULK_PARAMS),
				fetchPositions(BULK_PARAMS),
				fetchTransactions(BULK_PARAMS),
				fetchFundMutations(BULK_PARAMS)
			])
			sekuritasList = sekRes.data
			positions = posRes.data
			transactions = txRes.data
			fundMutations = fmRes.data
		} finally {
			loading = false
		}
	}

	const { equity, returns } = $derived(buildDashboardTimeline(fundMutations, transactions))
	const totalEquity = $derived(currentTotalEquity(sekuritasList, positions))
	const equityPoints = $derived(filterByRange(equity, equityRange, new Date()))
	const returnPoints = $derived(filterByRange(returns, returnRange, new Date()))

	const tradeStart = $derived(rangeStartDate(tradePeriod, new Date()))
	const tradeTransactions = $derived(
		tradeStart
			? transactions.filter((t) => (t.date || '').slice(0, 10) >= tradeStart.toISOString().slice(0, 10))
			: transactions
	)

	const tradeSummary = $derived(buildTradeSummary(tradeTransactions))
	const realizedGain = $derived(buildRealizedGain(tradeTransactions))
	const periodLabel = $derived(TRADE_PERIOD_OPTIONS.find((o) => o.key === tradePeriod)?.label ?? '')

	return {
		get sekuritasList() { return sekuritasList },
		get positions() { return positions },
		get transactions() { return transactions },
		get fundMutations() { return fundMutations },
		get loading() { return loading },
		get equityRange() { return equityRange },
		set equityRange(v: RangeKey) { equityRange = v },
		get returnRange() { return returnRange },
		set returnRange(v: RangeKey) { returnRange = v },
		get tradePeriod() { return tradePeriod },
		set tradePeriod(v: TradePeriodKey) { tradePeriod = v },
		get equity() { return equity },
		get returns() { return returns },
		get totalEquity() { return totalEquity },
		get equityPoints() { return equityPoints },
		get returnPoints() { return returnPoints },
		get tradeSummary() { return tradeSummary },
		get realizedGain() { return realizedGain },
		get periodLabel() { return periodLabel },
		loadAll
	}
}
