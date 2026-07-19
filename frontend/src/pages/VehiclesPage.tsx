import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Car, Grid, List, Plus, Search, SlidersHorizontal } from "lucide-react";
import VehicleTable from "../features/vehicles/VehicleTable";
import VehicleForm from "../features/vehicles/VehicleForm";
import EditVehicleModal from "../features/vehicles/EditVehicleModal";
import PurchaseVehicleModal from "../features/purchases/PurchaseVehicleModal";
import VehicleCard from "../features/vehicles/VehicleCard";
import Modal from "../components/ui/Modal";
import { getVehicles } from "../services/vehicle.service";
import { useIsAdmin } from "../hooks/useAuth";
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
    [vehiclesList]
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
      <section className="surface p-5 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              {isAdmin ? "Admin catalog" : "Vehicle showroom"}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Inventory
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Search by make, model, category, or price range. Purchase actions
              are unavailable when a vehicle has no stock.
            </p>
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

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(220px,1fr)_180px_150px_150px_auto]">
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
              <option key={cat} value={cat}>
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </option>
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
              <div className="flex rounded-lg border border-slate-200 bg-slate-100 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md p-2 transition ${
                    viewMode === "grid"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-950"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-md p-2 transition ${
                    viewMode === "list"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-950"
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
              className="btn-secondary flex-1 lg:flex-none"
            >
              <SlidersHorizontal size={16} />
              Reset
            </button>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="surface shimmer-effect aspect-[4/3]" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          Failed to load inventory. Please try again.
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="surface flex flex-col items-center justify-center border-dashed py-16 text-center">
          <Car size={34} className="mb-3 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No vehicles found</p>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onBuy={setBuyingVehicle}
            />
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
