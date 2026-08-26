import type { FinanceAllocationConfig, StoreAllocationConfigPayload, UpdateAllocationConfigPayload } from '$lib/types/finance/AllocationConfig'
import * as allocationConfigService from '$lib/services/allocation-config.service'
import { useCrud } from './useCrud.svelte'

export function useAllocationConfigAdmin() {
	return useCrud<FinanceAllocationConfig, StoreAllocationConfigPayload, UpdateAllocationConfigPayload>({
		fetchAll: allocationConfigService.fetchAllocationConfigs,
		fetchById: allocationConfigService.fetchAllocationConfig,
		create: allocationConfigService.createAllocationConfig,
		update: allocationConfigService.updateAllocationConfig,
		remove: allocationConfigService.deleteAllocationConfig,
	})
}
