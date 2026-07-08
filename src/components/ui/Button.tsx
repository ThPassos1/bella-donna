import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "gold";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-elegant-black text-white hover:bg-graphite shadow-md hover:shadow-lg",
  secondary:
    "bg-white text-elegant-black border border-elegant-black/10 hover:border-gold/40 hover:shadow-md",
  outline:
    "border-2 border-gold text-gold-dark hover:bg-gold hover:text-white",
  ghost: "text-graphite hover:text-elegant-black hover:bg-cream-dark",
  gold: "bg-gradient-to-r from-gold to-gold-light text-white hover:from-gold-dark hover:to-gold shadow-md premium-shadow-gold",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
