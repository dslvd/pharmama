export interface Product {
  id: number;
  name: string;
  genericName: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  genericName: string;
  price: number;
  category: Category;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type SortOrder = "asc" | "desc";

export interface GetPrListParams {
  category?: string;
  order?: SortOrder;
}

export type Category =
  | "ANALGESICS"
  | "ANTIBIOTICS"
  | "ANTIHISTAMINES"
  | "VITAMINS"
  | "SUPPLEMENTS"
  | "ANTACIDS"
  | "HYGIENNE"
  | "OTHERS";
