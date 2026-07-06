import {
  AdminDashboardStats,
  Patient,
  Pharmacy,
  VerificationRequest,
  VerificationStatus,
  PlatformSettings,
  PrescriptionStatus,
  AuctionStatus
} from "@/types";
import {
  mockPatients,
  mockPharmacies,
  mockAuctions,
  mockPrescriptions,
  mockVerificationRequests,
  mockPlatformSettings
} from "@/lib/mock-data";
import { getRandomDelay } from "@/utils/delay";

export const adminService = {
  async getDashboard(): Promise<AdminDashboardStats> {
    await getRandomDelay();
    return {
      total_users: 1240,
      total_pharmacies: mockPharmacies.length,
      active_auctions: mockAuctions.filter((a) => a.status === "live").length,
      pending_verifications: mockVerificationRequests.filter((r) => r.status === VerificationStatus.PENDING).length,
      total_prescriptions: mockPrescriptions.length,
      revenue_this_month: 48500,
      user_growth_percent: 12.4,
      auction_volume_percent: 8.2,
    };
  },

  async getUsers(): Promise<Patient[]> {
    await getRandomDelay();
    return mockPatients;
  },

  async getPharmacies(): Promise<Pharmacy[]> {
    await getRandomDelay();
    return mockPharmacies;
  },

  async getVerificationQueue(): Promise<VerificationRequest[]> {
    await getRandomDelay();
    return mockVerificationRequests;
  },

  async approvePharmacy(requestId: string, reviewerId: string): Promise<VerificationRequest> {
    await getRandomDelay();
    const request = mockVerificationRequests.find((r) => r.id === requestId);
    if (!request) throw new Error("Request not found");

    request.status = VerificationStatus.APPROVED;
    request.reviewed_at = new Date().toISOString();
    request.reviewed_by = reviewerId;

    const pharm = mockPharmacies.find((p) => p.id === request.pharmacy_id);
    if (pharm) {
      pharm.verification_status = VerificationStatus.APPROVED;
      pharm.is_active = true;
    }

    return request;
  },

  async rejectPharmacy(requestId: string, reviewerId: string, notes: string): Promise<VerificationRequest> {
    await getRandomDelay();
    const request = mockVerificationRequests.find((r) => r.id === requestId);
    if (!request) throw new Error("Request not found");

    request.status = VerificationStatus.REJECTED;
    request.reviewed_at = new Date().toISOString();
    request.reviewed_by = reviewerId;
    request.notes = notes;

    const pharm = mockPharmacies.find((p) => p.id === request.pharmacy_id);
    if (pharm) {
      pharm.verification_status = VerificationStatus.REJECTED;
      pharm.is_active = false;
    }

    return request;
  },

  async moderatePrescription(rxId: string, approve: boolean, reviewerId: string): Promise<any> {
    await getRandomDelay();
    const rx = mockPrescriptions.find((r) => r.id === rxId);
    if (!rx) throw new Error("Prescription not found");

    if (approve) {
      rx.status = PrescriptionStatus.VERIFIED;
      rx.verified_at = new Date().toISOString();
      rx.verified_by = reviewerId;
      
      const newAuction = {
        id: `auc_${Math.random().toString(36).substr(2, 9)}`,
        prescription_id: rx.id,
        prescription: rx,
        status: AuctionStatus.LIVE,
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        duration_minutes: 1440,
        total_bids: 0,
        lowest_bid: null,
        highest_bid: null,
        created_at: new Date().toISOString(),
      };
      mockAuctions.push(newAuction);
      rx.auction_id = newAuction.id;
      rx.status = PrescriptionStatus.AUCTION_LIVE;
    } else {
      rx.status = PrescriptionStatus.REJECTED;
    }
    return rx;
  },

  async getPlatformSettings(): Promise<PlatformSettings> {
    await getRandomDelay();
    return mockPlatformSettings;
  },
};

export default adminService;
