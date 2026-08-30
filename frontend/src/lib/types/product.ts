export interface Product {
  id: number;
  name: string;
  genericName: string;
  price: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export type SortBy = "name" | "genericName" | "category" | "price";
export type SortOrder = "asc" | "desc";

export interface CreateProductPayload {
  name: string;
  genericName: string;
  price: number;
  category: Category;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type Category =
  | "ANALGESICS"
  | "ANTIBIOTICS"
  | "ANTIHISTAMINES"
  | "VITAMINS"
  | "SUPPLEMENTS"
  | "ANTACIDS"
  | "HYGIENE"
  | "OTHERS";
