import { analyticsRepository } from "@/repositories";
import { AdminDashboardStats } from "@/types";

export const analyticsService = {
  async getAdminStats(): Promise<AdminDashboardStats> {
    return analyticsRepository.getAdminStats();
  },

  subscribeAdminStats(callback: (stats: AdminDashboardStats) => void): () => void {
    return analyticsRepository.subscribeAdminStats(callback);
  },
};

export default analyticsService;
