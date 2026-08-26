import type { StockSekuritas, StoreSekuritasPayload, UpdateSekuritasPayload } from '$lib/types/Stock'
import * as sekuritasService from '$lib/services/sekuritas.service'
import { useCrud } from './useCrud.svelte'

export function useSekuritasAdmin() {
	return useCrud<StockSekuritas, StoreSekuritasPayload, UpdateSekuritasPayload>({
		fetchAll: sekuritasService.fetchSekuritas,
		fetchById: sekuritasService.fetchSekuritasById,
		create: sekuritasService.createSekuritas,
		update: sekuritasService.updateSekuritas,
		remove: sekuritasService.deleteSekuritas,
	})
}
