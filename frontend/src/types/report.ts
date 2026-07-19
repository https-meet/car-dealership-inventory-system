// ─── Low Stock ────────────────────────────────────────────────────────────────
// Matches report.service.ts getLowStockVehicles select fields
export interface LowStockVehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  quantity: number;
  price: number | string; // Prisma Decimal serialises as string over JSON
}

export interface LowStockResponse {
  success: boolean;
  message: string;
  data: LowStockVehicle[];
}

// ─── Recent Purchases ─────────────────────────────────────────────────────────
// Matches report.service.ts getRecentPurchases include fields
export interface RecentPurchaseUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface RecentPurchaseVehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number | string;
}

export interface RecentPurchase {
  id: string;
  quantity: number;
  purchasedAt: string;
  user: RecentPurchaseUser;
  vehicle: RecentPurchaseVehicle;
}

export interface RecentPurchasesResponse {
  success: boolean;
  message: string;
  data: RecentPurchase[];
}

// ─── Top Selling ──────────────────────────────────────────────────────────────
// Matches report.service.ts getTopSellingVehicles return shape
export interface TopSellingVehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number | string;
}

export interface TopSellingEntry {
  vehicle: TopSellingVehicle | undefined;
  totalSold: number;
}

export interface TopSellingResponse {
  success: boolean;
  message: string;
  data: TopSellingEntry[];
}

// ─── Sales Summary ────────────────────────────────────────────────────────────
// Matches report.service.ts getSalesSummary return shape
export interface SalesSummary {
  totalRevenue: number;
  totalUnitsSold: number;
  totalPurchases: number;
}

export interface SalesSummaryResponse {
  success: boolean;
  message: string;
  data: SalesSummary;
}
