"use client";

import {
  CalendarDays,
  ChevronDown,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import { createStock, updateStock } from "@/lib/api/stocks";
import {
  CreateStockPayload,
  Stock,
  UpdateStockPayload,
} from "@/lib/types/stock";
import { Product } from "@/lib/types/product";
import ProductModal from "@/components/ProductModal";

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
  const [batchNumber, setBatchNumber] = useState(stock?.batchNumber ?? "");
  const [quantity, setQuantity] = useState(
    stock ? String(stock.quantity) : "",
  );
  const [expiryDate, setExpiryDate] = useState(
    stock ? new Date(stock.expiryDate).toISOString().slice(0, 10) : "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPr, setSelectedPr] = useState<Product | null>(null);

  const handleQuantityInput = (value: string) => {
    if (value === "") {
      setQuantity("");
      return;
    }

    const numericValue = value.replace(/\D/g, "");
    setQuantity(numericValue === "" ? "" : String(Math.max(0, Number(numericValue))));
  };

  const adjustQuantity = (direction: "increment" | "decrement") => {
    setQuantity((currentValue) => {
      const currentNumber = currentValue === "" ? 0 : Number(currentValue);
      const nextNumber =
        direction === "increment" ? currentNumber + 1 : currentNumber - 1;
      return String(Math.max(0, nextNumber));
    });
  };

  const errors = (error ?? "").split(", ").map((err) => err.trim());

  const productError = errors.find(
    (err) =>
      err.toLowerCase().startsWith("product") ||
      err.toLowerCase().startsWith("productid"),
  );
  const batchNumberError = errors.find((err) =>
    err.toLowerCase().startsWith("batchnumber"),
  );
  const quantityError = errors.find((err) =>
    err.toLowerCase().startsWith("quantity"),
  );
  const expiryDateError = errors.find((err) =>
    err.toLowerCase().startsWith("expirydate"),
  );
  const generalError = errors.find(
    (err) =>
      !err.toLowerCase().startsWith("product") &&
      !err.toLowerCase().startsWith("productid") &&
      !err.toLowerCase().startsWith("batchnumber") &&
      !err.toLowerCase().startsWith("quantity") &&
      !err.toLowerCase().startsWith("expirydate"),
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload: UpdateStockPayload = {
      productId: selectedPr?.id,
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
            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex w-full items-center justify-between rounded-md border border-[#d9d0c6] bg-[#f8f8f5] px-3 py-2.5 text-left text-sm text-[#2e2b4c] outline-none transition-colors duration-200 hover:border-[#c5b8ab] focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                <span className={selectedPr ? "text-[#2e2b4c]" : "text-[#7b7a83]"}>
                  {selectedPr ? selectedPr.name : "Select a product"}
                </span>
                <ChevronDown className="h-4 w-4 text-[#2e2b4c]" />
              </button>
            </div>
            {productError && (
              <p className="mt-1 text-sm text-rose-600">{productError}</p>
            )}
          </label>

          {isOpen && (
            <ProductModal
              onSelect={(pr) => {
                setSelectedPr(pr);
              }}
              onClose={() => setIsOpen(false)}
            />
          )}

          <label className={labelClasses}>
            Batch Number
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              className="mt-1 w-full rounded-md border border-[#d9d0c6] bg-[#f8f8f5] px-3 py-2.5 text-sm text-[#2e2b4c] outline-none transition-colors duration-200 placeholder:text-[#8f8d95] focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
            {batchNumberError && (
              <p className="mt-1 text-sm text-rose-600">{batchNumberError}</p>
            )}
          </label>

          <label className={labelClasses}>
            Quantity
            <div className="mt-1 flex overflow-hidden rounded-md border border-[#d9d0c6] bg-[#f8f8f5] shadow-[inset_0_0_0_1px_rgba(17,24,39,0.02)]">
              <button
                type="button"
                onClick={() => adjustQuantity("decrement")}
                aria-label="Decrease quantity"
                className="flex h-11 w-11 items-center justify-center border-r border-[#d9d0c6] bg-transparent text-[#2e2b4c] transition-colors duration-200 hover:bg-[#efe7dc]"
              >
                <Minus className="h-4 w-4" />
              </button>

              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={quantity}
                placeholder="0"
                onChange={(e) => handleQuantityInput(e.target.value)}
                className="h-11 w-full border-0 bg-transparent px-3 text-center text-base font-medium text-[#2e2b4c] outline-none placeholder:text-[#8f8d95]"
              />

              <button
                type="button"
                onClick={() => adjustQuantity("increment")}
                aria-label="Increase quantity"
                className="flex h-11 w-11 items-center justify-center border-l border-[#d9d0c6] bg-transparent text-[#2e2b4c] transition-colors duration-200 hover:bg-[#efe7dc]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {quantityError && (
              <p className="mt-1 text-sm text-rose-600">{quantityError}</p>
            )}
          </label>

          <label className={labelClasses}>
            Expiry Date
            <div className="relative mt-1">
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full appearance-none rounded-md border border-[#d9d0c6] bg-[#f8f8f5] px-3 py-2.5 pr-10 text-sm text-[#2e2b4c] outline-none transition-colors duration-200 placeholder:text-[#8f8d95] focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                onClick={(e) => {
                  const target = e.currentTarget as HTMLInputElement;
                  if (target.showPicker) {
                    target.showPicker();
                  }
                }}
              />
              <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2e2b4c]" />
            </div>
            {expiryDateError && (
              <p className="mt-1 text-sm text-rose-600">{expiryDateError}</p>
            )}
          </label>

          {generalError && (
            <p className="text-sm text-rose-600">{generalError}</p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#d9d0c6] bg-transparent px-4 py-2 text-sm font-medium text-[#2e2b4c] transition-colors duration-200 hover:bg-[#efe7dc]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-[#4b3d6b] px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#433661] disabled:opacity-60"
            >
              {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}