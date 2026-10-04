import { UnauthorizedException } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { UsersService } from "../../users/users.service";

describe("JwtStrategy", () => {
  const originalSecret = process.env.JWT_SECRET;
  const usersService = { findActiveSafeById: jest.fn() };
  const payload = { sub: 7, email: "owner@pharmama.com", role: "OWNER" };

  const makeStrategy = () =>
    new JwtStrategy(usersService as unknown as UsersService);

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("uses the user's current role from the database", async () => {
    usersService.findActiveSafeById.mockResolvedValue({
      id: 7,
      name: "Owner",
      email: "owner@pharmama.com",
      role: "STAFF",
    });

    await expect(makeStrategy().validate(payload)).resolves.toEqual({
      id: 7,
      email: "owner@pharmama.com",
      role: "STAFF",
    });
    expect(usersService.findActiveSafeById).toHaveBeenCalledWith(7);
  });

  it("rejects a deactivated or deleted user", async () => {
    usersService.findActiveSafeById.mockResolvedValue(null);

    await expect(makeStrategy().validate(payload)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("refuses to start without a configured secret", () => {
    delete process.env.JWT_SECRET;

    expect(() => makeStrategy()).toThrow("JWT_SECRET is not set");

    process.env.JWT_SECRET = "test-secret";
  });
});
