import { Reservation, ReservationStatus } from "@/types";

export const mockReservations: Reservation[] = [
  {
    id: "res1",
    offer_id: "o2",
    patient_id: "p1",
    pharmacy_id: "pharm2",
    status: ReservationStatus.COMPLETED,
    pickup_code: "5671",
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  }
];
