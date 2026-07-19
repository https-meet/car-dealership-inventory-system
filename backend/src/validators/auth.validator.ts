import { Role } from "@prisma/client";
import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Password is required"),
});
