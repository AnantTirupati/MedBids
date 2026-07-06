"use client";

import * as React from "react";
import { AdminDashboardStats, Patient, Pharmacy, VerificationRequest, PlatformSettings } from "@/types";
import { adminService } from "@/services/admin.service";

export function useAdminDashboard() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [stats, setStats] = React.useState<AdminDashboardStats | null>(null);
  const [users, setUsers] = React.useState<Patient[]>([]);
  const [pharmacies, setPharmacies] = React.useState<Pharmacy[]>([]);
  const [verificationQueue, setVerificationQueue] = React.useState<VerificationRequest[]>([]);
  const [settings, setSettings] = React.useState<PlatformSettings | null>(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const [statsData, usersData, pharmaciesData, queueData, settingsData] = await Promise.all([
        adminService.getDashboard(),
        adminService.getUsers(),
        adminService.getPharmacies(),
        adminService.getVerificationQueue(),
        adminService.getPlatformSettings(),
      ]);

      setStats(statsData);
      setUsers(usersData);
      setPharmacies(pharmaciesData);
      setVerificationQueue(queueData);
      setSettings(settingsData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load admin dashboard"));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const approvePharmacy = async (requestId: string, reviewerId: string) => {
    setLoading(true);
    try {
      await adminService.approvePharmacy(requestId, reviewerId);
      await loadData(); // Reload
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Approve request failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectPharmacy = async (requestId: string, reviewerId: string, notes: string) => {
    setLoading(true);
    try {
      await adminService.rejectPharmacy(requestId, reviewerId, notes);
      await loadData(); // Reload
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Reject request failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    stats,
    users,
    pharmacies,
    verificationQueue,
    settings,
    approvePharmacy,
    rejectPharmacy,
    refresh: loadData,
  };
}

export default useAdminDashboard;
