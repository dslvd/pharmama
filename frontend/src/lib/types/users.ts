export interface User {
  id: string;
  email: string;
  role: Roles;
}

export type Roles = "OWNER" | "ADMIN" | "STAFF";

export type CreateUserInput = {
  email: string;
  password: string;
  role: Roles;
  name: string;
};
export type UserDto = { id: string; email: string; role: Roles };
