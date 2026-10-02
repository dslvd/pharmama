"use client";

import { cn } from "cn";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-2xl",
  "2xl": "sm:max-w-4xl",
} as const;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  size?: keyof typeof sizeClasses;
  className?: string;
  contentClassName?: string;
  // hide the corner X when the modal has its own Cancel/Close button
  showCloseButton?: boolean;
  children: React.ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  eyebrow,
  size = "md",
  className,
  contentClassName,
  showCloseButton = true,
  children,
}: ModalProps) {
  return (
    <Dialog
      open={open}
      // only Cancel/Close (or Esc) closes a modal, not a click outside
      disablePointerDismissal
      onOpenChange={(next: boolean) => {
        if (!next) onClose();
      }}
    >
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(
          "flex max-h-[85vh] w-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl",
          sizeClasses[size],
          className,
        )}
      >
        <DialogHeader className={cn("gap-1", showCloseButton && "pr-6")}>
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <DialogTitle className="text-2xl font-bold text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className={cn("min-h-0 flex-1", contentClassName)}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
