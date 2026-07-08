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

  async signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
    if (!password) {
      throw new Error("Password is required");
    }
    const cleanedEmail = email.toLowerCase().trim();
    const patient = mockPatients.find((p) => p.email.toLowerCase() === cleanedEmail);
    const pharmacy = mockPharmacies.find((p) => p.email.toLowerCase() === cleanedEmail);

    let uid = "mock_uid_" + Date.now();
    let userEmail = email;
    let displayName = "Mock User";

    if (patient) {
      uid = patient.id;
      userEmail = patient.email;
      displayName = patient.full_name;
    } else if (pharmacy) {
      uid = pharmacy.id;
      userEmail = pharmacy.email;
      displayName = pharmacy.full_name;
    } else if (cleanedEmail.startsWith("admin")) {
      uid = "admin1";
      userEmail = "admin@medbids.com";
      displayName = "MedBids Admin";
    }

    const mockUser = {
      uid,
      email: userEmail,
      displayName,
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: "mock_refresh_token",
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => "mock_id_token",
      getIdTokenResult: async () => ({} as unknown as import("firebase/auth").IdTokenResult),
      reload: async () => {},
      toJSON: () => ({}),
    } as unknown as FirebaseUser;

    mockCurrentUser = mockUser;
    authCallbacks.forEach((cb) => cb(mockUser));
    return mockUser;
  },

  async signUpWithEmail(email: string, password: string): Promise<FirebaseUser> {
    if (!password) {
      throw new Error("Password is required");
    }
    const mockUser = {
      uid: "mock_uid_" + Date.now(),
      email,
      displayName: email.split("@")[0],
      emailVerified: false,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: "mock_refresh_token",
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => "mock_id_token",
      getIdTokenResult: async () => ({} as unknown as import("firebase/auth").IdTokenResult),
      reload: async () => {},
      toJSON: () => ({}),
    } as unknown as FirebaseUser;

    mockCurrentUser = mockUser;
    authCallbacks.forEach((cb) => cb(mockUser));
    return mockUser;
  },

  async signInWithGoogle(): Promise<FirebaseUser> {
    const mockUser = {
      uid: "mock_google_uid_" + Date.now(),
      email: "google.user@example.com",
      displayName: "Google User",
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: "mock_refresh_token",
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => "mock_id_token",
      getIdTokenResult: async () => ({} as unknown as import("firebase/auth").IdTokenResult),
      reload: async () => {},
      toJSON: () => ({}),
    } as unknown as FirebaseUser;

    mockCurrentUser = mockUser;
    authCallbacks.forEach((cb) => cb(mockUser));
    return mockUser;
  },

  async sendPasswordReset(email: string): Promise<void> {
    console.log(`[Mock Auth] Password reset email sent to ${email}`);
  },

  async sendEmailVerification(user: FirebaseUser): Promise<void> {
    console.log(`[Mock Auth] Verification email sent to ${user.email}`);
  },
};

export default authRepositoryMock;
