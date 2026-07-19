import { prisma } from "../config/prisma";

class ReportService {
  async getLowStockVehicles(threshold: number = 5) {
    return prisma.vehicle.findMany({
      where: {
        quantity: {
          lte: threshold,
        },
      },
      orderBy: {
        quantity: "asc",
      },
      select: {
        id: true,
        make: true,
        model: true,
        category: true,
        quantity: true,
        price: true,
      },
    });
  }

  async getRecentPurchases(limit: number = 10) {
    return prisma.purchase.findMany({
      take: limit,
      orderBy: {
        purchasedAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            category: true,
            price: true,
          },
        },
      },
    });
  }

  async getTopSellingVehicles(limit: number = 10) {
    const sales = await prisma.purchase.groupBy({
      by: ["vehicleId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });

    const vehicleIds = sales.map((sale) => sale.vehicleId);

    const vehicles = await prisma.vehicle.findMany({
      where: {
        id: {
          in: vehicleIds,
        },
      },
      select: {
        id: true,
        make: true,
        model: true,
        category: true,
        price: true,
      },
    });

    const vehicleMap = new Map(
      vehicles.map((vehicle) => [vehicle.id, vehicle]),
    );

    return sales.map((sale) => ({
      vehicle: vehicleMap.get(sale.vehicleId),
      totalSold: sale._sum.quantity ?? 0,
    }));
  }

  async getSalesSummary() {
    const purchases = await prisma.purchase.findMany({
      include: {
        vehicle: {
          select: {
            price: true,
          },
        },
      },
    });

    let totalRevenue = 0;
    let totalUnitsSold = 0;

    purchases.forEach((purchase) => {
      totalUnitsSold += purchase.quantity;
      totalRevenue += Number(purchase.vehicle.price) * purchase.quantity;
    });

    return {
      totalRevenue,
      totalUnitsSold,
      totalPurchases: purchases.length,
    };
  }
}

export const reportService = new ReportService();
