export enum UserRole {
  PATIENT = "patient",
  PHARMACY = "pharmacy",
  ADMIN = "admin",
}

export interface User {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}
