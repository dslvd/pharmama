import { CreateStockPayload, GetStListParams, Stock } from "../types/stock";
import { apiFetch } from "../utils/client";

export const searchStock = (query: string) =>
  apiFetch<Stock[]>(`/stock/search?query=${encodeURIComponent(query)}`);

export const getStock = (id: string) => apiFetch<Stock>(`/stock/${id}`);

export const getStockList = ({ category, order }: GetStListParams = {}) => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (order) params.set("order", order);

  const query = params.toString();
  return apiFetch<Stock[]>(`/stock${query ? `?${query}` : ""}`);
};

export const createStock = (data: CreateStockPayload) =>
  apiFetch<Stock>("/stock", {
    method: "POST",
    body: JSON.stringify(data),
  });
