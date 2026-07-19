import { prisma } from "../config/prisma";
import { Role } from "@prisma/client";

class DashboardService {
  async getDashboardStats() {
    const [
      totalVehicles,
      totalCustomers,
      totalPurchases,
      availableVehicles,
      outOfStockVehicles,
    ] = await Promise.all([
      prisma.vehicle.count(),

      prisma.user.count({
        where: {
          role: Role.CUSTOMER,
        },
      }),

      prisma.purchase.count(),

      prisma.vehicle.count({
        where: {
          quantity: {
            gt: 0,
          },
        },
      }),

      prisma.vehicle.count({
        where: {
          quantity: 0,
        },
      }),
    ]);

    return {
      totalVehicles,
      totalCustomers,
      totalPurchases,
      availableVehicles,
      outOfStockVehicles,
    };
  }
}

export const dashboardService = new DashboardService();