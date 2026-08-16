export interface FinancePocket {
  id: number;
  name: string;
  description: string | null;
  balance: number;
  allocation_config_id: number;
  is_active: boolean;

  created_at: string;
  updated_at: string;
}