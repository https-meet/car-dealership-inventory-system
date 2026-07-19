import { Vehicle } from "@prisma/client";
import { CreateVehicleDto, UpdateVehicleDto } from "../../types/vehicle.types";

export interface IVehicleRepository {
  create(data: CreateVehicleDto): Promise<Vehicle>;

  findAll(): Promise<Vehicle[]>;

  findById(id: string): Promise<Vehicle | null>;

  update(id: string, data: UpdateVehicleDto): Promise<Vehicle>;

  updateStock(id: string, quantity: number): Promise<Vehicle>;

  delete(id: string): Promise<Vehicle>;

  findDuplicate(
    make: string,
    model: string,
    year: number,
  ): Promise<Vehicle | null>;
}
