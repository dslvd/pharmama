import { useEffect } from "react";

// Warning to show before leaving a page with unsaved work (null = nothing
// to lose). Module-level so the sidebar can check it at click time.
let warning: string | null = null;

export const getLeaveWarning = () => warning;

// for a confirmed full-page leave (e.g. logout), so the browser's own
// "leave site?" prompt doesn't show on top of ours
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
