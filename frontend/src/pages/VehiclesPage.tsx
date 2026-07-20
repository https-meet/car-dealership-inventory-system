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
  const averagePrice =
    vehiclesList.length > 0
      ? vehiclesList.reduce((sum, v) => sum + Number(v.price), 0) / vehiclesList.length
      : 0;

  const resetFilters = () => {
    setSearch("");
    setCategory(ALL_CATEGORIES);
    setMinPrice("");
    setMaxPrice("");
  };

  const hasFilters = search !== "" || category !== ALL_CATEGORIES || minPrice !== "" || maxPrice !== "";

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inventory</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {isAdmin ? "Manage and maintain vehicle catalog." : "Browse vehicles and make purchases."}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setIsAddOpen(true)} className="btn-primary shrink-0">
            <Plus size={15} />
            Add vehicle
          </button>
        )}
      </div>

      {/* Quick stats */}
      {!isLoading && vehiclesList.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total models", value: vehiclesList.length },
            { label: "Available",    value: availableCount },
            { label: "Avg price",    value: formatCurrency(Math.round(averagePrice)) },
          ].map(({ label, value }) => (
            <div key={label} className="surface p-4">
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters bar */}
      <div className="surface p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_160px_130px_130px_auto]">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, or category…"
              className="field pl-10"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="field"
            aria-label="Filter by category"
          >
            <option value={ALL_CATEGORIES}>All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{titleCase(cat)}</option>
            ))}
          </select>

          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min={0}
            placeholder="Min price"
            className="field"
          />

          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min={0}
            placeholder="Max price"
            className="field"
          />

          <div className="flex gap-2">
            {!isAdmin && (
              <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg p-2 transition-colors ${
                    viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg p-2 transition-colors ${
                    viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                  aria-label="List view"
                >
                  <List size={15} />
                </button>
              </div>
            )}
            <button
              onClick={resetFilters}
              disabled={!hasFilters}
              className="btn-secondary gap-2"
            >
              <SlidersHorizontal size={14} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm text-slate-500">
          <CheckCircle2 size={15} className="text-emerald-500" />
          Showing <strong className="text-slate-900">{filteredVehicles.length}</strong> of {vehiclesList.length} vehicles
        </span>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="shimmer-effect aspect-[4/3] rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          Failed to load inventory. Please try again.
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="surface flex flex-col items-center justify-center py-16 text-center">
          <Car size={32} className="mb-3 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No vehicles found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your search or filters.
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
              className="animate-fade-in"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <VehicleCard vehicle={vehicle} onBuy={setBuyingVehicle} />
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add vehicle">
        <VehicleForm onSuccess={() => setIsAddOpen(false)} onCancel={() => setIsAddOpen(false)} />
      </Modal>

      <EditVehicleModal vehicle={editingVehicle} onClose={() => setEditingVehicle(null)} />
      <PurchaseVehicleModal vehicle={buyingVehicle} onClose={() => setBuyingVehicle(null)} />
    </div>
  );
}
