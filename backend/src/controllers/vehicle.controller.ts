import { Request, Response, NextFunction } from "express";
import { vehicleService } from "../services/vehicle.service";
import { SearchVehicleDto } from "../types/vehicle.types";

class VehicleController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.create(req.body);

      res.status(201).json({
        success: true,
        message: "Vehicle created successfully.",
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicles = await vehicleService.getAll();

      res.status(200).json({
        success: true,
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicles = await vehicleService.search(
        res.locals.validatedQuery as SearchVehicleDto,
      );

      res.status(200).json({
        success: true,
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
     req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
  ): Promise<void> {
    try {
      const vehicle = await vehicleService.getById(req.params.id);

      res.status(200).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,): Promise<void> {
    try {
      const vehicle = await vehicleService.update(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully.",
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,): Promise<void> {
    try {
      await vehicleService.delete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  async restock(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vehicle = await vehicleService.restock(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: "Vehicle restocked successfully.",
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const vehicleController = new VehicleController();
