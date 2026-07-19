import { Router } from "express";
import { Role } from "@prisma/client";

import { vehicleController } from "../controllers/vehicle.controller";
import { purchaseController } from "../controllers/purchase.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
    validate,
    validateParams,
    validateQuery,
} from "../middleware/validation.middleware";
import { purchaseQuantitySchema } from "../validators/purchase.validator";
import {
    createVehicleSchema,
    restockVehicleSchema,
    searchVehicleSchema,
    updateVehicleSchema,
    vehicleIdParamsSchema,
} from "../validators/vehicle.validator";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize(Role.ADMIN),
    validate(createVehicleSchema),
    vehicleController.create
);

router.get("/", authenticate, vehicleController.getAll);

router.get(
    "/search",
    authenticate,
    validateQuery(searchVehicleSchema),
    vehicleController.search,
);

router.get(
    "/:id",
    authenticate,
    validateParams(vehicleIdParamsSchema),
    vehicleController.getById,
);

router.post(
    "/:id/purchase",
    authenticate,
    validateParams(vehicleIdParamsSchema),
    validate(purchaseQuantitySchema),
    purchaseController.purchaseVehicleById,
);

router.post(
    "/:id/restock",
    authenticate,
    authorize(Role.ADMIN),
    validateParams(vehicleIdParamsSchema),
    validate(restockVehicleSchema),
    vehicleController.restock,
);

router.put(
    "/:id",
    authenticate,
    authorize(Role.ADMIN),
    validateParams(vehicleIdParamsSchema),
    validate(updateVehicleSchema),
    vehicleController.update
);

router.delete(
    "/:id",
    authenticate,
    authorize(Role.ADMIN),
    validateParams(vehicleIdParamsSchema),
    vehicleController.delete
);

export default router;
