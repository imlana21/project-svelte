import { describe, it, expect } from 'vitest'
import { formatRupiah, formatDate, formatNumber } from './format'

describe('formatRupiah', () => {
	it('returns "Rp 0" for null', () => {
		expect(formatRupiah(null)).toBe('Rp 0')
	})

	it('returns "Rp 0" for undefined', () => {
		expect(formatRupiah(undefined)).toBe('Rp 0')
	})

	it('returns "Rp 0" for NaN string', () => {
		expect(formatRupiah('abc')).toBe('Rp 0')
	})

	it('formats valid number', () => {
		const result = formatRupiah(15000)
		expect(result).toMatch(/^Rp[\s\u00a0]15\.000$/)
	})

	it('formats zero', () => {
		const result = formatRupiah(0)
		expect(result).toMatch(/^Rp[\s\u00a0]0$/)
	})

	it('formats string number', () => {
		const result = formatRupiah('100000')
		expect(result).toMatch(/^Rp[\s\u00a0]100\.000$/)
	})

	it('formats large number', () => {
		const result = formatRupiah(1000000000)
		expect(result).toMatch(/^Rp[\s\u00a0]1\.000\.000\.000$/)
	})

	it('formats negative number', () => {
		const result = formatRupiah(-5000)
		expect(result).toMatch(/^-Rp[\s\u00a0]5\.000$/)
	})
})

describe('formatDate', () => {
	it('returns "-" for null', () => {
		expect(formatDate(null)).toBe('-')
	})

	it('returns "-" for undefined', () => {
		expect(formatDate(undefined)).toBe('-')
	})

	it('returns "-" for empty string', () => {
		expect(formatDate('')).toBe('-')
	})

	it('formats valid date string', () => {
		const result = formatDate('2025-01-15')
		expect(result).toContain('15')
		expect(result).toContain('2025')
	})

	it('formats ISO datetime', () => {
		const result = formatDate('2025-06-01T00:00:00.000Z')
		expect(result).toContain('2025')
	})
})

describe('formatNumber', () => {
	it('returns "-" for null', () => {
		expect(formatNumber(null)).toBe('-')
	})

	it('returns "-" for undefined', () => {
		expect(formatNumber(undefined)).toBe('-')
	})

	it('formats valid number', () => {
		expect(formatNumber(1000)).toBe('1.000')
	})

	it('formats zero', () => {
		expect(formatNumber(0)).toBe('0')
	})

	it('formats large number', () => {
		expect(formatNumber(1000000)).toBe('1.000.000')
	})
})
