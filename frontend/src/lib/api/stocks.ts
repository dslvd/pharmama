import { CreateStockPayload, Stock, UpdateStockPayload } from "../types/stock";
import { apiFetch } from "../utils/client";

export const getStock = (id: string) => apiFetch<Stock>(`/stock/${id}`);

export const getStockList = () => {
  return apiFetch<Stock[]>(`/stock`);
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
