import { Router } from "express";
import { Role } from "@prisma/client";

import { vehicleController } from "../controllers/vehicle.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import {
    createVehicleSchema,
    updateVehicleSchema,
} from "../validators/vehicle.validator";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize(Role.ADMIN),
    validate(createVehicleSchema),
    vehicleController.create
);

router.get("/", vehicleController.getAll);

router.get("/:id", vehicleController.getById);

router.put(
    "/:id",
    authenticate,
    authorize(Role.ADMIN),
    validate(updateVehicleSchema),
    vehicleController.update
);

router.delete(
    "/:id",
    authenticate,
    authorize(Role.ADMIN),
    vehicleController.delete
);

export default router;