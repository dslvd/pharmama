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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl bg-[#fdf6ec] p-6 shadow-xl">
        <div className="flex items-center justify-between gap-3 pb-4">
          <h2 className="text-3xl font-bold">
            {isEditing ? "Edit Stock" : "Add Stock"}
          </h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
          <label>
            Product
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            ></select>
          </label>

          <label>
            Batch Number
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              required
            />
          </label>

          <label>
            Quantity
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </label>

          <label>
            Expiry Date
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
