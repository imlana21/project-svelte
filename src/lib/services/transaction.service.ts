import type { ApiEnvelope, PaginatedResponse, RequestParams } from '$lib/types/Api'
import type { RealizedPnL, StockTransaction, StoreTransactionPayload } from '$lib/types/Stock'
import { http } from '$lib/utils/http'

export function fetchTransactions(params?: RequestParams): Promise<PaginatedResponse<StockTransaction>> {
	return http.get<PaginatedResponse<StockTransaction>>('/stock/transactions', params)
}

export function fetchTransaction(id: number): Promise<ApiEnvelope<StockTransaction>> {
	return http.get<ApiEnvelope<StockTransaction>>(`/stock/transactions/${id}`)
}

export function createTransaction(payload: StoreTransactionPayload): Promise<ApiEnvelope<StockTransaction>> {
	return http.post<ApiEnvelope<StockTransaction>>('/stock/transactions', payload)
}

export function deleteTransaction(id: number): Promise<ApiEnvelope<null>> {
	return http.delete<ApiEnvelope<null>>(`/stock/transactions/${id}`)
}

export function fetchRealizedHistory(params?: RequestParams): Promise<PaginatedResponse<RealizedPnL>> {
	return http.get<PaginatedResponse<RealizedPnL>>('/stock/transactions/realized-history', params)
}

export interface RealizedPnLSummary {
	total_realized_pnl: number
	total_profit: number
	total_loss: number
	total_transactions: number
	winning_trades: number
	losing_trades: number
	by_emiten: Array<{
		emiten_id: number
		ticker: string
		total_pnl: number
	}>
}

export function fetchRealizedPnLSummary(params?: { year?: number; month?: number }): Promise<ApiEnvelope<RealizedPnLSummary>> {
	return http.get<ApiEnvelope<RealizedPnLSummary>>('/stock/reports/realized-pnl', params as RequestParams)
}
