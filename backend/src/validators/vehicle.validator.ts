import { VehicleCategory } from "@prisma/client";
import { z } from "zod";

export const createVehicleSchema = z.object({
    make: z.string().trim().min(1, "Make is required"),

    model: z.string().trim().min(1, "Model is required"),

    category: z.nativeEnum(VehicleCategory),

    year: z.number().int(),

    price: z.number().positive(),

    quantity: z.number().int().min(0),

    imageUrl: z.string().url().optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();