import { Purchase } from "@prisma/client";
import { prisma } from "../config/prisma";
import { vehicleRepository } from "../repositories/vehicle.repository";
import { CreatePurchaseDto } from "../types/purchase.types";
import { AppError } from "../utils/app-error";
import { Role } from "@prisma/client";
import { purchaseRepository } from "../repositories/purchase.repository";

class PurchaseService {
  async purchaseVehicle(
    userId: string,
    data: CreatePurchaseDto,
  ): Promise<Purchase> {
    // Business Rule 1: Vehicle must exist
    const vehicle = await vehicleRepository.findById(data.vehicleId);

    if (!vehicle) {
      throw new AppError(404, "Vehicle not found.");
    }

    // Business Rule 2: Quantity must be greater than 0
    if (data.quantity <= 0) {
      throw new AppError(400, "Quantity must be greater than zero.");
    }

    // Business Rule 3: Enough stock must be available
    if (vehicle.quantity < data.quantity) {
      throw new AppError(400, "Requested quantity exceeds available stock.");
    }

    const remainingStock = vehicle.quantity - data.quantity;

    // Business Rule 4:
    // Create purchase and update stock atomically
    const purchase = await prisma.$transaction(async (tx) => {
      const createdPurchase = await tx.purchase.create({
        data: {
          userId,
          vehicleId: data.vehicleId,
          quantity: data.quantity,
        },
      });

      await tx.vehicle.update({
        where: {
          id: data.vehicleId,
        },
        data: {
          quantity: remainingStock,
        },
      });

      return createdPurchase;
    });

    return purchase;
  }

  async getPurchases(userId: string, role: Role): Promise<Purchase[]> {
    if (role === Role.ADMIN) {
      return purchaseRepository.findAll();
    }

    return purchaseRepository.findByUserId(userId);
  }
}

export const purchaseService = new PurchaseService();
