import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CarFront, ShoppingCart } from "lucide-react";
import Modal from "../../components/ui/Modal";
import { createPurchase } from "../../services/purchase.service";
import type { Vehicle } from "../../types/vehicle";
import { formatCurrency } from "../../utils/format";

interface PurchaseVehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

function apiErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    return response?.data?.message ?? fallback;
  }

  return fallback;
}

export default function PurchaseVehicleModal({
  vehicle,
  onClose,
}: PurchaseVehicleModalProps) {
  const queryClient = useQueryClient();
  const [quantityValue, setQuantityValue] = useState("1");
  const [quantityError, setQuantityError] = useState("");

  const quantity = Number(quantityValue || 0);
  const unitPrice = vehicle ? Number(vehicle.price) : 0;
  const estimatedTotal = unitPrice * (Number.isNaN(quantity) ? 0 : quantity);

  const mutation = useMutation({
    mutationFn: (quantityToBuy: number) =>
      createPurchase({ vehicleId: vehicle!.id, quantity: quantityToBuy }),
    onSuccess: () => {
      toast.success("Purchase successful");
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      setQuantityValue("1");
      setQuantityError("");
      onClose();
    },
    onError: (error: unknown) => {
      toast.error(apiErrorMessage(error, "Purchase failed."));
    },
  });

  const handleClose = () => {
    setQuantityValue("1");
    setQuantityError("");
    onClose();
  };

  const submitPurchase = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!vehicle) return;

    if (!Number.isInteger(quantity) || quantity < 1) {
      setQuantityError("Use a whole number of at least 1");
      return;
    }

    if (quantity > vehicle.quantity) {
      setQuantityError(`Only ${vehicle.quantity} available`);
      return;
    }

    setQuantityError("");
    mutation.mutate(quantity);
  };

  return (
    <Modal isOpen={vehicle !== null} onClose={handleClose} title="Complete purchase">
      {vehicle && (
        <div className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex gap-3">
              {vehicle.imageUrl ? (
                <img
                  src={vehicle.imageUrl}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="h-20 w-28 shrink-0 rounded-lg border border-slate-200 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-300">
                  <CarFront size={30} />
                </div>
              )}
              <div className="min-w-0">
                <h4 className="truncate text-base font-bold text-slate-950">
                  {vehicle.make} {vehicle.model}
                </h4>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  {formatCurrency(unitPrice)} per unit
                </p>
                <p className="mt-2 text-xs font-semibold text-teal-800">
                  {vehicle.quantity} available
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={submitPurchase} className="space-y-4" noValidate>
            <div>
              <label className="label">Quantity</label>
              <input
                type="number"
                min={1}
                max={vehicle.quantity}
                value={quantityValue}
                onChange={(event) => setQuantityValue(event.target.value)}
                className="field"
              />
              {quantityError && (
                <p className="mt-1.5 text-xs font-medium text-rose-600">
                  {quantityError}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-600">Estimated total</span>
                <span className="text-xl font-bold text-slate-950">
                  {formatCurrency(estimatedTotal)}
                </span>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
              <button type="button" onClick={handleClose} className="btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || vehicle.quantity === 0}
                className="btn-primary"
              >
                <ShoppingCart size={16} />
                {mutation.isPending ? "Processing..." : "Confirm purchase"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
