import { AdminDashboardStats } from "@/types";

export interface AnalyticsRepository {
  getAdminStats(): Promise<AdminDashboardStats>;
  subscribeAdminStats(callback: (stats: AdminDashboardStats) => void): () => void;
}
