import { apiFetch } from "../utils/client";

interface Product {
  id: number;
  name: string;
  genericName: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateProductPayload {
  name: string;
  genericName: string;
  price: number;
  category: string;
}

type UpdateProductPayload = Partial<CreateProductPayload>;

export const searchProduct = (query: string) =>
  apiFetch<Product[]>(`/product/search?query=${encodeURIComponent(query)}`);

export const getProduct = (id: string) => apiFetch<Product>(`/product/${id}`);

export const getProductList = ({ category, order }: GetPrListParams = {}) => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (order) params.set("order", order);

  const query = params.toString();
  return apiFetch<Product[]>(`/product${query ? `?${query}` : ""}`);
};

export const createProduct = (data: CreateProductPayload) =>
  apiFetch<Product>("/product", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateProduct = (id: number, data: UpdateProductPayload) =>
  apiFetch<Product>(`/product/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export type SortOrder = "asc" | "desc";

interface GetPrListParams {
  category?: string;
  order?: SortOrder;
}
