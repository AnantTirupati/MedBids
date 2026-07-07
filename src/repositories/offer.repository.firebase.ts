import { OfferRepository } from "./interfaces/offer.repository";
import { db, createConverter } from "@/lib/firebase/firestore";
import { Collections } from "@/constants/firestore";
import { Offer } from "@/types";
import { doc, getDoc, getDocs, collection, setDoc, query, where, onSnapshot } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

export const offerRepositoryFirebase: OfferRepository = {
  async getOffers(): Promise<Offer[]> {
    try {
      const colRef = collection(db, Collections.OFFERS).withConverter(createConverter<Offer>());
      const snap = await getDocs(colRef);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async getOfferById(id: string): Promise<Offer | null> {
    try {
      const docRef = doc(db, Collections.OFFERS, id).withConverter(createConverter<Offer>());
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async createOffer(offer: Offer): Promise<Offer> {
    try {
      const docRef = doc(db, Collections.OFFERS, offer.id).withConverter(createConverter<Offer>());
      await setDoc(docRef, offer);
      return offer;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async updateOffer(offer: Offer): Promise<Offer> {
    try {
      const docRef = doc(db, Collections.OFFERS, offer.id).withConverter(createConverter<Offer>());
      await setDoc(docRef, offer, { merge: true });
      return offer;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  subscribeOffersByPatientId(patientId: string, callback: (offers: Offer[]) => void): () => void {
    const colRef = collection(db, Collections.OFFERS).withConverter(createConverter<Offer>());
    const q = query(colRef, where("patient_id", "==", patientId));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => d.data()));
    });
  },

  subscribeOffersByPharmacyId(pharmacyId: string, callback: (offers: Offer[]) => void): () => void {
    const colRef = collection(db, Collections.OFFERS).withConverter(createConverter<Offer>());
    const q = query(colRef, where("pharmacy_id", "==", pharmacyId));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => d.data()));
    });
  },
};

export default offerRepositoryFirebase;
