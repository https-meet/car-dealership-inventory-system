// Matches the Prisma Purchase model returned by the backend
export interface Purchase {
  id: string;
  quantity: number;
  userId: string;
  vehicleId: string;
  purchasedAt: string; // ISO date string
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  data: Purchase[];
}

export interface CreatePurchaseRequest {
  vehicleId: string;
  quantity: number;
}

export interface CreatePurchaseApiResponse {
  success: boolean;
  message: string;
  data: Purchase;
}
