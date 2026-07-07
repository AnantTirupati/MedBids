import { ModerationRepository } from "./interfaces/moderation.repository";
import { Prescription } from "@/types";
import { db, createConverter } from "@/lib/firebase/firestore";
import { Collections } from "@/constants/firestore";
import { doc, getDocs, collection, setDoc, onSnapshot } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

export const moderationRepositoryFirebase: ModerationRepository = {
  async getPrescriptions(): Promise<Prescription[]> {
    try {
      const colRef = collection(db, Collections.PRESCRIPTIONS).withConverter(createConverter<Prescription>());
      const snap = await getDocs(colRef);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async updatePrescription(rx: Prescription): Promise<Prescription> {
    try {
      const docRef = doc(db, Collections.PRESCRIPTIONS, rx.id).withConverter(createConverter<Prescription>());
      await setDoc(docRef, rx, { merge: true });
      return rx;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  subscribePrescriptions(callback: (rxList: Prescription[]) => void): () => void {
    const colRef = collection(db, Collections.PRESCRIPTIONS).withConverter(createConverter<Prescription>());
    return onSnapshot(colRef, (snap) => {
      callback(snap.docs.map((d) => d.data()));
    });
  },
};

export default moderationRepositoryFirebase;
