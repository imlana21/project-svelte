import { describe, it, expect } from 'vitest'
import {
	toDateKey,
	rangeStartDate,
	buildDashboardTimeline,
	currentTotalEquity,
	buildTradeSummary,
	buildRealizedGain,
	filterByRange,
	buildAllocation,
	initialsOf
} from './stockDashboardCalc'
import type { StockTransaction, StockFundMutation, StockPosition, StockSekuritas } from '$lib/types/Stock'

function makeTx(overrides: Partial<StockTransaction> = {}): StockTransaction {
	return {
		id: 1,
		type: 'buy',
		date: '2025-06-01',
		price: 1000,
		lot: 1,
		fee: 10,
		realized_pnl: 0,
		position_id: 1,
		created_at: '2025-06-01',
		updated_at: '2025-06-01',
		...overrides
	}
}

function makeFm(overrides: Partial<StockFundMutation> = {}): StockFundMutation {
	return {
		id: 1,
		type: 'topup',
		amount: 1000000,
		note: null,
		sekuritas_id: 1,
		created_at: '2025-06-01',
		updated_at: '2025-06-01',
		...overrides
	}
}

function makePosition(overrides: Partial<StockPosition> = {}): StockPosition {
	return {
		id: 1,
		lot: 10,
		avg_price: 1000,
		open_date: '2025-01-01',
		close_date: null,
		status: 'open',
		trend: 'medium',
		quadrant: 'leading',
		note: null,
		plan_sl: 0,
		plan_tp: 0,
		emiten_id: 1,
		sekuritas_id: 1,
		created_at: '2025-01-01',
		updated_at: '2025-01-01',
		emiten: { id: 1, ticker: 'BBCA', name: 'BBCA', sector: 'Finance', open: 0, high: 0, low: 0, close: 1500, volume: 0, freq: 0, valuasi: 0, nbsa: 0, created_at: '', updated_at: '' },
		...overrides
	}
}

function makeSekuritas(overrides: Partial<StockSekuritas> = {}): StockSekuritas {
	return {
		id: 1,
		code: 'X',
		name: 'Sekuritas',
		balance: '500000',
		created_at: '',
		updated_at: '',
		...overrides
	}
}

describe('toDateKey', () => {
	it('returns null for null', () => {
		expect(toDateKey(null)).toBeNull()
	})

	it('returns null for undefined', () => {
		expect(toDateKey(undefined)).toBeNull()
	})

	it('returns null for invalid date', () => {
		expect(toDateKey('not-a-date')).toBeNull()
	})

	it('returns YYYY-MM-DD for valid date', () => {
		expect(toDateKey('2025-06-15T10:00:00.000Z')).toBe('2025-06-15')
	})
})

describe('rangeStartDate', () => {
	const ref = new Date('2025-06-15')

	it('returns null for ALL', () => {
		expect(rangeStartDate('ALL', ref)).toBeNull()
	})

	it('returns first day of year for YTD', () => {
		const result = rangeStartDate('YTD', ref)!
		expect(result.getMonth()).toBe(0)
		expect(result.getDate()).toBe(1)
	})

	it('returns first day of current month for MTD', () => {
		const result = rangeStartDate('MTD', ref)!
		expect(result.getMonth()).toBe(5)
		expect(result.getDate()).toBe(1)
	})

	it('returns ~7 days ago for 1W', () => {
		const result = rangeStartDate('1W', ref)!
		const diff = ref.getTime() - result.getTime()
		expect(diff).toBeGreaterThanOrEqual(6 * 86400000)
		expect(diff).toBeLessThanOrEqual(8 * 86400000)
	})

	it('returns ~1 month ago for 1M', () => {
		const result = rangeStartDate('1M', ref)!
		expect(result.getMonth()).toBe(4)
	})

	it('returns ~3 months ago for 3M', () => {
		const result = rangeStartDate('3M', ref)!
		expect(result.getMonth()).toBe(2)
	})

	it('returns ~1 year ago for 1Y', () => {
		const result = rangeStartDate('1Y', ref)!
		expect(result.getFullYear()).toBe(2024)
	})
})

