import { AnalyticsRepository } from "./interfaces/analytics.repository";
import { AdminDashboardStats } from "@/types";
import { mockPatients } from "@/lib/mock-data/patients";
import { mockPharmacies } from "@/lib/mock-data/pharmacies";
import { mockAuctions } from "@/lib/mock-data/auctions";
import { mockVerificationRequests } from "@/lib/mock-data/verifications";
import { mockPrescriptions } from "@/lib/mock-data/prescriptions";

const listeners: Set<(stats: AdminDashboardStats) => void> = new Set();

function getStats(): AdminDashboardStats {
  return {
    total_users: mockPatients.length + mockPharmacies.length + 1,
    total_pharmacies: mockPharmacies.length,
    active_auctions: mockAuctions.filter((a) => a.status === "live").length,
    pending_verifications: mockVerificationRequests.filter((r) => r.status === "pending").length,
    total_prescriptions: mockPrescriptions.length,
    revenue_this_month: 48500,
    user_growth_percent: 12.4,
    auction_volume_percent: 8.2,
  };
}

export const analyticsRepositoryMock: AnalyticsRepository = {
  async getAdminStats(): Promise<AdminDashboardStats> {
    return getStats();
  },

  subscribeAdminStats(callback: (stats: AdminDashboardStats) => void): () => void {
    listeners.add(callback);
    callback(getStats());
    return () => {
      listeners.delete(callback);
    };
  },
};

export default analyticsRepositoryMock;
