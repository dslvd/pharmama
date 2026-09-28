"use client";

import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { createStock, updateStock } from "@/lib/api/stocks";
import {
  CreateStockPayload,
  Stock,
  UpdateStockPayload,
} from "@/lib/types/stock";
import { Product } from "@/lib/types/product";
import Modal from "@/components/ui/Modal";
import ProductDropdown from "@/components/ProductDropdown";

interface AddStockModalProps {
  stock?: Stock;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClasses =
  "mt-1.5 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20";
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
  const [isProductOpen, setIsProductOpen] = useState(false);
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
    <Modal
      open
      onClose={onClose}
      title={isEditing ? "Edit Stock" : "Add Stock"}
      size="md"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className={labelClasses}>
          Product
          <ProductDropdown
            value={selectedPr}
            onChange={setSelectedPr}
            open={isProductOpen}
            onOpenChange={setIsProductOpen}
            error={productError}
          />
          {productError && (
            <p className="mt-1.5 text-sm text-destructive">{productError}</p>
          )}
        </label>

        <label className={labelClasses}>
          Batch Number
          <input
            type="text"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            placeholder="e.g. BIO567"
            className={inputClasses}
          />
          {batchNumberError && (
            <p className="mt-1.5 text-sm text-destructive">{batchNumberError}</p>
          )}
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className={labelClasses}>
            Quantity
            <div className="mt-1.5 flex h-10.5 overflow-hidden rounded-md border border-border bg-input">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={quantity}
                placeholder="0"
                onChange={(e) => handleQuantityInput(e.target.value)}
                className="h-full w-full border-0 bg-transparent px-3 text-left text-base font-medium text-foreground outline-none placeholder:text-muted-foreground"
              />
              <div className="flex w-10 flex-col border-l border-border">
                <button
                  type="button"
                  onClick={() => adjustQuantity("increment")}
                  aria-label="Increase quantity"
                  className="flex h-1/2 items-center justify-center text-foreground transition-colors duration-200 hover:bg-muted"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => adjustQuantity("decrement")}
                  aria-label="Decrease quantity"
                  className="flex h-1/2 items-center justify-center text-foreground transition-colors duration-200 hover:bg-muted"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {quantityError && (
              <p className="mt-1.5 text-sm text-destructive">{quantityError}</p>
            )}
          </label>

          <label className={labelClasses}>
            Expiry Date
            <div className="relative mt-1.5">
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="mm/dd/yyyy"
                className="h-10.5 w-full appearance-none rounded-md border border-border bg-input px-3 pr-10 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
              <button
                type="button"
                aria-label="Open calendar"
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.parentElement?.querySelector('input[type="date"]') as HTMLInputElement | null;
                  if (input && input.showPicker) {
                    input.showPicker();
                  }
                }}
              >
                <CalendarDays className="h-4 w-4" />
              </button>
            </div>
            {expiryDateError && (
              <p className="mt-1.5 text-sm text-destructive">{expiryDateError}</p>
            )}
          </label>
        </div>

        {generalError && (
          <p className="text-sm text-destructive">{generalError}</p>
        )}

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-w-30 rounded-md border border-border bg-input px-4 py-2.5 text-base font-medium text-foreground transition-colors duration-200 hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="min-w-30 rounded-md bg-primary px-4 py-2.5 text-base font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
