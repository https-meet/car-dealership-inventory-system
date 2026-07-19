import { Vehicle } from "@prisma/client";
import { vehicleRepository } from "../repositories/vehicle.repository";
import {
  CreateVehicleDto,
  RestockVehicleDto,
  SearchVehicleDto,
  UpdateVehicleDto,
} from "../types/vehicle.types";
import { AppError } from "../utils/app-error";

class VehicleService {
  async create(data: CreateVehicleDto): Promise<Vehicle> {
    // Business Rule 1: Price must be greater than 0
    if (Number(data.price) <= 0) {
      throw new AppError(400, "Vehicle price must be greater than 0.");
    }

    // Business Rule 2: Quantity cannot be negative
    if (data.quantity < 0) {
      throw new AppError(400, "Vehicle quantity cannot be negative.");
    }

    // Business Rule 3: Manufacturing year validation
    const currentYear = new Date().getFullYear() + 1;

    if (data.year < 1900 || data.year > currentYear) {
      throw new AppError(400, "Invalid manufacturing year.");
    }

    // Business Rule 4: Duplicate vehicle check
    const duplicate = await vehicleRepository.findDuplicate(
      data.make,
      data.model,
      data.year,
    );

    if (duplicate) {
      throw new AppError(409, "Vehicle already exists.");
    }

    return vehicleRepository.create(data);
  }

  async getAll() {
    return vehicleRepository.findAll();
  }

  async search(query: SearchVehicleDto) {
    return vehicleRepository.search(query);
  }

  async getById(id: string) {
    const vehicle = await vehicleRepository.findById(id);

    if (!vehicle) {
      throw new AppError(404, "Vehicle not found.");
    }

    return vehicle;
  }

  async update(id: string, data: UpdateVehicleDto) {
    const vehicle = await vehicleRepository.findById(id);

    if (!vehicle) {
      throw new AppError(404, "Vehicle not found.");
    }

    if (data.price !== undefined && Number(data.price) <= 0) {
      throw new AppError(400, "Price must be greater than 0.");
    }

    if (data.quantity !== undefined && data.quantity < 0) {
      throw new AppError(400, "Quantity cannot be negative.");
    }

    if (
      data.year !== undefined &&
      (data.year < 1900 || data.year > new Date().getFullYear() + 1)
    ) {
      throw new AppError(400, "Invalid manufacturing year.");
    }

    return vehicleRepository.update(id, data);
  }

  async delete(id: string) {
    const vehicle = await vehicleRepository.findById(id);

    if (!vehicle) {
      throw new AppError(404, "Vehicle not found.");
    }

    await vehicleRepository.delete(id);
  }

  async restock(id: string, data: RestockVehicleDto) {
    const vehicle = await vehicleRepository.findById(id);

    if (!vehicle) {
      throw new AppError(404, "Vehicle not found.");
    }

    return vehicleRepository.incrementStock(id, data.quantity);
  }
}

export const vehicleService = new VehicleService();
