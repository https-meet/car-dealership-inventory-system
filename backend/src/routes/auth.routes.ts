import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { registerSchema } from "../validators/auth.validator";

const router = Router();

// POST /api/auth/register
router.post(
    "/register",
    validate(registerSchema),
    register
);
router.post("/login", login);

export default router;