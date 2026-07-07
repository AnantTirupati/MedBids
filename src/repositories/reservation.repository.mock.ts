import { ReservationRepository } from "./interfaces/reservation.repository";
import { mockReservations } from "@/lib/mock-data";
import { Reservation } from "@/types";

const pharmacyListeners: Map<string, Set<(res: Reservation[]) => void>> = new Map();

function notifyReservationListeners(pharmacyId: string) {
  const sets = pharmacyListeners.get(pharmacyId);
  if (sets) {
    sets.forEach((cb) => cb(mockReservations.filter((r) => r.pharmacy_id === pharmacyId).map((r) => ({ ...r }))));
  }
}

export const reservationRepositoryMock: ReservationRepository = {
  async getReservations(): Promise<Reservation[]> {
    return mockReservations;
  },

  async createReservation(reservation: Reservation): Promise<Reservation> {
    mockReservations.push(reservation);
    notifyReservationListeners(reservation.pharmacy_id);
    return reservation;
  },

  subscribeReservationsByPharmacyId(pharmacyId: string, callback: (res: Reservation[]) => void): () => void {
    if (!pharmacyListeners.has(pharmacyId)) {
      pharmacyListeners.set(pharmacyId, new Set());
    }
    pharmacyListeners.get(pharmacyId)!.add(callback);
    callback(mockReservations.filter((r) => r.pharmacy_id === pharmacyId));
    return () => {
      const sets = pharmacyListeners.get(pharmacyId);
      if (sets) {
        sets.delete(callback);
        if (sets.size === 0) {
          pharmacyListeners.delete(pharmacyId);
        }
      }
    };
  },
};

export default reservationRepositoryMock;
