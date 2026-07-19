export interface DashboardStats {
  totalVehicles: number;
  totalCustomers: number;
  totalPurchases: number;
  availableVehicles: number;
  outOfStockVehicles: number;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}