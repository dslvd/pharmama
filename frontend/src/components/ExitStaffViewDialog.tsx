"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/lib/auth";

export default function ExitStaffViewDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, exitStaffView } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function close() {
    setPassword("");
    setError(null);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const msg = await exitStaffView(password);
    setSubmitting(false);

    if (msg) {
      setError(msg);
      return;
    }
    close();
    router.push("/dashboard");
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Exit pharmacist view"
      eyebrow={user?.email}
      size="sm"
      showCloseButton={false}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="block text-sm font-medium text-foreground">
          Password
          <input
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`mt-1.5 w-full rounded-md border bg-input px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 ${
              error ? "border-destructive" : "border-border"
            }`}
          />
          {error && (
            <span
              role="alert"
              className="mt-1.5 block text-xs text-destructive"
            >
              {error}
            </span>
          )}
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={close}
            disabled={submitting}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !password}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Checking..." : "Exit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
