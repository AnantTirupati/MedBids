import { Medication } from "./prescription-item";

export enum OfferStatus {
  OPEN = "open",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
  FULFILLED = "fulfilled",
}

export interface Offer {
  id: string;
  bid_id: string;
  auction_id: string;
  prescription_id: string;
  patient_id: string;
  pharmacy_id: string;
  pharmacy_name: string;
  pharmacy_avatar: string | null;
  pharmacy_rating: number;
  amount: number;
  delivery_time: string;
  medications: Medication[];
  status: OfferStatus;
  accepted_at: string | null;
  fulfilled_at: string | null;
  created_at: string;
}
