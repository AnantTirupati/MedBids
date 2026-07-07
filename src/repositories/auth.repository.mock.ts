import { AuthRepository } from "./interfaces/auth.repository";
import { mockPatients, mockPharmacies } from "@/lib/mock-data";
import { Patient, Pharmacy } from "@/types";
import { User as FirebaseUser } from "firebase/auth";

let mockCurrentUser: FirebaseUser | null = null;
const authCallbacks: ((user: FirebaseUser | null) => void)[] = [];
let pendingPhone: string | null = null;

export const authRepositoryMock: AuthRepository = {
  async getUserByPhone(phone: string): Promise<Patient | Pharmacy | null> {
    const cleanedPhone = phone.replace(/\D/g, "");
    if (!cleanedPhone) return null;

    const patient = mockPatients.find((p) => p.phone.replace(/\D/g, "").includes(cleanedPhone));
    if (patient) return patient;

    const pharmacy = mockPharmacies.find((p) => p.phone.replace(/\D/g, "").includes(cleanedPhone));
    if (pharmacy) return pharmacy;

    return null;
  },

  async sendOtp(phone: string, _containerId: string): Promise<boolean> {
    pendingPhone = phone;
    console.log(`[Mock Auth] OTP sent to ${phone} using container ${_containerId}`);
    return true;
  },

  async verifyOtp(code: string): Promise<FirebaseUser> {
    if (!pendingPhone) throw new Error("No pending OTP request");
    if (code.length !== 6) throw new Error("Invalid OTP code length");

    const cleaned = pendingPhone.replace(/\D/g, "");
    const patient = mockPatients.find((p) => p.phone.replace(/\D/g, "").includes(cleaned));
    const pharmacy = mockPharmacies.find((p) => p.phone.replace(/\D/g, "").includes(cleaned));

    let uid = "mock_uid_" + Date.now();
    let email = "mock@medbids.com";

    if (patient) {
      uid = patient.id;
      email = patient.email;
    } else if (pharmacy) {
      uid = pharmacy.id;
      email = pharmacy.email;
    }

    const mockUser = {
      uid,
      phoneNumber: pendingPhone,
      email,
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: "mock_refresh_token",
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => "mock_id_token",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getIdTokenResult: async () => ({} as any),
      reload: async () => {},
      toJSON: () => ({}),
    } as unknown as FirebaseUser;

    mockCurrentUser = mockUser;
    authCallbacks.forEach((cb) => cb(mockUser));
    return mockUser;
  },

  async signOut(): Promise<void> {
    mockCurrentUser = null;
    authCallbacks.forEach((cb) => cb(null));
  },

  getCurrentUser(): FirebaseUser | null {
    return mockCurrentUser;
  },

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    authCallbacks.push(callback);
    callback(mockCurrentUser);
    return () => {
      const idx = authCallbacks.indexOf(callback);
      if (idx !== -1) authCallbacks.splice(idx, 1);
    };
  },
};

export default authRepositoryMock;
