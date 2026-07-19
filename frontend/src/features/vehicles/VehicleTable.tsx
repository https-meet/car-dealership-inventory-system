import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Pencil, Trash2, ShoppingCart } from "lucide-react";
import type { Vehicle } from "../../types/vehicle";
import StockBadge from "../../components/ui/Badge";
import { deleteVehicle } from "../../services/vehicle.service";

interface Props {
  vehicles: Vehicle[];
  onEdit?: (vehicle: Vehicle) => void;   // ADMIN only
  onBuy?: (vehicle: Vehicle) => void;    // CUSTOMER only
}

export default function VehicleTable({ vehicles, onEdit, onBuy }: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      toast.success("Vehicle deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: () => {
      toast.error("Failed to delete vehicle");
    },
  });

  const handleDelete = (vehicle: Vehicle) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`
      )
    ) {
      deleteMutation.mutate(vehicle.id);
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center text-slate-400">
        No vehicles found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3">Make / Model</th>
            <th className="px-5 py-3">Category</th>
            <th className="px-5 py-3">Year</th>
            <th className="px-5 py-3">Price</th>
            <th className="px-5 py-3">Qty</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {vehicles.map((vehicle) => (
            <tr
              key={vehicle.id}
              className="group hover:bg-slate-50 transition-colors"
            >
              <td className="px-5 py-4">
                <p className="font-medium text-slate-800">{vehicle.make}</p>
                <p className="text-xs text-slate-400">{vehicle.model}</p>
              </td>
              <td className="px-5 py-4 text-slate-600">
                {vehicle.category.charAt(0) + vehicle.category.slice(1).toLowerCase()}
              </td>
              <td className="px-5 py-4 text-slate-600">{vehicle.year}</td>
              <td className="px-5 py-4 font-medium text-slate-700">
                ₹{Number(vehicle.price).toLocaleString("en-IN")}
              </td>
              <td className="px-5 py-4 text-slate-600">{vehicle.quantity}</td>
              <td className="px-5 py-4">
                <StockBadge quantity={vehicle.quantity} />
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center justify-center gap-2">
                  {/* ADMIN actions */}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(vehicle)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit vehicle"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                  )}

                  {onEdit && (
                    <button
                      onClick={() => handleDelete(vehicle)}
                      disabled={deleteMutation.isPending}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Delete vehicle"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}

                  {/* CUSTOMER action */}
                  {onBuy && (
                    <button
                      onClick={() => onBuy(vehicle)}
                      disabled={vehicle.quantity === 0}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      title={vehicle.quantity === 0 ? "Out of stock" : "Buy this vehicle"}
                    >
                      <ShoppingCart size={14} />
                      {vehicle.quantity === 0 ? "Sold Out" : "Buy"}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}