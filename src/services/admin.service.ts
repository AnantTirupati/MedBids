import { Pharmacy, Prescription, Auction, VerificationRequest, AdminDashboardStats } from "@/types";
import { mockPharmacies, mockPrescriptions, mockAuctions, mockVerificationRequests } from "@/lib/mock-data";

export const adminService = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      total_users: 1240,
      total_pharmacies: mockPharmacies.length,
      active_auctions: mockAuctions.filter((a) => a.status === "live").length,
      pending_verifications: mockVerificationRequests.filter((r) => r.status === "pending").length,
      total_prescriptions: mockPrescriptions.length,
      revenue_this_month: 48500,
      user_growth_percent: 12.4,
      auction_volume_percent: 8.2,
    };
  },

  async getVerificationQueue(): Promise<VerificationRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockVerificationRequests;
  },

  async approvePharmacy(requestId: string, reviewerId: string): Promise<VerificationRequest> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const request = mockVerificationRequests.find((r) => r.id === requestId);
    if (!request) throw new Error("Request not found");

    request.status = "approved";
    request.reviewed_at = new Date().toISOString();
    request.reviewed_by = reviewerId;

    // Update associated pharmacy profile status
    const pharm = mockPharmacies.find((p) => p.id === request.pharmacy_id);
    if (pharm) {
      pharm.verification_status = "approved";
      pharm.is_active = true;
    }

    return request;
  },

  async rejectPharmacy(requestId: string, reviewerId: string, notes: string): Promise<VerificationRequest> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const request = mockVerificationRequests.find((r) => r.id === requestId);
    if (!request) throw new Error("Request not found");

    request.status = "rejected";
    request.reviewed_at = new Date().toISOString();
    request.reviewed_by = reviewerId;
    request.notes = notes;

    const pharm = mockPharmacies.find((p) => p.id === request.pharmacy_id);
    if (pharm) {
      pharm.verification_status = "rejected";
      pharm.is_active = false;
    }

    return request;
  },

  async moderatePrescription(prescriptionId: string, approve: boolean, reviewerId: string): Promise<Prescription> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const rx = mockPrescriptions.find((r) => r.id === prescriptionId);
    if (!rx) throw new Error("Prescription not found");

    if (approve) {
      rx.status = "verified";
      rx.verified_at = new Date().toISOString();
      rx.verified_by = reviewerId;

      // Start an auction automatically for simulation
      const newAuction: Auction = {
        id: `auc_new_${Math.random().toString(36).substr(2, 9)}`,
        prescription_id: rx.id,
        prescription: rx,
        status: "live",
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hour duration
        duration_minutes: 1440,
        total_bids: 0,
        lowest_bid: null,
        highest_bid: null,
        created_at: new Date().toISOString(),
      };
      mockAuctions.push(newAuction);
      rx.status = "auction_live";
      rx.auction_id = newAuction.id;
    } else {
      rx.status = "rejected";
    }

    return rx;
  },
};

export default adminService;
