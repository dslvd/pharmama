"use client";

import { useState } from "react";
import { createProduct, updateProduct } from "@/lib/api/product";
import {
  Category,
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from "@/lib/types/product";
import Modal from "@/components/ui/Modal";
import CategoryDropdown from "@/components/CategoryDropdown";

interface AddProductModalProps {
  product?: Product;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClasses =
  "mt-1.5 w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20";

const labelClasses = "block text-sm font-medium text-foreground";

export default function AddProductModal({
  product,
  onClose,
  onSuccess,
}: AddProductModalProps) {
  const isEditing = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [genericName, setGenericName] = useState(product?.genericName ?? "");
  const [category, setCategory] = useState<Category>(
    product?.category ?? "OTHERS",
  );
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errors = (error ?? "").split(", ").map((err) => err.trim());

  const nameError = errors.find((err) =>
    err.toLowerCase().startsWith("name"),
  );
  const genericNameError = errors.find((err) =>
    err.toLowerCase().startsWith("genericname"),
  );
  const priceError = errors.find((err) =>
    err.toLowerCase().startsWith("price"),
  );
  const generalError = errors.find(
    (err) =>
      !err.toLowerCase().startsWith("name") &&
      !err.toLowerCase().startsWith("genericname") &&
      !err.toLowerCase().startsWith("price"),
  );

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
      console.log(result.error);
      setError(result.error);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={isEditing ? "Edit Product" : "Add Product"}
      size="lg"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className={labelClasses}>
          Product Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Amoxil"
            className={inputClasses}
          />
          {nameError && (
            <p className="mt-1.5 text-sm text-destructive">{nameError}</p>
          )}
        </label>

        <label className={labelClasses}>
          Generic Name
          <input
            type="text"
            value={genericName}
            onChange={(e) => setGenericName(e.target.value)}
            placeholder="e.g. Amoxicillin"
            className={inputClasses}
          />
          {genericNameError && (
            <p className="mt-1.5 text-sm text-destructive">{genericNameError}</p>
          )}
        </label>

        <label className={labelClasses}>
          Category
          <CategoryDropdown
            value={category}
            onChange={setCategory}
            open={isCategoryOpen}
            onOpenChange={setIsCategoryOpen}
          />
        </label>

        <label className={labelClasses}>
          Price
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg font-medium text-foreground">
              ₱
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className={`${inputClasses} pl-9`}
            />
          </div>
          {priceError && (
            <p className="mt-1.5 text-sm text-destructive">{priceError}</p>
          )}
        </label>

        {generalError && (
          <p className="text-sm text-destructive">{generalError}</p>
        )}

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-w-32.5 rounded-md border border-border bg-transparent px-4 py-2.5 text-base font-medium text-foreground transition-colors duration-200 hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="min-w-32.5 rounded-md bg-primary px-4 py-2.5 text-base font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
