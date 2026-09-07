import type { StockPosition, StockTransaction, StockFundMutation, StockSekuritas } from '$lib/types/Stock'
import type { RequestParams } from '$lib/types/Api'
import { fetchTransactions } from '$lib/services/transaction.service'
import { fetchSekuritas } from '$lib/services/sekuritas.service'
import { fetchPositions } from '$lib/services/position.service'
import { fetchFundMutations } from '$lib/services/fund-mutation.service'
import {
	type RangeKey,
	type TradePeriodKey,
	type EquityPoint,
	type ReturnPoint,
	type AllocationMode,
	type AllocationSlice,
	type TopGainer,
	type TradeSummary,
	type RealizedGainSummary,
	toDateKey,
	rangeStartDate,
	buildDashboardTimeline,
	currentTotalEquity,
	filterByRange,
	buildAllocation,
	buildTradeSummary,
	buildRealizedGain,
	initialsOf
} from '$lib/utils/stockDashboardCalc'

export type {
	RangeKey,
	TradePeriodKey,
	EquityPoint,
	ReturnPoint,
	AllocationMode,
	AllocationSlice,
	TopGainer,
	TradeSummary,
	RealizedGainSummary
}

export { filterByRange, buildAllocation, initialsOf }

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
	{ key: '1W', label: '1W' },
	{ key: '1M', label: '1M' },
	{ key: '3M', label: '3M' },
	{ key: 'YTD', label: 'YTD' },
	{ key: '1Y', label: '1Y' },
	{ key: 'ALL', label: 'All' }
]

const TRADE_PERIOD_OPTIONS: { key: TradePeriodKey; label: string }[] = [
	{ key: 'MTD', label: 'Month to Date' },
	{ key: '1M', label: '1 Bulan Terakhir' },
	{ key: '3M', label: '3 Bulan Terakhir' },
	{ key: 'YTD', label: 'Year to Date' },
	{ key: 'ALL', label: 'Semua Waktu' }
]

const BULK_PARAMS: RequestParams = { page: 1, perPage: 1000 }

export { RANGE_OPTIONS, TRADE_PERIOD_OPTIONS }

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
