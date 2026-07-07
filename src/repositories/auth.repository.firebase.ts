import { AuthRepository } from "./interfaces/auth.repository";
import { db, createConverter } from "@/lib/firebase/firestore";
import { Collections } from "@/constants/firestore";
import { Patient, Pharmacy } from "@/types";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { auth } from "@/lib/firebase/auth";
import {
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  ConfirmationResult,
  User as FirebaseUser,
  RecaptchaVerifier,
} from "firebase/auth";
import { mapFirebaseError } from "@/lib/firebase/errors";

let activeConfirmationResult: ConfirmationResult | null = null;

export const authRepositoryFirebase: AuthRepository = {
  async getUserByPhone(phone: string): Promise<Patient | Pharmacy | null> {
    try {
      const cleanedPhone = phone.replace(/\D/g, "");
      if (!cleanedPhone) return null;

      // Search in patients (users collection)
      const patientsRef = collection(db, Collections.USERS).withConverter(createConverter<Patient>());
      const qPatient = query(patientsRef, where("phone", "==", phone), limit(1));
      const snapPatient = await getDocs(qPatient);
      if (!snapPatient.empty) {
        return snapPatient.docs[0].data();
      }

      // Search in pharmacies
      const pharmaciesRef = collection(db, Collections.PHARMACIES).withConverter(createConverter<Pharmacy>());
      const qPharmacy = query(pharmaciesRef, where("phone", "==", phone), limit(1));
      const snapPharmacy = await getDocs(qPharmacy);
      if (!snapPharmacy.empty) {
        return snapPharmacy.docs[0].data();
      }

      return null;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async sendOtp(phone: string, containerId: string): Promise<boolean> {
    try {
      let formattedPhone = phone;
      if (!phone.startsWith("+")) {
        const digits = phone.replace(/\D/g, "");
        if (digits.length === 10) {
          formattedPhone = `+91${digits}`;
        } else {
          formattedPhone = `+${digits}`;
        }
      }

      // Check if we already have an app verifier instance or create it
      // Standard reCAPTCHA verifier initialization on client
      const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: "invisible",
      });

      activeConfirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      return true;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async verifyOtp(code: string): Promise<FirebaseUser> {
    try {
      if (!activeConfirmationResult) {
        throw new Error("No verification code has been sent yet. Please request OTP first.");
      }
      const userCredential = await activeConfirmationResult.confirm(code);
      if (!userCredential.user) {
        throw new Error("OTP verification succeeded but no user session was returned.");
      }
      return userCredential.user;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      activeConfirmationResult = null;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, callback);
  },
};

export default authRepositoryFirebase;
