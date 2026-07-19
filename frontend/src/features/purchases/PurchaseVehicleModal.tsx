import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import Modal from "../../components/ui/Modal";
import { createPurchase } from "../../services/purchase.service";
import type { Vehicle } from "../../types/vehicle";

const schema = z.object({
  quantity: z.coerce
    .number({ error: "Quantity is required" })
    .int("Must be a whole number")
    .min(1, "At least 1 unit required"),
});

type FormData = z.infer<typeof schema>;

interface PurchaseVehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export default function PurchaseVehicleModal({
  vehicle,
  onClose,
}: PurchaseVehicleModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1 },
  });

  const quantity = watch("quantity") || 1;
  const unitPrice = vehicle ? Number(vehicle.price) : 0;
  const estimatedTotal = unitPrice * (isNaN(quantity) ? 0 : quantity);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      createPurchase({ vehicleId: vehicle!.id, quantity: data.quantity }),
    onSuccess: () => {
      toast.success("Purchase successful! 🎉");
      // Invalidate both purchases and vehicles (stock decreases)
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      reset();
      onClose();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const msg =
        error?.response?.data?.message ?? "Purchase failed. Please try again.";
      toast.error(msg);
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors";

  return (
    <Modal isOpen={vehicle !== null} onClose={handleClose} title="Purchase Vehicle">
      {vehicle && (
        <div className="space-y-5">
          {/* Vehicle summary card */}
          <div className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            {vehicle.imageUrl ? (
              <img
                src={vehicle.imageUrl}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="h-20 w-28 rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-20 w-28 items-center justify-center rounded-lg bg-slate-200 text-slate-400">
                <ShoppingCart size={24} />
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-slate-800">
                {vehicle.make} {vehicle.model}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {vehicle.year} ·{" "}
                {vehicle.category.charAt(0) +
                  vehicle.category.slice(1).toLowerCase()}
              </p>
              <p className="mt-2 text-lg font-bold text-blue-600">
                ₹{unitPrice.toLocaleString("en-IN")}
                <span className="ml-1 text-xs font-normal text-slate-400">
                  per unit
                </span>
              </p>
              <p className="text-xs text-slate-500">
                {vehicle.quantity > 0 ? (
                  <span className="text-emerald-600">
                    {vehicle.quantity} in stock
                  </span>
                ) : (
                  <span className="text-red-500">Out of stock</span>
                )}
              </p>
            </div>
          </div>

          {/* Purchase form */}
          <form
            onSubmit={handleSubmit((data) => mutation.mutate(data))}
            className="space-y-4"
            noValidate
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Quantity <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={vehicle.quantity}
                {...register("quantity")}
                className={inputClass}
              />
              {errors.quantity && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.quantity.message}
                </p>
              )}
              {vehicle.quantity > 0 && (
                <p className="mt-1 text-xs text-slate-400">
                  Max available: {vehicle.quantity}
                </p>
              )}
            </div>

            {/* Estimated total */}
            {estimatedTotal > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-600">
                  Estimated Total
                </span>
                <span className="text-lg font-bold text-blue-700">
                  ₹{estimatedTotal.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || vehicle.quantity === 0}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <ShoppingCart size={15} />
                {mutation.isPending ? "Processing…" : "Confirm Purchase"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
