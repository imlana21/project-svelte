import type { FinanceDebt } from "./Debt";
import type { FinancePocket } from "./Pocket";

export type FinanceTransactionType = "expense" | "income" | "debt_payment" | "transfer";

export type FinanceCategoryTag = "makan" | "jajan" | "transportasi" | "rumah" | "hiburan" | "lainnya";

export interface FinanceTransaction {
  id: number;
  type: FinanceTransactionType;
  pocket_id: number;
  amount: number;
  description: string;
  category_tag: string | null;
  date: string;
  debt_id: number | null;
  note: string | null;

  created_at: string;
  updated_at: string;

  pocket?: FinancePocket;
  debt?: FinanceDebt;
}