import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../utils/cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export function Select({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Selecione",
  error,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-graphite">{label}</label>
      )}
      <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
        <SelectPrimitive.Trigger
          className={cn(
            "flex w-full items-center justify-between rounded-xl border border-elegant-black/10 bg-white px-4 py-3 text-base text-elegant-black transition-all focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20",
            error && "border-red-400"
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 text-graphite" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="z-[100] overflow-hidden rounded-xl border border-elegant-black/10 bg-white shadow-lg"
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex cursor-pointer select-none items-center rounded-lg px-8 py-2.5 text-sm text-elegant-black outline-none hover:bg-cream-dark focus:bg-cream-dark data-[highlighted]:bg-cream-dark"
                >
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute left-2">
                    <Check className="h-4 w-4 text-gold" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
