export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  year: number;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface VehicleResponse {
  success: boolean;
  data: Vehicle[];
}