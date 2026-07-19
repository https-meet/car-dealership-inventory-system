import api from "../api/axios";
import type { Vehicle, VehicleResponse } from "../types/vehicle";

export const getVehicles = async (): Promise<VehicleResponse> => {
  const response = await api.get("/vehicles");
  return response.data;
};

export const getVehicleById = async (id: string): Promise<Vehicle> => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data.data;
};

export const createVehicle = async (
  data: Omit<Vehicle, "id">
): Promise<Vehicle> => {
  const response = await api.post("/vehicles", data);
  return response.data.data;
};

export const updateVehicle = async (
  id: string,
  data: Partial<Omit<Vehicle, "id">>
): Promise<Vehicle> => {
  const response = await api.put(`/vehicles/${id}`, data);
  return response.data.data;
};

export const deleteVehicle = async (id: string): Promise<void> => {
  await api.delete(`/vehicles/${id}`);
};