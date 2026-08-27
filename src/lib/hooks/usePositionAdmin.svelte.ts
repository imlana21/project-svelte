import type { StockPosition, UpdatePositionPayload } from '$lib/types/Stock'
import * as positionService from '$lib/services/position.service'
import { useCrud } from './useCrud.svelte'

export function usePositionAdmin() {
	return useCrud<StockPosition, Partial<StockPosition>, UpdatePositionPayload>({
		fetchAll: positionService.fetchPositions,
		fetchById: positionService.fetchPosition,
		update: positionService.updatePosition,
	})
}
