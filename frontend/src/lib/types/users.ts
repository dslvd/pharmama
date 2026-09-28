// safe user fields returned by the backend (/auth/me, transaction.user, ...)
export interface User {
  id: number;
  name: string;
  email: string;
  role: Roles;
}

export type Roles = "OWNER" | "ADMIN" | "STAFF";

// ADMIN accounts can't be created through the API
export type CreateUserInput = {
  email: string;
  password: string;
  role?: Exclude<Roles, "ADMIN">;
  name: string;
};
