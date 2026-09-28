import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./users.validation";
import { safeUserSelect } from "./users.select";
import { ensureEmailFree, toSafeUser } from "./users.domain";
import { DomainError } from "src/util/domain-error";
import { andThenAsync, AsyncResult, ok } from "src/util/results.util";
import { User } from "src/generated/prisma/client";

type SafeUser = Omit<User, "hashedPassword">;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findActiveSafeById(id: number) {
    return this.prisma.user.findFirst({
      where: { id, isActive: true },
      select: safeUserSelect,
    });
  }

  create(dto: CreateUserDto): AsyncResult<SafeUser, DomainError> {
    return this.findByEmail(dto.email)
      .then(ensureEmailFree)
      .then(andThenAsync(() => bcrypt.hash(dto.password, 10).then(ok)))
      .then(
        andThenAsync((hashedPassword) =>
          this.prisma.user
            .create({
              data: {
                name: dto.name,
                email: dto.email,
                hashedPassword,
                ...(dto.role && { role: dto.role }),
              },
            })
            .then(toSafeUser)
            .then(ok),
        ),
      );
  }
}
