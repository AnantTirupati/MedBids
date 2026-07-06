import { ROLE_PERMISSIONS, Role } from "@/constants/permissions";

export function checkPermission(role: Role | string, permission: string): boolean {
  const normalizedRole = role.toLowerCase() as Role;
  return ROLE_PERMISSIONS[normalizedRole]?.includes(permission) || false;
}
export default checkPermission;
