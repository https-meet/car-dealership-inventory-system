import { BatteryCharging, CarFront, Gauge, ShoppingCart } from "lucide-react";
import type { Vehicle } from "../../types/vehicle";
import { formatCurrency, titleCase } from "../../utils/format";

interface Props {
  vehicle: Vehicle;
  onBuy: (vehicle: Vehicle) => void;
}

const categoryTone: Record<string, string> = {
  ELECTRIC: "from-teal-300 via-cyan-200 to-sky-300",
  SUV: "from-amber-300 via-orange-200 to-rose-200",
  SEDAN: "from-sky-300 via-indigo-200 to-teal-200",
  HATCHBACK: "from-lime-300 via-emerald-200 to-teal-200",
  TRUCK: "from-slate-300 via-zinc-200 to-amber-200",
  COUPE: "from-violet-300 via-fuchsia-200 to-rose-200",
  CONVERTIBLE: "from-rose-300 via-orange-200 to-amber-200",
};

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
  const gradient = categoryTone[vehicle.category] ?? categoryTone.SEDAN;

  return (
    <article className="group min-h-full overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-xl shadow-slate-200/60 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-950/10">
      <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${gradient}`}>
        {vehicle.imageUrl ? (
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="relative h-24 w-48 transition duration-500 group-hover:scale-105">
              <div className="absolute bottom-5 left-5 h-14 w-36 rounded-[2rem_2rem_1rem_1rem] bg-white/80 shadow-2xl shadow-slate-950/10" />
              <div className="absolute bottom-14 left-16 h-10 w-20 rounded-t-[2rem] bg-white/60" />
              <div className="absolute bottom-3 left-9 h-8 w-8 rounded-full border-[6px] border-slate-900 bg-slate-100" />
              <div className="absolute bottom-3 right-9 h-8 w-8 rounded-full border-[6px] border-slate-900 bg-slate-100" />
              <CarFront className="absolute bottom-10 left-[86px] text-slate-900/70" size={28} />
            </div>
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-900 shadow-sm backdrop-blur">
          {titleCase(vehicle.category)}
        </div>

        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-slate-950/85 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur">
          <span className={`status-dot ${stockTone(vehicle.quantity)}`} />
          {stockLabel(vehicle.quantity)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black tracking-tight text-slate-950">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Model year {vehicle.year}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
              <Gauge size={13} />
              Stock
            </div>
            <p className="mt-1 text-sm font-black text-slate-950">
              {vehicle.quantity} units
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
              <BatteryCharging size={13} />
              Type
            </div>
            <p className="mt-1 truncate text-sm font-black text-slate-950">
              {titleCase(vehicle.category)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Price
            </p>
            <p className="mt-1 text-xl font-black tracking-tight text-slate-950">
              {formatCurrency(vehicle.price)}
            </p>
          </div>

          <button
            onClick={() => onBuy(vehicle)}
            disabled={isOutOfStock}
            className="btn-primary px-4 py-2 text-xs"
          >
            <ShoppingCart size={14} />
            {isOutOfStock ? "Sold out" : "Buy"}
          </button>
        </div>
      </div>
    </article>
  );
}
