import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CarFront, Pencil, ShoppingCart, Trash2 } from "lucide-react";
import type { Vehicle } from "../../types/vehicle";
import { deleteVehicle } from "../../services/vehicle.service";
import { formatCurrency, titleCase } from "../../utils/format";

interface Props {
  vehicles: Vehicle[];
  onEdit?: (vehicle: Vehicle) => void;
  onBuy?: (vehicle: Vehicle) => void;
}

function stockDot(quantity: number) {
  if (quantity === 0) return "bg-rose-500";
  if (quantity <= 3) return "bg-amber-500";
  return "bg-teal-500";
}

export default function VehicleTable({ vehicles, onEdit, onBuy }: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      toast.success("Vehicle removed from inventory");
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: () => {
      toast.error("Failed to remove vehicle.");
    },
  });

  const handleDelete = (vehicle: Vehicle) => {
    if (window.confirm(`Remove ${vehicle.make} ${vehicle.model} from inventory?`)) {
      deleteMutation.mutate(vehicle.id);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:hidden">
        {vehicles.map((vehicle) => {
          const isOutOfStock = vehicle.quantity === 0;

          return (
            <article key={vehicle.id} className="surface p-4">
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
                  <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-300">
                    <CarFront size={28} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-slate-950">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {titleCase(vehicle.category)} - {vehicle.year}
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-950">
                    {formatCurrency(vehicle.price)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span className={`status-dot ${stockDot(vehicle.quantity)}`} />
                  {vehicle.quantity} in stock
                </div>

                <div className="flex items-center gap-2">
                  {onEdit && (
                    <>
                      <button
                        onClick={() => onEdit(vehicle)}
                        className="icon-button"
                        aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle)}
                        disabled={deleteMutation.isPending}
                        className="icon-button hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                        aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}

                  {onBuy && (
                    <button
                      onClick={() => onBuy(vehicle)}
                      disabled={isOutOfStock}
                      className="btn-primary px-3 py-2 text-xs"
                    >
                      <ShoppingCart size={14} />
                      {isOutOfStock ? "Sold out" : "Buy"}
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="surface hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-5 py-3">Vehicle</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Year</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map((vehicle) => {
                const isOutOfStock = vehicle.quantity === 0;

                return (
                  <tr key={vehicle.id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {vehicle.imageUrl ? (
                          <img
                            src={vehicle.imageUrl}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="h-11 w-16 rounded-lg border border-slate-200 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-11 w-16 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-300">
                            <CarFront size={22} />
                          </div>
                        )}
                        <p className="font-bold text-slate-950">
                          {vehicle.make} {vehicle.model}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-600">
                      {titleCase(vehicle.category)}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-600">
                      {vehicle.year}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {formatCurrency(vehicle.price)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 font-semibold text-slate-700">
                        <span className={`status-dot ${stockDot(vehicle.quantity)}`} />
                        {vehicle.quantity}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <>
                            <button
                              onClick={() => onEdit(vehicle)}
                              className="icon-button"
                              aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(vehicle)}
                              disabled={deleteMutation.isPending}
                              className="icon-button hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                              aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                        {onBuy && (
                          <button
                            onClick={() => onBuy(vehicle)}
                            disabled={isOutOfStock}
                            className="btn-primary px-3 py-2 text-xs"
                          >
                            <ShoppingCart size={14} />
                            {isOutOfStock ? "Sold out" : "Buy"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
