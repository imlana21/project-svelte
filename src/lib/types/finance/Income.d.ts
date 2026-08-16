export interface FinanceIncome {
  id: number;
  amount: number;
  source: string | null;
  note: string | null;
  period: string;
  is_distributed: boolean;

  created_at: string;
  updated_at: string;
}