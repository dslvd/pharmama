import { apiFetch } from "../utils/client";

export const getSalesOverview = (period: "Today" | "Week" | "Month" | "Year") =>
  apiFetch<{ label: string; value: number }[]>(
    `/sales/overview?period=${encodeURIComponent(period)}`,
  );
