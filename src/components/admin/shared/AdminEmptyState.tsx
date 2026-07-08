import type { LucideIcon } from "lucide-react";

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: AdminEmptyStateProps) {
  return (
    <div className="rounded-2xl bg-white p-12 text-center premium-shadow border border-elegant-black/5">
      <Icon className="h-14 w-14 text-gold/30 mx-auto mb-4" />
      <h3 className="font-serif text-xl text-elegant-black mb-2">{title}</h3>
      <p className="text-graphite mb-6 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}
