import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./users.validation";
import { safeUserSelect } from "./users.select";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findActiveSafeById(id: number) {
    return this.prisma.user.findFirst({
      where: { id, isActive: true },
      select: safeUserSelect,
    });
  }

  async create(dto: CreateUserDto) {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new ConflictException("Email already in use");

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        hashedPassword,
        role: dto.role,
      },
    });

    const { hashedPassword: _, ...safeUser } = user;
    return safeUser;
  }
}
