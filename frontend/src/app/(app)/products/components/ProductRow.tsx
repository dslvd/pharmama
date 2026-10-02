import { Trash, PencilLine } from "lucide-react";
import { Product } from "@/lib/types/product";
import { useState } from "react";
import { deleteProduct } from "@/lib/api/product";
import ConfirmDialog from "@/components/ConfirmDialog";
import { peso, titleCase } from "@/lib/utils/format";
import { Badge, Td, Tr } from "@/components/ui/table";

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
      <Tr>
        <Td>
          <p className="font-medium">{product.name}</p>
          <p className="text-xs text-muted-foreground">
            {product.genericName}
          </p>
        </Td>
        <Td>
          <Badge className="bg-secondary/60 text-secondary-foreground">
            {titleCase(product.category)}
          </Badge>
        </Td>
        <Td numeric className="font-medium">
          {peso(product.price)}
        </Td>
        <Td align="right">
          <div className="flex items-center justify-end gap-1 text-muted-foreground">
            <button
              aria-label={`Edit ${product.name}`}
              onClick={() => onEdit?.(product)}
              className="rounded-md p-2 transition-colors hover:bg-primary-soft hover:text-primary"
            >
              <PencilLine size={16} />
            </button>
            <button
              aria-label={`Delete ${product.name}`}
              onClick={() => setConfirmOpen(true)}
              disabled={deleting}
              className="rounded-md p-2 transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-50"
            >
              <Trash size={16} />
            </button>
          </div>
        </Td>
      </Tr>
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
