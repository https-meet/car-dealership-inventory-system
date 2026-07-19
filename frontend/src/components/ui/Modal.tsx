import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <button
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal backdrop"
      />

      <div className="relative z-10 flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-950/20">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <h2 id="modal-title" className="text-base font-bold text-slate-950">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="icon-button"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
