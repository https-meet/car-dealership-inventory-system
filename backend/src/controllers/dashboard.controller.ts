import { Request, Response, NextFunction } from "express";
import { dashboardService } from "../services/dashboard.service";

class DashboardController {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await dashboardService.getDashboardStats();

      res.status(200).json({
        success: true,
        message: "Dashboard statistics fetched successfully.",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();