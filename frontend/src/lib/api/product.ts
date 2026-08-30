import {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from "../types/product";
import { apiFetch } from "../utils/client";

export const getProduct = (id: number) => apiFetch<Product>(`/product/${id}`);

export const getProductList = () => {
  return apiFetch<Product[]>(`/product`);
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
