import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVehicle, updateVehicle } from "../../services/vehicle.service";
import type { Vehicle } from "../../types/vehicle";

// Mirror the backend VehicleCategory enum exactly
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
    .min(1900, "Year must be ≥ 1900")
    .max(new Date().getFullYear() + 1, "Year is too far in the future"),
  price: z.coerce.number({ error: "Price is required" }).positive("Price must be positive"),
  quantity: z.coerce.number({ error: "Quantity is required" }).int().min(0, "Quantity cannot be negative"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

interface VehicleFormProps {
  /** When provided the form is in edit mode */
  vehicle?: Vehicle;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function VehicleForm({ vehicle, onSuccess, onCancel }: VehicleFormProps) {
  const isEdit = Boolean(vehicle);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
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
    // Strip empty imageUrl so the API receives undefined, not an empty string
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

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors";

  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Row 1: Make + Model */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Make <span className="text-red-400">*</span>
          </label>
          <input
            {...register("make")}
            placeholder="e.g. Toyota"
            className={inputClass}
          />
          {errors.make && <p className={errorClass}>{errors.make.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Model <span className="text-red-400">*</span>
          </label>
          <input
            {...register("model")}
            placeholder="e.g. Camry"
            className={inputClass}
          />
          {errors.model && <p className={errorClass}>{errors.model.message}</p>}
        </div>
      </div>

      {/* Row 2: Category + Year */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Category <span className="text-red-400">*</span>
          </label>
          <select {...register("category")} className={inputClass}>
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
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Year <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            {...register("year")}
            placeholder="e.g. 2024"
            className={inputClass}
          />
          {errors.year && <p className={errorClass}>{errors.year.message}</p>}
        </div>
      </div>

      {/* Row 3: Price + Quantity */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Price (₹) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price")}
            placeholder="e.g. 1500000"
            className={inputClass}
          />
          {errors.price && <p className={errorClass}>{errors.price.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Quantity <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            {...register("quantity")}
            placeholder="e.g. 10"
            className={inputClass}
          />
          {errors.quantity && (
            <p className={errorClass}>{errors.quantity.message}</p>
          )}
        </div>
      </div>

      {/* Row 4: Image URL */}
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Image URL <span className="text-slate-400">(optional)</span>
        </label>
        <input
          {...register("imageUrl")}
          placeholder="https://example.com/car.jpg"
          className={inputClass}
        />
        {errors.imageUrl && (
          <p className={errorClass}>{errors.imageUrl.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isPending
            ? isEdit
              ? "Saving..."
              : "Adding..."
            : isEdit
            ? "Save Changes"
            : "Add Vehicle"}
        </button>
      </div>
    </form>
  );
}