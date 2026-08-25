import { getProductList } from "@/lib/api/product";
import { Product } from "@/lib/types/product";
import { useEffect, useState } from "react";

interface ProductModalProps {
  onSelect: (pr: Product) => void;
  onClose: () => void;
}

export default function ProductModal({ onSelect, onClose }: ProductModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const result = await getProductList();

      if (result.ok) {
        setProducts(result.value);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
    loadProduct();
  }, []);

  const handleClick = (pr: Product) => {
    onSelect(pr);
    onClose();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section>
      {products.map((pr) => (
        <div key={pr.id} onClick={() => handleClick(pr)}>
          {pr.name}
        </div>
      ))}
    </section>
  );
}
