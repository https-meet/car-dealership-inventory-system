import { CarFront, ShoppingCart } from "lucide-react";
import type { Vehicle } from "../../types/vehicle";
import { formatCurrency, titleCase } from "../../utils/format";

interface Props { vehicle: Vehicle; onBuy: (v: Vehicle) => void; }

function stockLabel(q: number) {
  if (q === 0) return { text: "Out of stock", cls: "badge-red" };
  if (q <= 3)  return { text: `${q} remaining`, cls: "badge-amber" };
  return { text: `${q} in stock`, cls: "badge-green" };
}

const categoryColors: Record<string, string> = {
  ELECTRIC:    "#059669",
  SUV:         "#d97706",
  SEDAN:       "#2563eb",
  HATCHBACK:   "#16a34a",
  TRUCK:       "#64748b",
  COUPE:       "#9333ea",
  CONVERTIBLE: "#ea580c",
};

export default function VehicleCard({ vehicle, onBuy }: Props) {
  const outOfStock = vehicle.quantity === 0;
  const stock = stockLabel(vehicle.quantity);
  const accent = categoryColors[vehicle.category] ?? "#64748b";

  return (
    <article className="card flex flex-col overflow-hidden group hover:shadow-md transition-all duration-200">
      {/* Image / Placeholder */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {vehicle.imageUrl ? (
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <CarFront size={42} className="text-slate-300" />
          </div>
        )}

        {/* Category pill */}
        <div
          className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
          style={{ backgroundColor: accent + "dd" }}
        >
          {titleCase(vehicle.category)}
        </div>

        {/* Stock badge */}
        <div className="absolute top-3 right-3">
          <span className={stock.cls}>{stock.text}</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 leading-tight">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{vehicle.year} model year</p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-lg font-bold text-slate-900">{formatCurrency(vehicle.price)}</p>
          <button
            onClick={() => onBuy(vehicle)}
            disabled={outOfStock}
            className="btn-primary px-3 py-2 text-xs gap-1.5"
          >
            <ShoppingCart size={13} />
            {outOfStock ? "Sold out" : "Buy"}
          </button>
        </div>
      </div>
    </article>
  );
}
