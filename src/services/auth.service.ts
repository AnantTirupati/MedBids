import { authRepository } from "@/repositories";
import { User as FirebaseUser } from "firebase/auth";

export const authService = {
  async sendOtp(phone: string, containerId: string): Promise<boolean> {
    return authRepository.sendOtp(phone, containerId);
  },

  async verifyOtp(code: string): Promise<FirebaseUser> {
    return authRepository.verifyOtp(code);
  },

  async signOut(): Promise<void> {
    return authRepository.signOut();
  },

  getCurrentUser(): FirebaseUser | null {
    return authRepository.getCurrentUser();
  },

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return authRepository.onAuthStateChanged(callback);
  },

  async signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
    return authRepository.signInWithEmail(email, password);
  },

  async signUpWithEmail(email: string, password: string): Promise<FirebaseUser> {
    return authRepository.signUpWithEmail(email, password);
  },

  async signInWithGoogle(): Promise<FirebaseUser> {
    return authRepository.signInWithGoogle();
  },

  async sendPasswordReset(email: string): Promise<void> {
    return authRepository.sendPasswordReset(email);
  },

  async sendEmailVerification(user: FirebaseUser): Promise<void> {
    return authRepository.sendEmailVerification(user);
  },
};

export default authService;
