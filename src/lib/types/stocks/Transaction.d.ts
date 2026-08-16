// src/types/stocks/Transaction.d.ts
// Tabel: stocks_transactions (migration 2026_02_04_151029)

import type { StockPosition } from './Position'
import type { StockTransactionType } from './Enum'

export interface StockTransaction {
  id: number
  type: StockTransactionType
  date: string
  price: number
  lot: number
  fee: number
  realized_pnl: number
  position_id: number | null
  created_at: string
  updated_at: string

  position?: StockPosition
}
