import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesGuard } from "./roles.guard";
import { Roles } from "../decorator/auth.decorator";
import { Role } from "src/generated/prisma/enums";

@Roles(Role.OWNER)
class OwnerController {
  @Roles(Role.STAFF)
  staffRoute() {}

  ownerRoute() {}
}

class PlainController {
  openRoute() {}
}

const contextFor = (
  controller: new () => object,
  handler: () => void,
  role: Role,
) =>
  ({
    getHandler: () => handler,
    getClass: () => controller,
    switchToHttp: () => ({ getRequest: () => ({ user: { role } }) }),
  }) as unknown as ExecutionContext;

describe("RolesGuard", () => {
  const guard = new RolesGuard(new Reflector());
  const owner = OwnerController.prototype;

  it("allows a role listed on the method", () => {
    expect(
      guard.canActivate(
        contextFor(OwnerController, owner.staffRoute, Role.STAFF),
      ),
    ).toBe(true);
  });

  it("denies a role not listed on the method, even if the class allows it", () => {
    expect(
      guard.canActivate(
        contextFor(OwnerController, owner.staffRoute, Role.OWNER),
      ),
    ).toBe(false);
  });

  it("falls back to the controller's roles when the method has none", () => {
    expect(
      guard.canActivate(
        contextFor(OwnerController, owner.ownerRoute, Role.OWNER),
      ),
    ).toBe(true);
    expect(
      guard.canActivate(
        contextFor(OwnerController, owner.ownerRoute, Role.STAFF),
      ),
    ).toBe(false);
  });

  it("denies a route with no @Roles at all", () => {
    expect(
      guard.canActivate(
        contextFor(
          PlainController,
          PlainController.prototype.openRoute,
          Role.ADMIN,
        ),
      ),
    ).toBe(false);
  });
});
