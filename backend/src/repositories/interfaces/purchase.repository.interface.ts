import { Purchase } from "@prisma/client";

export interface CreatePurchaseRepositoryDto {
    userId: string;
    vehicleId: string;
    quantity: number;
}

export interface IPurchaseRepository {
    create(data: CreatePurchaseRepositoryDto): Promise<Purchase>;

    findAll(): Promise<Purchase[]>;

    findByUserId(userId: string): Promise<Purchase[]>;
}