import api from "../api/axios";
import type { DashboardResponse } from "../types/dashboard";

export const getDashboardStats = async (): Promise<DashboardResponse> => {
  const response = await api.get("/dashboard");
  return response.data;
};
