import { Vehicle } from "@prisma/client";
import { prisma } from "../config/prisma";
import { IVehicleRepository } from "./interfaces/vehicle.repository.interface";
import {
    CreateVehicleDto,
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
                createdAt: "desc",
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
    year: number
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

    async update(
        id: string,
        data: UpdateVehicleDto
    ): Promise<Vehicle> {
        return prisma.vehicle.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<Vehicle> {
        return prisma.vehicle.delete({
            where: { id },
        });
    }

    
}

export const vehicleRepository = new VehicleRepository();