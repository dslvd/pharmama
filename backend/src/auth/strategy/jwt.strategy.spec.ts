import { JwtStrategy } from "./jwt.strategy";

describe("JwtStrategy", () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  it("maps the token payload to id, email and role", async () => {
    const strategy = new JwtStrategy();

    await expect(
      strategy.validate({ sub: 7, email: "owner@pharmama.com", role: "OWNER" }),
    ).resolves.toEqual({
      id: 7,
      email: "owner@pharmama.com",
      role: "OWNER",
    });
  });

  it("refuses to start without a configured secret", () => {
    delete process.env.JWT_SECRET;

    expect(() => new JwtStrategy()).toThrow("JWT_SECRET is not set");

    process.env.JWT_SECRET = "test-secret";
  });
});
