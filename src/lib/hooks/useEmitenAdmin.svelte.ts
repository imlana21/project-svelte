import type { StockEmiten, StoreEmitenPayload } from '$lib/types/Stock'
import * as emitenService from '$lib/services/emiten.service'
import { useCrud } from './useCrud.svelte'

export function useEmitenAdmin() {
	const crud = useCrud<StockEmiten, StoreEmitenPayload>({
		fetchAll: emitenService.fetchEmitens,
		fetchById: emitenService.fetchEmiten,
		create: emitenService.createEmiten,
		update: emitenService.updateEmiten,
		remove: emitenService.deleteEmiten,
	})

	let importing = $state(false)

	async function importEod(file: File) {
		importing = true
		try {
			return await emitenService.importEod(file)
		} finally {
			importing = false
		}
	}

	return {
		get items() { return crud.items },
		get item() { return crud.item },
		get meta() { return crud.meta },
		get loading() { return crud.loading },
		get importing() { return importing },
		fetchAll: crud.fetchAll,
		fetchById: crud.fetchById,
		create: crud.create,
		update: crud.update,
		remove: crud.remove,
		setItem: crud.setItem,
		importEod,
	}
}
