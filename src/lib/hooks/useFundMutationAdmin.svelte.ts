import type { StockFundMutation, StoreFundMutationPayload } from '$lib/types/Stock'
import * as fundMutationService from '$lib/services/fund-mutation.service'
import { useCrud } from './useCrud.svelte'

export function useFundMutationAdmin() {
	return useCrud<StockFundMutation, StoreFundMutationPayload>({
		fetchAll: fundMutationService.fetchFundMutations,
		fetchById: fundMutationService.fetchFundMutation,
		create: fundMutationService.createFundMutation,
		remove: fundMutationService.deleteFundMutation,
	})
}
