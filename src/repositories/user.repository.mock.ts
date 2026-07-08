import { UserRepository } from "./interfaces/user.repository";
import { User, UserRole, Patient, Pharmacy } from "@/types";
import { mockPatients, mockPharmacies } from "@/lib/mock-data";

export const userRepositoryMock: UserRepository = {
  async getProfile(uid: string): Promise<User | null> {
    const patient = mockPatients.find((p) => p.id === uid);
    if (patient) return patient;
    const pharmacy = mockPharmacies.find((p) => p.id === uid);
    if (pharmacy) return pharmacy;
    if (uid === "admin1" || uid.includes("admin")) {
      return {
        id: uid,
        email: "admin@medbids.com",
        phone: "+91 99999 99999",
        role: UserRole.ADMIN,
        full_name: "MedBids Admin",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
      };
    }
    return null;
  },

  async createProfile(profile: User): Promise<User> {
    if (profile.role === UserRole.PATIENT) {
      mockPatients.push(profile as unknown as Patient);
    } else if (profile.role === UserRole.PHARMACY) {
      mockPharmacies.push(profile as unknown as Pharmacy);
    }
    return profile;
  },

  async updateProfile(uid: string, profile: Partial<User>): Promise<void> {
    const pIdx = mockPatients.findIndex((p) => p.id === uid);
    if (pIdx !== -1) {
      mockPatients[pIdx] = { ...mockPatients[pIdx], ...profile } as unknown as Patient;
      return;
    }
    const phIdx = mockPharmacies.findIndex((p) => p.id === uid);
    if (phIdx !== -1) {
      mockPharmacies[phIdx] = { ...mockPharmacies[phIdx], ...profile } as unknown as Pharmacy;
      return;
    }
    throw new Error("Profile not found");
  },

  async deleteProfile(uid: string): Promise<void> {
    const pIdx = mockPatients.findIndex((p) => p.id === uid);
    if (pIdx !== -1) {
      mockPatients.splice(pIdx, 1);
      return;
    }
    const phIdx = mockPharmacies.findIndex((p) => p.id === uid);
    if (phIdx !== -1) {
      mockPharmacies.splice(phIdx, 1);
      return;
    }
    throw new Error("Profile not found");
  },

  async profileExists(uid: string): Promise<boolean> {
    const patient = mockPatients.some((p) => p.id === uid);
    if (patient) return true;
    const pharmacy = mockPharmacies.some((p) => p.id === uid);
    if (pharmacy) return true;
    return false;
  },
};

export default userRepositoryMock;
