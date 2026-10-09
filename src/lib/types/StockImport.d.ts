export interface ImportSummary {
	total: number
	success_count: number
	error_count: number
	success: { row: number; transaction_id: number; sekuritas: string; emiten: string; type: string }[]
	errors: { row: number; message: string }[]
}

export type ImportTransactionResult = (ImportSummary & { mode: 'sync' }) | { mode: 'async'; job_id: number }

export interface StockImportStatus {
	id: number
	status: 'pending' | 'processing' | 'completed' | 'failed' | 'rolled_back'
	total: number
	success_count: number
	error_count: number
	result: ImportSummary | null
	error_message: string | null
}
