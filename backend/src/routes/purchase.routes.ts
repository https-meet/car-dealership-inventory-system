import { Router } from "express";
import { purchaseController } from "../controllers/purchase.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { createPurchaseSchema } from "../validators/purchase.validator";

const router = Router();
console.log("✅ Purchase routes loaded");

router.post(
  "/",
  authenticate,
  validate(createPurchaseSchema),
  purchaseController.purchase,
);

router.get("/", authenticate, purchaseController.getPurchases);

export default router;