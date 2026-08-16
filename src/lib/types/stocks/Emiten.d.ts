// src/types/stocks/Emiten.d.ts
// Tabel: stocks_emitens (migration 2026_02_04_151002 + 2026_07_12_120000)

export interface StockEmiten {
  id: number
  ticker: string
  name: string
  sector: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  freq: number
  valuasi: number
  nbsa: number
  created_at: string // ISO Date String
  updated_at: string // ISO Date String
}
