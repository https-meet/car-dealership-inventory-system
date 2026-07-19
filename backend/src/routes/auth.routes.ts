import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const router = Router();

// POST /api/auth/register
router.post(
    "/register",
    validate(registerSchema),
    register
);
router.post("/login", validate(loginSchema), login);

export default router;
