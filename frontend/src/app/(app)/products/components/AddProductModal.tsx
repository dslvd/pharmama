"use client";

import { ChevronDown, X } from "lucide-react";
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
  "mt-1 w-full rounded-md border border-[#d9d0c6] bg-[#f8f8f5] px-3 py-2.5 text-sm text-[#2e2b4c] outline-none transition-colors duration-200 placeholder:text-[#8f8d95] focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

const labelClasses = "block text-sm font-medium text-[#2e2b4c]";

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

  const categoryOptions: Category[] = [
    "ANALGESICS",
    "ANTIBIOTICS",
    "ANTIHISTAMINES",
    "VITAMINS",
    "SUPPLEMENTS",
    "ANTACIDS",
    "HYGIENE",
    "OTHERS",
  ];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-lg rounded-[22px] border border-[#d9d0c6] bg-[#f3efe9] p-5 shadow-[0_12px_28px_rgba(26,22,35,0.12)]">
        <div className="flex items-center justify-between gap-3 pb-4">
          <h2 className="text-[2rem] font-bold leading-none tracking-[-0.04em] text-[#2e2b4c]">
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-[#2e2b4c] transition-colors hover:bg-[#e5e0d8]"
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
              placeholder="e.g. Amoxil"
              className={`${inputClasses} mt-1`}
            />
            {nameError && (
              <p className="mt-1 text-sm text-rose-600">{nameError}</p>
            )}
          </label>

          <label className={labelClasses}>
            Generic Name
            <input
              type="text"
              value={genericName}
              onChange={(e) => setGenericName(e.target.value)}
              placeholder="e.g. Amoxicillin"
              className={`${inputClasses} mt-1`}
            />
            {genericNameError && (
              <p className="mt-1 text-sm text-rose-600">{genericNameError}</p>
            )}
          </label>

          <label className={labelClasses}>
            Category
            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setIsCategoryOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-md border border-[#d9d0c6] bg-[#f8f8f5] px-3 py-2.5 text-left text-sm text-[#2e2b4c] outline-none transition-colors duration-200 hover:border-[#c5b8ab] focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                <span className="font-semibold uppercase tracking-[0.02em]">{category}</span>
                <ChevronDown
                  className={`h-4 w-4 text-[#2e2b4c] transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-60 overflow-hidden rounded-2xl border border-[#d9d0c6] bg-[#f8f8f5]/95 shadow-[0_18px_28px_rgba(42,31,58,0.14)] backdrop-blur-sm">
                  <div className="max-h-56 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c7bcae] [&::-webkit-scrollbar-track]:bg-transparent">
                    {categoryOptions.map((option) => {
                      const isSelected = category === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setCategory(option);
                            setIsCategoryOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition-colors ${
                            isSelected
                              ? "bg-violet-50 font-semibold text-violet-950"
                              : "text-[#2e2b4c] hover:bg-[#f1eee9]"
                          }`}
                        >
                          <span>{option}</span>
                          {isSelected && (
                            <span className="h-4 w-1 rounded-full bg-violet-900" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </label>

          <label className={labelClasses}>
            Price
            <div className="relative mt-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg font-medium text-[#2e2b4c]">
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
              <p className="mt-1 text-sm text-rose-600">{priceError}</p>
            )}
          </label>

          {generalError && (
            <p className="text-sm text-rose-600">{generalError}</p>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-w-32.5 rounded-md border border-[#cfc2b1] bg-transparent px-4 py-2.5 text-base font-medium text-[#2e2b4c] transition-colors duration-200 hover:bg-[#e9e2d8]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="min-w-32.5 rounded-md bg-[#4a3b66] px-4 py-2.5 text-base font-medium text-white transition-colors duration-200 hover:bg-[#43375d] disabled:opacity-60"
            >
              {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}