import { SetMetadata } from "@nestjs/common";
import { ERole } from "../../auth/enums/role.enum";

export const ROLES_KEY = "roles";
export const AllowRoles = (...roles: ERole[]) => SetMetadata("roles", roles);
