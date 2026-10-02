// safe user fields returned by the backend (/auth/me, transaction.user, ...)
export interface User {
  id: number;
  name: string;
  email: string;
  role: Roles;
}

export type Roles = "OWNER" | "ADMIN" | "STAFF";
