import { User, UserRole } from "./user";

export enum VerificationStatus {
  PENDING = "pending",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface Pharmacy extends User {
  role: UserRole.PHARMACY;
  pharmacy_name: string;
  license_number: string;
  license_expiry: string;
  gst_number: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  verification_status: VerificationStatus;
  rating: number;
  total_bids: number;
  successful_bids: number;
  response_time_avg: string;
  established_year: number;
}
