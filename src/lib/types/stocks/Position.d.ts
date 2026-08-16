// src/types/stocks/Position.d.ts
// Tabel: stocks_positions (migration 2026_02_04_151028)

import type { StockEmiten } from './Emiten'
import type { StockSekuritas } from './Sekuritas'
import type { StockPositionStatusType, StockQuadrantType, StockTrendType } from './Enum'

export interface StockPosition {
  id: number
  lot: number
  avg_price: number
  open_date: string
  close_date: string | null
  status: StockPositionStatusType
  trend: StockTrendType
  quadrant: StockQuadrantType
  note: string | null
  plan_sl: number
  plan_tp: number
  emiten_id: number | null
  sekuritas_id: number | null
  created_at: string
  updated_at: string

  emiten?: StockEmiten
  sekuritas?: StockSekuritas
}
