export const ROLE_PERMISSIONS = {
  patient: [
    "view:own_prescriptions",
    "create:prescriptions",
    "view:bids_on_own_prescriptions",
    "accept:offers",
    "view:own_reservations",
  ],
  pharmacy: [
    "view:available_auctions",
    "create:bids",
    "update:own_bids",
    "view:own_bids",
    "view:own_wins",
  ],
  admin: [
    "view:all_users",
    "view:all_pharmacies",
    "moderate:prescriptions",
    "verify:pharmacies",
    "view:all_auctions",
    "update:platform_settings",
  ],
};

export type Role = keyof typeof ROLE_PERMISSIONS;

export function hasPermission(role: Role, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}
