import Modal from "../../components/ui/Modal";
import VehicleForm from "./VehicleForm";
import type { Vehicle } from "../../types/vehicle";

interface EditVehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export default function EditVehicleModal({ vehicle, onClose }: EditVehicleModalProps) {
  return (
    <Modal
      isOpen={vehicle !== null}
      onClose={onClose}
      title="Edit vehicle"
    >
      {vehicle && (
        <VehicleForm
          vehicle={vehicle}
          onSuccess={onClose}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}
