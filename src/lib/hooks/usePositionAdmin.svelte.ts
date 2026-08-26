import type { StockPosition } from '$lib/types/Stock'
import * as positionService from '$lib/services/position.service'
import { useCrud } from './useCrud.svelte'

export function usePositionAdmin() {
	return useCrud<StockPosition>({
		fetchAll: positionService.fetchPositions,
		fetchById: positionService.fetchPosition,
	})
}
