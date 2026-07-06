export enum ReservationStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Reservation {
  id: string;
  offer_id: string;
  patient_id: string;
  pharmacy_id: string;
  status: ReservationStatus;
  pickup_code: string;
  created_at: string;
  updated_at: string;
}
