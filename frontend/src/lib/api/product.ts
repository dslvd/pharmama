import {
  CreateProductPayload,
  GetPrListParams,
  Product,
  UpdateProductPayload,
} from "../types/product";
import { apiFetch } from "../utils/client";

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

export const deleteProduct = (id: number) =>
  apiFetch<Product>(`/product/${id}`, {
    method: "DELETE",
  });
