import type { FinancePocket, StorePocketPayload, UpdatePocketPayload } from '$lib/types/finance/Pocket'
import * as pocketService from '$lib/services/pocket.service'
import { useCrud } from './useCrud.svelte'

export function usePocketAdmin() {
	return useCrud<FinancePocket, StorePocketPayload, UpdatePocketPayload>({
		fetchAll: pocketService.fetchPockets,
		fetchById: pocketService.fetchPocket,
		create: pocketService.createPocket,
		update: pocketService.updatePocket,
		remove: pocketService.deletePocket,
	})
}
