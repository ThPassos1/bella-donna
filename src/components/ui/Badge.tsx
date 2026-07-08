import { cn } from "../../utils/cn";

type BadgeVariant = "default" | "gold" | "new" | "sale";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-cream-dark text-graphite",
  gold: "bg-gradient-to-r from-gold to-gold-light text-white",
  new: "bg-rose-nude text-elegant-black",
  sale: "bg-elegant-black text-white",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
