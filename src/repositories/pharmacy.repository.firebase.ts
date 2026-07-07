import { PharmacyRepository } from "./interfaces/pharmacy.repository";
import { db, createConverter } from "@/lib/firebase/firestore";
import { Collections } from "@/constants/firestore";
import { Pharmacy } from "@/types";
import { doc, getDoc, getDocs, collection, setDoc } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

export const pharmacyRepositoryFirebase: PharmacyRepository = {
  async getPharmacyById(id: string): Promise<Pharmacy | null> {
    try {
      const docRef = doc(db, Collections.PHARMACIES, id).withConverter(createConverter<Pharmacy>());
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async getPharmacies(): Promise<Pharmacy[]> {
    try {
      const colRef = collection(db, Collections.PHARMACIES).withConverter(createConverter<Pharmacy>());
      const snap = await getDocs(colRef);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async updatePharmacy(pharmacy: Pharmacy): Promise<Pharmacy> {
    try {
      const docRef = doc(db, Collections.PHARMACIES, pharmacy.id).withConverter(createConverter<Pharmacy>());
      await setDoc(docRef, pharmacy, { merge: true });
      return pharmacy;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },
};

export default pharmacyRepositoryFirebase;
