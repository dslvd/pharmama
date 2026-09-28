import {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from "../types/product";
import { apiFetch } from "../utils/client";
import { mapResult, toProduct } from "../utils/decimal";

export const getProductList = async (_params?: Record<string, unknown>) =>
  mapResult(await apiFetch<Product[]>(`/product`), (list) =>
    list.map(toProduct),
  );

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
