import { User } from "./user";

export interface Patient extends User {
  role: UserRole.PATIENT;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  membership_tier: "free" | "premium";
  total_savings: number;
}

import { UserRole } from "./user";
export { UserRole };
