import { Request, Response, NextFunction } from "express";
import { reportService } from "../services/report.service";

class ReportController {
  async getLowStockVehicles(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const threshold = req.query.threshold
        ? Number(req.query.threshold)
        : 5;

      const vehicles = await reportService.getLowStockVehicles(threshold);

      res.status(200).json({
        success: true,
        message: "Low stock vehicles fetched successfully.",
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecentPurchases(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const limit = req.query.limit
        ? Number(req.query.limit)
        : 10;

      const purchases = await reportService.getRecentPurchases(limit);

      res.status(200).json({
        success: true,
        message: "Recent purchases fetched successfully.",
        data: purchases,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTopSellingVehicles(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const limit = req.query.limit
        ? Number(req.query.limit)
        : 10;

      const report = await reportService.getTopSellingVehicles(limit);

      res.status(200).json({
        success: true,
        message: "Top selling vehicles fetched successfully.",
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSalesSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const summary = await reportService.getSalesSummary();

      res.status(200).json({
        success: true,
        message: "Sales summary fetched successfully.",
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();