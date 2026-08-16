import type { FinanceAllocationConfig } from "./AllocationConfig";
import type { FinanceIncome } from "./Income";
import type { FinancePocket } from "./Pocket";

export interface FinanceIncomeDistribution {
  id: number;
  income_id: number;
  pocket_id: number;
  allocation_config_id: number;
  category_name: string;
  percentage_snapshot: number;
  amount: number;

  created_at: string;
  updated_at: string;

  pocket?: FinancePocket;
  allocation_config?: FinanceAllocationConfig;
  income?: FinanceIncome;
}