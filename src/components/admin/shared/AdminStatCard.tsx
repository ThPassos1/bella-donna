import type { LucideIcon } from "lucide-react";
import { cn } from "../../../utils/cn";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent?: "gold" | "green" | "red" | "blue";
}

const accents = {
  gold: "bg-gold/10 text-gold",
  green: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-500",
  blue: "bg-blue-50 text-blue-600",
};

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = "gold",
}: AdminStatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 premium-shadow border border-elegant-black/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-graphite mb-1">{title}</p>
          <p className="text-2xl font-semibold text-elegant-black">{value}</p>
          {subtitle && <p className="text-xs text-graphite mt-1">{subtitle}</p>}
        </div>
        <div className={cn("rounded-xl p-3", accents[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
