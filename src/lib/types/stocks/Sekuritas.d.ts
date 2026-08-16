// src/types/stocks/Sekuritas.d.ts
// Tabel: stocks_sekuritas (migration 2026_02_04_150953)

export interface StockSekuritas {
  id: number
  code: string
  name: string
  balance: string // decimal(30,2) — diserialisasi Laravel sebagai string, contoh "3792839.00"
  created_at: string
  updated_at: string
}
