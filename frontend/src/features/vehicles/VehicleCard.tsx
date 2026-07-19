import { CarFront, ShoppingCart } from "lucide-react";
import type { Vehicle } from "../../types/vehicle";
import { formatCurrency, titleCase } from "../../utils/format";

interface Props {
  vehicle: Vehicle;
  onBuy: (vehicle: Vehicle) => void;
}

function stockLabel(quantity: number) {
  if (quantity === 0) return "Out of stock";
  if (quantity <= 3) return `${quantity} left`;
  return "In stock";
}

function stockTone(quantity: number) {
  if (quantity === 0) return "bg-rose-500";
  if (quantity <= 3) return "bg-amber-500";
  return "bg-teal-500";
}

export default function VehicleCard({ vehicle, onBuy }: Props) {
  const isOutOfStock = vehicle.quantity === 0;

  return (
    <article className="surface group flex min-h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {vehicle.imageUrl ? (
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <CarFront size={42} />
          </div>
        )}

        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">
          {titleCase(vehicle.category)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-slate-950">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Model year {vehicle.year}
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
            <span className={`status-dot ${stockTone(vehicle.quantity)}`} />
            {stockLabel(vehicle.quantity)}
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Price
            </p>
            <p className="mt-1 text-lg font-bold tracking-tight text-slate-950">
              {formatCurrency(vehicle.price)}
            </p>
          </div>

          <button
            onClick={() => onBuy(vehicle)}
            disabled={isOutOfStock}
            className="btn-primary px-3 py-2 text-xs"
          >
            <ShoppingCart size={14} />
            {isOutOfStock ? "Sold out" : "Buy"}
          </button>
        </div>
      </div>
    </article>
  );
}
