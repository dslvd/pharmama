import { CreateUserInput, UserDto } from "../types/users";
import { apiFetch } from "../utils/client";

export const createUser = (input: CreateUserInput) =>
  apiFetch<UserDto>("/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
