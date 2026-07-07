import {
  AdminDashboardStats,
  Patient,
  Pharmacy,
  VerificationRequest,
  PlatformSettings,
  Prescription
} from "@/types";
import {
  patientRepository,
  pharmacyRepository,
} from "@/repositories";
import { getRandomDelay } from "@/utils/delay";
import { verificationService } from "./verification.service";
import { moderationService } from "./moderation.service";
import { settingsService } from "./settings.service";
import { analyticsService } from "./analytics.service";

export const adminService = {
  async getDashboard(): Promise<AdminDashboardStats> {
    await getRandomDelay();
    return analyticsService.getAdminStats();
  },

  async getUsers(): Promise<Patient[]> {
    await getRandomDelay();
    return patientRepository.getPatients();
  },

  async getPharmacies(): Promise<Pharmacy[]> {
    await getRandomDelay();
    return pharmacyRepository.getPharmacies();
  },

  async getVerificationQueue(): Promise<VerificationRequest[]> {
    await getRandomDelay();
    return verificationService.getRequests();
  },

  async approvePharmacy(requestId: string, reviewerId: string): Promise<VerificationRequest> {
    await getRandomDelay();
    return verificationService.approvePharmacy(requestId, reviewerId);
  },

  async rejectPharmacy(requestId: string, reviewerId: string, notes: string): Promise<VerificationRequest> {
    await getRandomDelay();
    return verificationService.rejectPharmacy(requestId, reviewerId, notes);
  },

  async moderatePrescription(rxId: string, approve: boolean, reviewerId: string): Promise<Prescription> {
    await getRandomDelay();
    if (approve) {
      return moderationService.approvePrescription(rxId, reviewerId, 24); // default 24 hours
    } else {
      return moderationService.rejectPrescription(rxId, reviewerId, "Rejected by administrator review");
    }
  },

  async getPlatformSettings(): Promise<PlatformSettings> {
    await getRandomDelay();
    return settingsService.getSettings();
  },
};

export default adminService;
