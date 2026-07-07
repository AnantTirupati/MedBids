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
};

export default authService;
