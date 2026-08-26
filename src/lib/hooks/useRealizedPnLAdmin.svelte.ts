import type { RealizedPnL } from '$lib/types/Stock'
import * as transactionService from '$lib/services/transaction.service'
import { useCrud } from './useCrud.svelte'

export function useRealizedPnLAdmin() {
	return useCrud<RealizedPnL>({
		fetchAll: transactionService.fetchRealizedHistory,
	})
}
