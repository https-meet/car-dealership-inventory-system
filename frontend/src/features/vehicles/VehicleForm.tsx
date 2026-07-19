import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVehicle, updateVehicle } from "../../services/vehicle.service";
import type { Vehicle } from "../../types/vehicle";

const VEHICLE_CATEGORIES = [
  "SEDAN",
  "SUV",
  "HATCHBACK",
  "TRUCK",
  "COUPE",
  "CONVERTIBLE",
  "ELECTRIC",
] as const;

const schema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  category: z.enum(VEHICLE_CATEGORIES, { error: "Please select a category" }),
  year: z.coerce
    .number({ error: "Year is required" })
    .int()
    .min(1900, "Year must be >= 1900")
    .max(new Date().getFullYear() + 1, "Year is too far in the future"),
  price: z.coerce
    .number({ error: "Price is required" })
    .positive("Price must be positive"),
  quantity: z.coerce
    .number({ error: "Quantity is required" })
    .int()
    .min(0, "Quantity cannot be negative"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function VehicleForm({
  vehicle,
  onSuccess,
  onCancel,
}: VehicleFormProps) {
  const isEdit = Boolean(vehicle);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(schema),
    defaultValues: vehicle
      ? {
          make: vehicle.make,
          model: vehicle.model,
          category: vehicle.category as (typeof VEHICLE_CATEGORIES)[number],
          year: vehicle.year,
          price: vehicle.price,
          quantity: vehicle.quantity,
          imageUrl: vehicle.imageUrl ?? "",
        }
      : undefined,
  });

  const createMutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      toast.success("Vehicle added successfully");
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      reset();
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to add vehicle");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Omit<Vehicle, "id">>) =>
      updateVehicle(vehicle!.id, data),
    onSuccess: () => {
      toast.success("Vehicle updated successfully");
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to update vehicle");
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      imageUrl: data.imageUrl || undefined,
    };

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const errorClass = "mt-1.5 text-xs font-medium text-rose-600";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Make</label>
          <input {...register("make")} placeholder="Toyota" className="field" />
          {errors.make && <p className={errorClass}>{errors.make.message}</p>}
        </div>

        <div>
          <label className="label">Model</label>
          <input {...register("model")} placeholder="Camry" className="field" />
          {errors.model && <p className={errorClass}>{errors.model.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Category</label>
          <select {...register("category")} className="field">
            <option value="">Select category</option>
            {VEHICLE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className={errorClass}>{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="label">Year</label>
          <input
            type="number"
            {...register("year")}
            placeholder="2026"
            className="field"
          />
          {errors.year && <p className={errorClass}>{errors.year.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price")}
            placeholder="1500000"
            className="field"
          />
          {errors.price && <p className={errorClass}>{errors.price.message}</p>}
        </div>

        <div>
          <label className="label">Quantity</label>
          <input
            type="number"
            {...register("quantity")}
            placeholder="10"
            className="field"
          />
          {errors.quantity && (
            <p className={errorClass}>{errors.quantity.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="label">Image URL</label>
        <input
          {...register("imageUrl")}
          placeholder="https://example.com/car.jpg"
          className="field"
        />
        {errors.imageUrl && (
          <p className={errorClass}>{errors.imageUrl.message}</p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending
            ? isEdit
              ? "Saving..."
              : "Adding..."
            : isEdit
            ? "Save changes"
            : "Add vehicle"}
        </button>
      </div>
    </form>
  );
}
