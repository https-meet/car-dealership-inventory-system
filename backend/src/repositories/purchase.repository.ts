import { Purchase } from "@prisma/client";
import { prisma } from "../config/prisma";
import {
    CreatePurchaseRepositoryDto,
    IPurchaseRepository,
} from "./interfaces/purchase.repository.interface";

export class PurchaseRepository implements IPurchaseRepository {
    async create(
        data: CreatePurchaseRepositoryDto
    ): Promise<Purchase> {
        return prisma.purchase.create({
            data,
        });
    }

    async findAll(): Promise<Purchase[]> {
        return prisma.purchase.findMany({
            orderBy: {
                purchasedAt: "desc",
            },
        });
    }

    async findByUserId(userId: string): Promise<Purchase[]> {
        return prisma.purchase.findMany({
            where: {
                userId,
            },
            orderBy: {
                purchasedAt: "desc",
            },
        });
    }
}

export const purchaseRepository = new PurchaseRepository();