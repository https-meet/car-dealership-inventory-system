import { VehicleCategory } from "@prisma/client";
import { z } from "zod";

const optionalText = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().min(1).optional(),
);

const optionalPrice = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.number().min(0).optional(),
);

export const createVehicleSchema = z.object({
    make: z.string().trim().min(1, "Make is required"),

    model: z.string().trim().min(1, "Model is required"),

    category: z.nativeEnum(VehicleCategory),

    year: z.coerce.number().int(),

    price: z.coerce.number().positive(),

    quantity: z.coerce.number().int().min(0),

    imageUrl: z.string().url().optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const vehicleIdParamsSchema = z.object({
  id: z.string().uuid("Invalid vehicle ID"),
});

export const searchVehicleSchema = z
  .object({
    make: optionalText,
    model: optionalText,
    category: z.nativeEnum(VehicleCategory).optional(),
    minPrice: optionalPrice,
    maxPrice: optionalPrice,
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message: "minPrice cannot be greater than maxPrice",
      path: ["minPrice"],
    },
  );

export const restockVehicleSchema = z.object({
  quantity: z
    .coerce.number()
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than zero"),
});
