// src/types/stocks/FundMutation.d.ts
// Tabel: stocks_fundmutations (migration 2026_02_04_151009)

import type { StockFundMutationType } from './Enum'
import type { StockSekuritas } from './Sekuritas'

export interface StockFundMutation {
  id: number
  type: StockFundMutationType
  amount: number
  note: string | null
  sekuritas_id: number | null
  created_at: string
  updated_at: string

  sekuritas?: StockSekuritas
}
