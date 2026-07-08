import { Patient, Pharmacy } from "@/types";
import { User as FirebaseUser } from "firebase/auth";

export interface AuthRepository {
  getUserByPhone(phone: string): Promise<Patient | Pharmacy | null>;
  sendOtp(phone: string, containerId: string): Promise<boolean>;
  verifyOtp(code: string): Promise<FirebaseUser>;
  signOut(): Promise<void>;
  getCurrentUser(): FirebaseUser | null;
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void;
  signInWithEmail(email: string, password: string): Promise<FirebaseUser>;
  signUpWithEmail(email: string, password: string): Promise<FirebaseUser>;
  signInWithGoogle(): Promise<FirebaseUser>;
  sendPasswordReset(email: string): Promise<void>;
  sendEmailVerification(user: FirebaseUser): Promise<void>;
}
