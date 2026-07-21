import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CarFront, Pencil, ShoppingCart, Trash2 } from "lucide-react";
import type { Vehicle } from "../../types/vehicle";
import { deleteVehicle } from "../../services/vehicle.service";
import { formatCurrency, titleCase } from "../../utils/format";

interface Props {
  vehicles: Vehicle[];
  onEdit?: (v: Vehicle) => void;
  onBuy?:  (v: Vehicle) => void;
}

function StockBadge({ qty }: { qty: number }) {
  if (qty === 0) return <span className="badge-red">Out of stock</span>;
  if (qty <= 3)  return <span className="badge-amber">{qty} — Low</span>;
  return <span className="badge-green">{qty} in stock</span>;
}

export default function VehicleTable({ vehicles, onEdit, onBuy }: Props) {
  const qc = useQueryClient();

  const del = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => { toast.success("Vehicle removed"); qc.invalidateQueries({ queryKey: ["vehicles"] }); },
    onError:   () => toast.error("Failed to remove vehicle."),
  });

  const confirmDelete = (v: Vehicle) => {
    if (window.confirm(`Remove ${v.make} ${v.model} from inventory?`)) del.mutate(v.id);
  };

  return (
    <div className="space-y-3">
      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {vehicles.map((v) => (
          <div key={v.id} className="card p-4">
            <div className="flex gap-3">
              {v.imageUrl ? (
                <img src={v.imageUrl} alt={`${v.make} ${v.model}`}
                  className="h-20 w-28 shrink-0 rounded-xl object-cover border border-slate-100"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-300">
                  <CarFront size={26} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 truncate">{v.make} {v.model}</p>
                <p className="text-xs text-slate-500 mt-0.5">{titleCase(v.category)} · {v.year}</p>
                <p className="text-sm font-bold text-slate-900 mt-2">{formatCurrency(v.price)}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <StockBadge qty={v.quantity} />
              <div className="flex gap-2">
                {onEdit && (
                  <>
                    <button onClick={() => onEdit(v)} className="icon-btn" aria-label="Edit"><Pencil size={14} /></button>
                    <button onClick={() => confirmDelete(v)} disabled={del.isPending}
                      className="icon-btn hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 size={14} /></button>
                  </>
                )}
                {onBuy && (
                  <button onClick={() => onBuy(v)} disabled={v.quantity === 0} className="btn-primary px-3 py-1.5 text-xs">
                    <ShoppingCart size={13} /> {v.quantity === 0 ? "Out of stock" : "Purchase"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/70">
              <tr>
                {["Vehicle", "Category", "Year", "Price", "Stock", "Actions"].map(h => (
                  <th key={h} className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${h === "Actions" ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {v.imageUrl ? (
                        <img src={v.imageUrl} alt={`${v.make} ${v.model}`}
                          className="h-10 w-14 shrink-0 rounded-lg object-cover border border-slate-100"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-300">
                          <CarFront size={18} />
                        </div>
                      )}
                      <span className="font-semibold text-slate-900">{v.make} {v.model}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{titleCase(v.category)}</td>
                  <td className="px-5 py-3.5 text-slate-600">{v.year}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{formatCurrency(v.price)}</td>
                  <td className="px-5 py-3.5"><StockBadge qty={v.quantity} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      {onEdit && (
                        <>
                          <button onClick={() => onEdit(v)} className="icon-btn" aria-label="Edit"><Pencil size={14} /></button>
                          <button onClick={() => confirmDelete(v)} disabled={del.isPending}
                            className="icon-btn hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 size={14} /></button>
                        </>
                      )}
                      {onBuy && (
                        <button onClick={() => onBuy(v)} disabled={v.quantity === 0} className="btn-primary px-3 py-1.5 text-xs">
                          <ShoppingCart size={13} /> {v.quantity === 0 ? "Sold out" : "Purchase"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
