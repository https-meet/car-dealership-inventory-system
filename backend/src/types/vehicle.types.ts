import { VehicleCategory, Prisma } from "@prisma/client";

export interface CreateVehicleDto {
    make: string;
    model: string;
    category: VehicleCategory;
    year: number;
    price: Prisma.Decimal | number;
    quantity: number;
    imageUrl?: string;
}

export interface UpdateVehicleDto {
    make?: string;
    model?: string;
    category?: VehicleCategory;
    year?: number;
    price?: Prisma.Decimal | number;
    quantity?: number;
    imageUrl?: string;
}