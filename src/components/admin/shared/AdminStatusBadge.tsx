import type { CustomerOrderStatus } from "../../../types/account";
import { ORDER_STATUS_LABELS } from "../../../types/account";
import { cn } from "../../../utils/cn";

const statusStyles: Record<CustomerOrderStatus, string> = {
  received: "bg-blue-50 text-blue-700",
  payment_review: "bg-amber-50 text-amber-700",
  payment_approved: "bg-emerald-50 text-emerald-700",
  preparing: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
};

export function AdminStatusBadge({ status }: { status: CustomerOrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        statusStyles[status]
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
