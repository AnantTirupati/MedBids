import { PatientRepository } from "./interfaces/patient.repository";
import { db, createConverter } from "@/lib/firebase/firestore";
import { Collections } from "@/constants/firestore";
import { Patient, ActivityItem } from "@/types";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

export const patientRepositoryFirebase: PatientRepository = {
  async getPatientById(id: string): Promise<Patient | null> {
    try {
      const docRef = doc(db, Collections.USERS, id).withConverter(createConverter<Patient>());
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async getPatients(): Promise<Patient[]> {
    try {
      const colRef = collection(db, Collections.USERS).withConverter(createConverter<Patient>());
      const snap = await getDocs(colRef);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async getTimelineEvents(patientId: string): Promise<ActivityItem[]> {
    try {
      // In Firebase production timeline events can be queried from notifications/activity collection
      const colRef = collection(db, Collections.NOTIFICATIONS).withConverter(createConverter<ActivityItem>());
      const q = query(colRef, where("patient_id", "==", patientId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },
};

export default patientRepositoryFirebase;
