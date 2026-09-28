import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Role } from "src/generated/prisma/enums";
import { ok } from "src/util/results.util";

describe("AuthController", () => {
  let controller: AuthController;

  const authServiceMock = { login: jest.fn(), me: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("looks up the authenticated user by id for /auth/me", async () => {
    const safeUser = {
      id: 7,
      name: "Owner",
      email: "owner@pharmama.com",
      role: Role.OWNER,
    };
    authServiceMock.me.mockResolvedValue(ok(safeUser));

    await expect(
      controller.me({ id: 7, email: "owner@pharmama.com", role: Role.OWNER }),
    ).resolves.toEqual(safeUser);
    expect(authServiceMock.me).toHaveBeenCalledWith(7);
  });
});
