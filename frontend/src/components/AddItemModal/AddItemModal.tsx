"use client";

import { useState } from "react";
import { createProduct } from "@/lib/api/product";
import { Category } from "@/lib/types/product";
import Modal from "@/components/ui/Modal";
import CategoryDropdown from "@/components/CategoryDropdown";

interface AddItemModalProps {
  onClose: () => void;
  onSaved: () => void;
}

interface FormErrors {
  name?: string;
  genericName?: string;
  price?: string;
  category?: string;
}

const inputClasses =
  "mt-1.5 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20";
const labelClasses = "block text-sm font-medium text-foreground";

export default function AddItemModal({ onClose, onSaved }: AddItemModalProps) {
  const [name, setName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Category>("OTHERS");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    setSaving(true);
    const result = await createProduct({
      name,
      genericName,
      price: Number(price),
      category,
    });

    if (result.ok) {
      onSaved();
      onClose();
    } else {
      setServerError(result.error);
    }
    setSaving(false);
  }

  return (
    <Modal open onClose={onClose} title="Add Item" size="md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className={labelClasses}>
          Product Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${inputClasses} ${errors.name ? "border-destructive" : ""}`}
          />
          {errors.name && (
            <span className="mt-1.5 block text-xs text-destructive">{errors.name}</span>
          )}
        </label>

        <label className={labelClasses}>
          Generic Name
          <input
            type="text"
            value={genericName}
            onChange={(e) => setGenericName(e.target.value)}
            className={`${inputClasses} ${errors.genericName ? "border-destructive" : ""}`}
          />
          {errors.genericName && (
            <span className="mt-1.5 block text-xs text-destructive">{errors.genericName}</span>
          )}
        </label>

        <label className={labelClasses}>
          Category
          <CategoryDropdown
            value={category}
            onChange={setCategory}
            open={isCategoryOpen}
            onOpenChange={setIsCategoryOpen}
            error={errors.category}
          />
          {errors.category && (
            <span className="mt-1.5 block text-xs text-destructive">{errors.category}</span>
          )}
        </label>

        <label className={labelClasses}>
          Price
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`${inputClasses} ${errors.price ? "border-destructive" : ""}`}
          />
          {errors.price && (
            <span className="mt-1.5 block text-xs text-destructive">{errors.price}</span>
          )}
        </label>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
