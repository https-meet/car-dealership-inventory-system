import { z } from "zod";

export const createPurchaseSchema = z.object({
    vehicleId: z
        .string()
        .uuid("Invalid vehicle ID"),

    quantity: z
        .number()
        .int("Quantity must be an integer")
        .positive("Quantity must be greater than zero"),
});