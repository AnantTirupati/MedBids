import { Reservation } from "@/types";

export interface ReservationRepository {
  getReservations(): Promise<Reservation[]>;
  createReservation(reservation: Reservation): Promise<Reservation>;
  subscribeReservationsByPharmacyId(pharmacyId: string, callback: (res: Reservation[]) => void): () => void;
}
