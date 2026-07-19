import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Car } from "lucide-react";
import VehicleTable from "../features/vehicles/VehicleTable";
import VehicleForm from "../features/vehicles/VehicleForm";
import EditVehicleModal from "../features/vehicles/EditVehicleModal";
import Modal from "../components/ui/Modal";
import { getVehicles } from "../services/vehicle.service";
import type { Vehicle } from "../types/vehicle";

export default function VehiclesPage() {
  const [search, setSearch] = useState("");
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const filteredVehicles = (data?.data ?? []).filter((v) => {
    const q = search.toLowerCase();
    return (
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Car size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Vehicles</h1>
            <p className="text-sm text-slate-500">
              {data?.data.length ?? 0} total vehicles in inventory
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Vehicle
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by make, model or category…"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors sm:max-w-sm"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-slate-400">
          Loading vehicles…
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          Failed to load vehicles. Please try again.
        </div>
      ) : (
        <VehicleTable
          vehicles={filteredVehicles}
          onEdit={setEditingVehicle}
        />
      )}

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Vehicle"
      >
        <VehicleForm
          onSuccess={() => setIsAddOpen(false)}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>

      {/* Edit Vehicle Modal */}
      <EditVehicleModal
        vehicle={editingVehicle}
        onClose={() => setEditingVehicle(null)}
      />
    </div>
  );
}