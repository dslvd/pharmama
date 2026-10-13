import { useEffect } from "react";

// warning for leaving a page with unsaved work (null = nothing to lose).
// Kept at module level so the sidebar can read it when a link is clicked.
let warning: string | null = null;

export const getLeaveWarning = () => warning;

// for a confirmed leave like logout, so the browser's own prompt doesn't show too
export const clearLeaveWarning = () => {
  warning = null;
};

export function useLeaveWarning(message: string | null) {
  useEffect(() => {
    warning = message;
    if (!message) return;
    // refresh / close tab: the browser shows its own generic prompt
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (warning) e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      warning = null;
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [message]);
}
