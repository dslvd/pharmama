import {
  CreateStockPayload,
  GetStListParams,
  Stock,
  UpdateStockPayload,
} from "../types/stock";
import { apiFetch } from "../utils/client";

export const searchStock = (query: string) =>
  apiFetch<Stock[]>(`/stock/search?query=${encodeURIComponent(query)}`);

export const getStock = (id: string) => apiFetch<Stock>(`/stock/${id}`);

export const getStockList = ({ sortBy, order }: GetStListParams = {}) => {
  const params = new URLSearchParams();
  if (sortBy) params.set("sortBy", sortBy);
  if (order) params.set("order", order);

  const query = params.toString();
  return apiFetch<Stock[]>(`/stock${query ? `?${query}` : ""}`);
};

export const createStock = (data: CreateStockPayload) =>
  apiFetch<Stock>("/stock", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateStock = (id: number, body: UpdateStockPayload) =>
  apiFetch<Stock>(`/stock/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const deleteStock = (id: number) =>
  apiFetch<Stock>(`/stock/${id}`, {
    method: "DELETE",
  });