describe('buildDashboardTimeline', () => {
	it('returns empty arrays for empty input', () => {
		const result = buildDashboardTimeline([], [])
		expect(result.equity).toHaveLength(0)
		expect(result.returns).toHaveLength(0)
	})

	it('handles a topup event', () => {
		const fm = makeFm({ type: 'topup', amount: 500000, created_at: '2025-06-01' })
		const result = buildDashboardTimeline([fm], [])
		expect(result.equity.length).toBe(1)
		expect(result.equity[0].equity).toBe(500000)
	})

	it('handles a withdraw event', () => {
		const fm = makeFm({ type: 'withdraw', amount: 200000, created_at: '2025-06-01' })
		const result = buildDashboardTimeline([fm], [])
		expect(result.equity[0].equity).toBe(-200000)
	})
})

describe('currentTotalEquity', () => {
	it('sums cash from sekuritas', () => {
		const sek = [makeSekuritas({ balance: '300000' }), makeSekuritas({ balance: '200000' })]
		expect(currentTotalEquity(sek, [])).toBe(500000)
	})

	it('adds market value from open positions', () => {
		const pos = [makePosition({ lot: 10, avg_price: 1000 })]
		const result = currentTotalEquity([], pos)
		expect(result).toBe(10 * 1500 * 100)
	})

	it('ignores closed positions', () => {
		const pos = [makePosition({ close_date: '2025-06-01', lot: 10, avg_price: 1000 })]
		expect(currentTotalEquity([], pos)).toBe(0)
	})
})

describe('buildTradeSummary', () => {
	it('returns zeros for empty input', () => {
		const s = buildTradeSummary([])
		expect(s.totalTrades).toBe(0)
		expect(s.wins).toBe(0)
		expect(s.losses).toBe(0)
		expect(s.winRate).toBe(0)
	})

	it('calculates wins and losses', () => {
		const txs = [
			makeTx({ type: 'sell', realized_pnl: 5000, position: { avg_price: 1000, lot: 1 } as any }),
			makeTx({ id: 2, type: 'sell', realized_pnl: -2000, position: { avg_price: 1000, lot: 1 } as any })
		]
		const s = buildTradeSummary(txs)
		expect(s.totalTrades).toBe(2)
		expect(s.wins).toBe(1)
		expect(s.losses).toBe(1)
		expect(s.winRate).toBe(50)
	})
})

describe('buildRealizedGain', () => {
	it('returns zeros for no sells', () => {
		const r = buildRealizedGain([makeTx({ type: 'buy' })])
		expect(r.total).toBe(0)
		expect(r.gain).toBe(0)
		expect(r.loss).toBe(0)
		expect(r.series).toHaveLength(0)
	})

	it('calculates cumulative PnL', () => {
		const txs = [
			makeTx({ type: 'sell', realized_pnl: 5000, date: '2025-06-01' }),
			makeTx({ id: 2, type: 'sell', realized_pnl: -2000, date: '2025-06-02' })
		]
		const r = buildRealizedGain(txs)
		expect(r.total).toBe(3000)
		expect(r.gain).toBe(5000)
		expect(r.loss).toBe(-2000)
		expect(r.series).toHaveLength(2)
		expect(r.series[1].cumulative).toBe(3000)
	})
})

describe('filterByRange', () => {
	const points = [
		{ date: '2025-01-01', value: 1 },
		{ date: '2025-06-01', value: 2 },
		{ date: '2025-06-15', value: 3 }
	]

	it('returns all points for ALL', () => {
		expect(filterByRange(points, 'ALL', new Date('2025-06-15'))).toHaveLength(3)
	})

	it('filters by date range', () => {
		const result = filterByRange(points, '1M', new Date('2025-06-15'))
		expect(result.length).toBeGreaterThanOrEqual(1)
	})
})

describe('buildAllocation', () => {
	it('returns empty for no positions', () => {
		expect(buildAllocation([], 'stock')).toHaveLength(0)
	})

	it('groups by stock ticker', () => {
		const pos = [
			makePosition({ lot: 10, emiten: { id: 1, ticker: 'BBCA', close: 1500 } as any }),
			makePosition({ id: 2, lot: 5, emiten: { id: 2, ticker: 'BBRI', close: 2000 } as any })
		]
		const result = buildAllocation(pos, 'stock')
		expect(result).toHaveLength(2)
		expect(result[0].label).toBeDefined()
	})

	it('ignores closed positions', () => {
		const pos = [makePosition({ close_date: '2025-06-01' })]
		expect(buildAllocation(pos, 'stock')).toHaveLength(0)
	})
})

describe('initialsOf', () => {
	it('returns first 2 chars uppercase', () => {
		expect(initialsOf('bbca')).toBe('BB')
		expect(initialsOf('BBCA')).toBe('BB')
	})

	it('handles single char', () => {
		expect(initialsOf('B')).toBe('B')
	})
})
