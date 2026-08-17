export interface FinanceAllocationConfig {
  id: number;
  category_name: string;
  percentage: number;
  sort_order: number;
  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface StoreAllocationConfigPayload {
  category_name: string;
  percentage: number;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateAllocationConfigPayload {
  category_name: string;
  percentage: number;
  sort_order?: number;
  is_active?: boolean;
}
