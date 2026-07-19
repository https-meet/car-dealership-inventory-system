import api from "../api/axios";
import type {
  CreatePurchaseRequest,
  Purchase,
  PurchaseResponse,
} from "../types/purchase";

export const getPurchases = async (): Promise<PurchaseResponse> => {
  const response = await api.get("/purchases");
  return response.data;
};

export const createPurchase = async (
  data: CreatePurchaseRequest
): Promise<Purchase> => {
  const response = await api.post("/purchases", data);
  return response.data.data;
};
