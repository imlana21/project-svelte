import type { FinanceIncomeDistribution } from "./IncomeDistribution";

export interface FinanceIncome {
  id: number;
  amount: number;
  source: string | null;
  note: string | null;
  period: string;
  is_distributed: boolean;

  created_at: string;
  updated_at: string;

  distributions?: FinanceIncomeDistribution[];
}

export interface StoreIncomePayload {
  amount: number;
  source?: string;
  note?: string;
  period: string;
}

export interface UpdateIncomePayload {
  source?: string;
  note?: string;
}
