import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";
import { Role } from "src/generated/prisma/enums";

describe("UsersService", () => {
  let service: UsersService;

  // Stands in for the database: echoes back the row it was asked to create,
  // applying the schema's STAFF default when no role is supplied.
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(({ data }) =>
        Promise.resolve({
          id: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          role: Role.STAFF,
          ...data,
        }),
      ),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    prismaMock.user.findUnique.mockResolvedValue(null);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  const dto = {
    name: "Nelson",
    email: "nelson@pharmama.com",
    password: "supersecret",
  };

  it("creates the user with the requested role", async () => {
    const user = await service.create({ ...dto, role: Role.ADMIN });

    expect(user.role).toBe("ADMIN");
  });

  it("falls back to STAFF when no role is requested", async () => {
    const user = await service.create(dto);

    expect(user.role).toBe("STAFF");
  });

  it("never returns the password hash", async () => {
    const user = await service.create({ ...dto, role: Role.OWNER });

    expect(user).not.toHaveProperty("hashedPassword");
  });

  it("rejects an email that is already taken", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 1, ...dto });

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });
});
