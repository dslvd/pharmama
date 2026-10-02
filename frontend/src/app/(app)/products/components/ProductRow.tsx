import { Trash, PencilLine } from "lucide-react";
import { Product } from "@/lib/types/product";
import { useState } from "react";
import { deleteProduct } from "@/lib/api/product";
import ConfirmDialog from "@/components/ConfirmDialog";
import { peso } from "@/lib/utils/format";

interface ProductRowProps {
  product: Product;
  onDeleted?: (id: number) => void;
  onEdit?: (product: Product) => void;
  onError?: (message: string) => void;
}

export default function ProductRow({
  product,
  onDeleted,
  onEdit,
  onError,
}: ProductRowProps) {
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleDelete(id: number) {
    setDeleting(true);
    const result = await deleteProduct(id);
    setDeleting(false);
    setConfirmOpen(false);

    if (result.ok) {
      onDeleted?.(id);
    } else {
      onError?.(result.error);
    }
  }

  return (
    <>
      <tr className="border-t border-border odd:bg-card even:bg-violet-50/60">
        <td className="px-4 py-3 text-foreground">{product.name}</td>
        <td className="px-4 py-3 text-muted-foreground">
          {product.genericName}
        </td>
        <td className="px-4 py-3">
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
            {product.category}
          </span>
        </td>
        <td className="px-4 py-3 font-medium text-foreground">
          {peso(product.price)}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3 text-muted-foreground">
            <button
              aria-label={`Edit product ${product.id}`}
              onClick={() => onEdit?.(product)}
              className="transition-colors hover:text-violet-700"
            >
              <PencilLine size={15} />
            </button>

            <button
              aria-label={`Delete product ${product.id}`}
              onClick={() => setConfirmOpen(true)}
              disabled={deleting}
              className="transition-colors hover:text-rose-600 disabled:opacity-50"
            >
              <Trash size={15} />
            </button>
          </div>
        </td>
      </tr>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete product?"
        message={`${product.name} will be removed from the catalog. This can't be undone.`}
        busy={deleting}
        onConfirm={() => handleDelete(product.id)}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
