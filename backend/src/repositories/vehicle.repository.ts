import { Vehicle } from "@prisma/client";
import { prisma } from "../config/prisma";
import { IVehicleRepository } from "./interfaces/vehicle.repository.interface";
import {
  CreateVehicleDto,
  SearchVehicleDto,
  UpdateVehicleDto,
} from "../types/vehicle.types";

export class VehicleRepository implements IVehicleRepository {
  async create(data: CreateVehicleDto): Promise<Vehicle> {
    return prisma.vehicle.create({
      data,
    });
  }

  async findAll(): Promise<Vehicle[]> {
    return prisma.vehicle.findMany({
      orderBy: {
        make: "asc",
      },
    });
  }

  async search(query: SearchVehicleDto): Promise<Vehicle[]> {
    return prisma.vehicle.findMany({
      where: {
        make: query.make
          ? {
              contains: query.make,
              mode: "insensitive",
            }
          : undefined,
        model: query.model
          ? {
              contains: query.model,
              mode: "insensitive",
            }
          : undefined,
        category: query.category,
        price:
          query.minPrice !== undefined || query.maxPrice !== undefined
            ? {
                gte: query.minPrice,
                lte: query.maxPrice,
              }
            : undefined,
      },
      orderBy: {
        make: "asc",
      },
    });
  }

  async findById(id: string): Promise<Vehicle | null> {
    return prisma.vehicle.findUnique({
      where: { id },
    });
  }

  async findDuplicate(
    make: string,
    model: string,
    year: number,
  ): Promise<Vehicle | null> {
    return prisma.vehicle.findFirst({
      where: {
        make: {
          equals: make,
          mode: "insensitive",
        },
        model: {
          equals: model,
          mode: "insensitive",
        },
        year,
      },
    });
  }

  async update(id: string, data: UpdateVehicleDto): Promise<Vehicle> {
    return prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  async updateStock(id: string, quantity: number): Promise<Vehicle> {
    return prisma.vehicle.update({
      where: { id },
      data: {
        quantity,
      },
    });
  }

  async incrementStock(id: string, quantity: number): Promise<Vehicle> {
    return prisma.vehicle.update({
      where: { id },
      data: {
        quantity: {
          increment: quantity,
        },
      },
    });
  }

  async delete(id: string): Promise<Vehicle> {
    return prisma.vehicle.delete({
      where: { id },
    });
  }
}

export const vehicleRepository = new VehicleRepository();
