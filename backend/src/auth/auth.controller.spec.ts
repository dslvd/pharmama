import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Role } from "src/generated/prisma/enums";

describe("AuthController", () => {
  let controller: AuthController;

  const authServiceMock = { login: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("exposes the authenticated user as id, email and role", () => {
    const req = {
      user: { id: 7, email: "owner@pharmama.com", role: Role.OWNER },
    };

    expect(controller.me(req)).toEqual({
      id: 7,
      email: "owner@pharmama.com",
      role: "OWNER",
    });
  });
});
