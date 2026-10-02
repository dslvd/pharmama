import { CreateStockPayload, Stock, UpdateStockPayload } from "../types/stock";
import { apiFetch } from "../utils/client";
import { mapResult, toStock } from "../utils/decimal";

export const getStockList = async () =>
  mapResult(await apiFetch<Stock[]>(`/stock`), (list) => list.map(toStock));

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
