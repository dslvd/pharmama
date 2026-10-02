"use client";

import { useEffect, useRef, useState } from "react";

// errors dismiss themselves after this long (paused while hovered)
const AUTO_DISMISS_MS = 8000;
import { Ban, X } from "lucide-react";

// card
export function ErrorCard({
  err,
  depth = 0,
  onClose,
}: {
  err: string;
  depth?: number;
  onClose?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  // latest onClose without restarting the timer when the parent re-renders
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (hovered) return;
    // restarts on mouse leave, so the full time is given again after reading
    const timer = setTimeout(() => onCloseRef.current?.(), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [hovered]);

  // older errors fade, but stay readable
  const opacity = depth === 0 ? 1 : Math.max(0.6, 0.9 - depth * 0.1);

  return (
    <div
      role="alert"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="shadow-sm w-full bg-error/5 backdrop-blur-sm rounded-lg border border-border/50 p-4 transition-all duration-300 pointer-events-auto shrink-0"
      style={{ opacity }}
    >
      <div className="flex items-center gap-2">
        <Ban className="w-4 h-4 text-error/80 shrink-0" />
        <p className="text-sm text-error/90">
          <span className="font-semibold"> Error: </span> {err}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss error"
          className="ml-auto shrink-0 rounded-md p-1 text-error/80 transition-colors hover:bg-error/10 hover:text-error"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// stack
export function ErrorStack({
  errors = [],
}: {
  errors: { id: string; message: string }[];
}) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const visibleErrors = errors.filter((e) => !dismissedIds.has(e.id));

  if (visibleErrors.length === 0) return null;

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-sm flex flex-col-reverse gap-2 max-h-[80vh] overflow-y-auto pointer-events-none z-50">
      {visibleErrors.map((e, i) => {
        const depth = visibleErrors.length - 1 - i;
        return (
          <ErrorCard
            key={e.id}
            err={e.message}
            depth={depth}
            onClose={() => handleDismiss(e.id)}
          />
        );
      })}
    </div>
  );
}
