import api from "../api/axios";
import type {
  LowStockResponse,
  RecentPurchasesResponse,
  TopSellingResponse,
  SalesSummaryResponse,
} from "../types/report";

export const getLowStock = async (
  threshold = 5
): Promise<LowStockResponse> => {
  const response = await api.get("/reports/low-stock", {
    params: { threshold },
  });
  return response.data;
};

export const getRecentPurchases = async (
  limit = 10
): Promise<RecentPurchasesResponse> => {
  const response = await api.get("/reports/recent-purchases", {
    params: { limit },
  });
  return response.data;
};

export const getTopSelling = async (
  limit = 10
): Promise<TopSellingResponse> => {
  const response = await api.get("/reports/top-selling", {
    params: { limit },
  });
  return response.data;
};

export const getSalesSummary = async (): Promise<SalesSummaryResponse> => {
  const response = await api.get("/reports/sales-summary");
  return response.data;
};
