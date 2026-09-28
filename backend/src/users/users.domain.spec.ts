import { ensureEmailFree, toSafeUser } from "./users.domain";

describe("users.domain", () => {
  it("ensureEmailFree rejects a taken email", () => {
    expect(ensureEmailFree(null).ok).toBe(true);
    expect(ensureEmailFree({ id: 1 })).toEqual({
      ok: false,
      error: { kind: "Conflict", message: "Email already in use." },
    });
  });

  it("toSafeUser drops the password hash and keeps the rest", () => {
    expect(
      toSafeUser({ id: 1, email: "a@b.c", hashedPassword: "secret" }),
    ).toEqual({ id: 1, email: "a@b.c" });
  });
});
