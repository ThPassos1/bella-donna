import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-6xl",
};

export function Modal({
  open,
  onOpenChange,
  children,
  title,
  className,
  size = "lg",
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-elegant-black/50 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "fixed left-1/2 top-4 sm:top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 sm:-translate-y-1/2 rounded-2xl bg-white p-4 sm:p-6 premium-shadow-lg max-h-[90vh] overflow-y-auto",
                  sizes[size],
                  className
                )}
              >
                {title && (
                  <Dialog.Title className="font-serif text-2xl font-semibold text-elegant-black mb-4">
                    {title}
                  </Dialog.Title>
                )}
                {children}
                <Dialog.Close className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full p-2.5 text-graphite transition-colors hover:bg-cream-dark hover:text-elegant-black">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Fechar</span>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
