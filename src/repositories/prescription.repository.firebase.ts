import { PrescriptionRepository } from "./interfaces/prescription.repository";
import { db, createConverter } from "@/lib/firebase/firestore";
import { Collections } from "@/constants/firestore";
import { Prescription } from "@/types";
import { doc, getDoc, getDocs, collection, setDoc, query, where } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

export const prescriptionRepositoryFirebase: PrescriptionRepository = {
  async getPrescriptions(patientId?: string): Promise<Prescription[]> {
    try {
      const colRef = collection(db, Collections.PRESCRIPTIONS).withConverter(createConverter<Prescription>());
      let q = query(colRef);
      if (patientId) {
        q = query(colRef, where("patient_id", "==", patientId));
      }
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async getPrescriptionById(id: string): Promise<Prescription | null> {
    try {
      const docRef = doc(db, Collections.PRESCRIPTIONS, id).withConverter(createConverter<Prescription>());
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async createPrescription(prescription: Prescription): Promise<Prescription> {
    try {
      const docRef = doc(db, Collections.PRESCRIPTIONS, prescription.id).withConverter(createConverter<Prescription>());
      await setDoc(docRef, prescription);
      return prescription;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async updatePrescription(prescription: Prescription): Promise<Prescription> {
    try {
      const docRef = doc(db, Collections.PRESCRIPTIONS, prescription.id).withConverter(createConverter<Prescription>());
      await setDoc(docRef, prescription, { merge: true });
      return prescription;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },
};

export default prescriptionRepositoryFirebase;
