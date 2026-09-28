import { CreateUserInput, User } from "../types/users";
import { apiFetch } from "../utils/client";

export const createUser = (input: CreateUserInput) =>
  apiFetch<User>("/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
