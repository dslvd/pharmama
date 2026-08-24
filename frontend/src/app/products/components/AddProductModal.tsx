"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { createProduct, updateProduct } from "@/lib/api/product";
import {
  Category,
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from "@/lib/types/product";

interface AddProductModalProps {
  product?: Product;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClasses =
  "mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100";

const labelClasses = "block text-sm font-medium text-foreground";

export default function AddProductModal({
  product,
  onClose,
  onSuccess,
}: AddProductModalProps) {
  const isEditing = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [genericName, setGenericName] = useState(product?.genericName ?? "");
  const [category, setCategory] = useState<Category>(product?.category ?? "OTHERS");
  const [price, setPrice] = useState(product ? String(product.price) : "");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload: UpdateProductPayload = {
      name,
      genericName,
      category,
      price: Number(price),
    };

    const result = isEditing
      ? await updateProduct(product.id, payload)
      : await createProduct({
          name,
          genericName,
          category,
          price: Number(price),
        } satisfies CreateProductPayload);

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
            {isEditing ? "Edit Product" : "Add Product"}
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
            Product Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClasses}
            />
          </label>

          <label className={labelClasses}>
            Generic Name
            <input
              type="text"
              value={genericName}
              onChange={(e) => setGenericName(e.target.value)}
              required
              className={inputClasses}
            />
          </label>

          <label className={labelClasses}>
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              required
              className={inputClasses}
            >
              {[
                "ANALGESICS",
                "ANTIBIOTICS",
                "ANTIHISTAMINES",
                "VITAMINS",
                "SUPPLEMENTS",
                "ANTACIDS",
                "HYGIENE",
                "OTHERS",
              ].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClasses}>
            Price
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary disabled:opacity-60"
            >
              {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
