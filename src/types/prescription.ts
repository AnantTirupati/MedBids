import { Medication } from "./prescription-item";

export enum PrescriptionStatus {
  PENDING_VERIFICATION = "pending_verification",
  VERIFIED = "verified",
  AUCTION_LIVE = "auction_live",
  AUCTION_ENDED = "auction_ended",
  OFFER_ACCEPTED = "offer_accepted",
  FULFILLED = "fulfilled",
  EXPIRED = "expired",
  REJECTED = "rejected",
}

export interface Prescription {
  id: string;
  patient_id: string;
  patient_name: string;
  status: PrescriptionStatus;
  medications: Medication[];
  prescription_image_url: string | null;
  doctor_name: string | null;
  hospital_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  verified_at: string | null;
  verified_by: string | null;
  auction_id: string | null;
}
