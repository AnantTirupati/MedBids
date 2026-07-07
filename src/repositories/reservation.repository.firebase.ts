import { ReservationRepository } from "./interfaces/reservation.repository";
import { db, createConverter } from "@/lib/firebase/firestore";
import { Collections } from "@/constants/firestore";
import { Reservation } from "@/types";
import { doc, getDocs, collection, setDoc, query, where, onSnapshot } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

export const reservationRepositoryFirebase: ReservationRepository = {
  async getReservations(): Promise<Reservation[]> {
    try {
      const colRef = collection(db, Collections.RESERVATIONS).withConverter(createConverter<Reservation>());
      const snap = await getDocs(colRef);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async createReservation(reservation: Reservation): Promise<Reservation> {
    try {
      const docRef = doc(db, Collections.RESERVATIONS, reservation.id).withConverter(createConverter<Reservation>());
      await setDoc(docRef, reservation);
      return reservation;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  subscribeReservationsByPharmacyId(pharmacyId: string, callback: (res: Reservation[]) => void): () => void {
    const colRef = collection(db, Collections.RESERVATIONS).withConverter(createConverter<Reservation>());
    const q = query(colRef, where("pharmacy_id", "==", pharmacyId));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => d.data()));
    });
  },
};

export default reservationRepositoryFirebase;
