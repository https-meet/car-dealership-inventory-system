import { Purchase, Role } from "@prisma/client";
import { prisma } from "../config/prisma";
import { CreatePurchaseDto } from "../types/purchase.types";
import { AppError } from "../utils/app-error";
import { purchaseRepository } from "../repositories/purchase.repository";

class PurchaseService {
  async purchaseVehicle(
    userId: string,
    data: CreatePurchaseDto,
  ): Promise<Purchase> {
    if (data.quantity <= 0) {
      throw new AppError(400, "Quantity must be greater than zero.");
    }

    return prisma.$transaction(async (tx) => {
      const stockUpdate = await tx.vehicle.updateMany({
        where: {
          id: data.vehicleId,
          quantity: {
            gte: data.quantity,
          },
        },
        data: {
          quantity: {
            decrement: data.quantity,
          },
        },
      });

      if (stockUpdate.count === 0) {
        const vehicle = await tx.vehicle.findUnique({
          where: { id: data.vehicleId },
        });

        if (!vehicle) {
          throw new AppError(404, "Vehicle not found.");
        }

        throw new AppError(400, "Requested quantity exceeds available stock.");
      }

      return tx.purchase.create({
        data: {
          userId,
          vehicleId: data.vehicleId,
          quantity: data.quantity,
        },
      });
    });
  }

  async getPurchases(userId: string, role: Role): Promise<Purchase[]> {
    if (role === Role.ADMIN) {
      return purchaseRepository.findAll();
    }

    return purchaseRepository.findByUserId(userId);
  }
}

export const purchaseService = new PurchaseService();
