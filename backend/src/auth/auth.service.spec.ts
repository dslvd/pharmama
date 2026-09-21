import { Test, TestingModule } from "@nestjs/testing";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { PrismaService } from "../prisma/prisma.service";
import { Role } from "src/generated/prisma/enums";

describe("AuthService", () => {
  let service: AuthService;
  let jwt: JwtService;

  const prismaMock = {
    user: { findUnique: jest.fn(), create: jest.fn() },
  };

  const owner = {
    id: 7,
    email: "owner@pharmama.com",
    role: Role.OWNER,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: "test-secret",
          signOptions: { expiresIn: "1d" },
        }),
      ],
      providers: [
        AuthService,
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwt = module.get<JwtService>(JwtService);
  });

  it("returns the signed-in user alongside the token", async () => {
    const result = (await service.login(owner)) as {
      access_token: string;
      user?: unknown;
    };

    expect(result.user).toEqual({
      id: 7,
      email: "owner@pharmama.com",
      role: "OWNER",
    });
  });

  it("signs a token carrying the user id, email and role", async () => {
    const { access_token } = await service.login(owner);

    expect(jwt.verify(access_token)).toMatchObject({
      sub: 7,
      email: "owner@pharmama.com",
      role: "OWNER",
    });
  });
});
