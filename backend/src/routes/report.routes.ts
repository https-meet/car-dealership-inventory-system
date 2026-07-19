import { Router } from "express";
import { Role } from "@prisma/client";

import { reportController } from "../controllers/report.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/low-stock",
  authenticate,
  authorize(Role.ADMIN),
  reportController.getLowStockVehicles
);

router.get(
  "/recent-purchases",
  authenticate,
  authorize(Role.ADMIN),
  reportController.getRecentPurchases
);

router.get(
  "/top-selling",
  authenticate,
  authorize(Role.ADMIN),
  reportController.getTopSellingVehicles
);

router.get(
  "/sales-summary",
  authenticate,
  authorize(Role.ADMIN),
  reportController.getSalesSummary
);

export default router;