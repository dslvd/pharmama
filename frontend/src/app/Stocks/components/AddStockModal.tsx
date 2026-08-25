// components/Stock/AddStockModal.tsx
"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { createStock, updateStock } from "@/lib/api/stocks";
import {
  CreateStockPayload,
  Stock,
  UpdateStockPayload,
} from "@/lib/types/stock";

interface AddStockModalProps {
  stock?: Stock;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClasses =
  "mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100";
const labelClasses = "block text-sm font-medium text-foreground";

export default function AddStockModal({
  stock,
  onClose,
  onSuccess,
}: AddStockModalProps) {
  const isEditing = !!stock;

  const [productId, setProductId] = useState(
    stock ? String(stock.productId) : "",
  );
  const [batchNumber, setBatchNumber] = useState(stock?.batchNumber ?? "");
  const [quantity, setQuantity] = useState(stock ? String(stock.quantity) : "");
  const [expiryDate, setExpiryDate] = useState(
    stock ? new Date(stock.expiryDate).toISOString().slice(0, 10) : "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload: UpdateStockPayload = {
      productId: Number(productId),
      batchNumber,
      quantity: Number(quantity),
      expiryDate: new Date(expiryDate),
    };

    const result = isEditing
      ? await updateStock(stock.id, payload)
      : await createStock(payload as CreateStockPayload);

    setSubmitting(false);

    if (result.ok) {
      onSuccess?.();
      onClose();
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-y-auto rounded-2xl border border-border bg-[#fdf6ec] p-6 shadow-xl">
        <div className="flex items-center justify-between gap-3 pb-4">
          <h2 className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Stock" : "Add Stock"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className={labelClasses}>
            Product
            {/* TODO: populate options from the products API */}
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
              className={inputClasses}
            ></select>
          </label>

          <label className={labelClasses}>
            Batch Number
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              required
              className={inputClasses}
            />
          </label>

          <label className={labelClasses}>
            Quantity
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className={inputClasses}
            />
          </label>

          <label className={labelClasses}>
            Expiry Date
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              className={inputClasses}
            />
          </label>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}