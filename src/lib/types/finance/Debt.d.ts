import type { FinancePocket } from "./Pocket";

export interface FinanceDebt {
  id: number;

  name: string;
  amount_per_month: number;
  due_date: number;
  pocket_id: number;
  category_tag: string | null;
  is_paid_this_month: boolean;
  paid_at: string | null;
  is_active: boolean;
  note: string | null;

  created_at: string;
  updated_at: string;

  pocket?: FinancePocket;
}