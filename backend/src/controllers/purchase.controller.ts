import { NextFunction, Request, Response } from "express";
import { purchaseService } from "../services/purchase.service";
import { AppError } from "../utils/app-error";

class PurchaseController {
  async purchase(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, "Unauthorized");
      }

      const purchase = await purchaseService.purchaseVehicle(
        req.user.id,
        req.body,
      );

      res.status(201).json({
        success: true,
        message: "Vehicle purchased successfully.",
        data: purchase,
      });
    } catch (error) {
      next(error);
    }
  }

  async purchaseVehicleById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, "Unauthorized");
      }

      const purchase = await purchaseService.purchaseVehicle(req.user.id, {
        vehicleId: req.params.id,
        quantity: req.body.quantity,
      });

      res.status(201).json({
        success: true,
        message: "Vehicle purchased successfully.",
        data: purchase,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPurchases(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(401, "Unauthorized");
      }

      const purchases = await purchaseService.getPurchases(
        req.user.id,
        req.user.role,
      );

      res.status(200).json({
        success: true,
        message: "Purchases fetched successfully.",
        data: purchases,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const purchaseController = new PurchaseController();
