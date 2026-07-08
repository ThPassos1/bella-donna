import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";

interface AdminConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  danger = false,
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  return (
    <Modal open={open} onOpenChange={(v) => !v && onCancel()} title={title} size="sm">
      <p className="text-graphite mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" size="lg" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          variant={danger ? "primary" : "gold"}
          size="lg"
          className={danger ? "bg-red-500 hover:bg-red-600 border-red-500" : ""}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
