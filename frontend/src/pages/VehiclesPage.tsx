import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Car,
  CheckCircle2,
  Grid,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import VehicleTable from "../features/vehicles/VehicleTable";
import VehicleForm from "../features/vehicles/VehicleForm";
import EditVehicleModal from "../features/vehicles/EditVehicleModal";
import PurchaseVehicleModal from "../features/purchases/PurchaseVehicleModal";
import VehicleCard from "../features/vehicles/VehicleCard";
import Modal from "../components/ui/Modal";
import { getVehicles } from "../services/vehicle.service";
import { useIsAdmin } from "../hooks/useAuth";
import { formatCurrency, titleCase } from "../utils/format";
import type { Vehicle } from "../types/vehicle";

const ALL_CATEGORIES = "ALL";

export default function VehiclesPage() {
  const isAdmin = useIsAdmin();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [buyingVehicle, setBuyingVehicle] = useState<Vehicle | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const vehiclesList = useMemo(() => data?.data ?? [], [data]);

  const categories = useMemo(
    () => Array.from(new Set(vehiclesList.map((v) => v.category))).sort(),
    [vehiclesList],
  );

  const filteredVehicles = vehiclesList.filter((v) => {
    const q = search.trim().toLowerCase();
    const price = Number(v.price);
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    const matchesText =
      !q ||
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q);
    const matchesCategory = category === ALL_CATEGORIES || v.category === category;
    const matchesMin = min === null || price >= min;
    const matchesMax = max === null || price <= max;

    return matchesText && matchesCategory && matchesMin && matchesMax;
  });

  const availableCount = vehiclesList.filter((v) => v.quantity > 0).length;
  const lowStockCount = vehiclesList.filter(
    (v) => v.quantity > 0 && v.quantity <= 3,
  ).length;
  const averagePrice =
    vehiclesList.length > 0
      ? vehiclesList.reduce((sum, v) => sum + Number(v.price), 0) /
        vehiclesList.length
      : 0;

  const resetFilters = () => {
    setSearch("");
    setCategory(ALL_CATEGORIES);
    setMinPrice("");
    setMaxPrice("");
  };

  const hasFilters =
    search !== "" || category !== ALL_CATEGORIES || minPrice !== "" || maxPrice !== "";

  return (
    <div className="space-y-6">
      <section className="mesh-panel overflow-hidden rounded-3xl p-5 text-white shadow-2xl shadow-teal-950/20 sm:p-6">
        <div className="grid gap-7 xl:grid-cols-[1fr_420px] xl:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-teal-50">
              <Sparkles size={14} />
              {isAdmin ? "Admin catalog" : "Vehicle showroom"}
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Inventory
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-100/85">
              Search the catalog, compare stock status, and move quickly from
              browsing to purchase or admin maintenance.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Models", value: vehiclesList.length },
              { label: "Available", value: availableCount },
              { label: "Low stock", value: lowStockCount },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                <p className="text-xs font-semibold text-slate-100/70">{item.label}</p>
                <p className="mt-1 text-2xl font-black">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur lg:grid-cols-[minmax(220px,1fr)_180px_150px_150px_auto]">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, or category"
              className="field border-white/70 bg-white/95 pl-10"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="field border-white/70 bg-white/95"
            aria-label="Filter by category"
          >
            <option value={ALL_CATEGORIES}>All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {titleCase(cat)}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min={0}
            placeholder="Min price"
            className="field border-white/70 bg-white/95"
          />

          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min={0}
            placeholder="Max price"
            className="field border-white/70 bg-white/95"
          />

          <div className="flex gap-2">
            {!isAdmin && (
              <div className="flex rounded-xl border border-white/20 bg-white/10 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg p-2 transition ${
                    viewMode === "grid"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-white/75 hover:text-white"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg p-2 transition ${
                    viewMode === "list"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-white/75 hover:text-white"
                  }`}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
            )}

            <button
              onClick={resetFilters}
              disabled={!hasFilters}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 lg:flex-none"
            >
              <SlidersHorizontal size={16} />
              Reset
            </button>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800">
            <CheckCircle2 size={14} />
            Showing {filteredVehicles.length} of {vehiclesList.length}
          </span>
          {vehiclesList.length > 0 && (
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">
              Average {formatCurrency(Math.round(averagePrice))}
            </span>
          )}
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="btn-primary w-full sm:w-auto"
          >
            <Plus size={16} />
            Add vehicle
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="premium-surface shimmer-effect aspect-[4/3]" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          Failed to load inventory. Please try again.
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="premium-surface flex flex-col items-center justify-center border-dashed py-16 text-center">
          <Car size={34} className="mb-3 text-slate-300" />
          <p className="text-sm font-bold text-slate-700">No vehicles found</p>
          <p className="mt-1 text-sm text-slate-500">
            Adjust your search or filters to see more inventory.
          </p>
        </div>
      ) : isAdmin || viewMode === "list" ? (
        <VehicleTable
          vehicles={filteredVehicles}
          onEdit={isAdmin ? setEditingVehicle : undefined}
          onBuy={!isAdmin ? setBuyingVehicle : undefined}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredVehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className="animate-rise-in"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <VehicleCard vehicle={vehicle} onBuy={setBuyingVehicle} />
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add vehicle"
      >
        <VehicleForm
          onSuccess={() => setIsAddOpen(false)}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>

      <EditVehicleModal
        vehicle={editingVehicle}
        onClose={() => setEditingVehicle(null)}
      />

      <PurchaseVehicleModal
        vehicle={buyingVehicle}
        onClose={() => setBuyingVehicle(null)}
      />
    </div>
  );
}
