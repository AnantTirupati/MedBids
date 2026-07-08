"use client";

import * as React from "react";
import { AdminDashboardStats, Patient, Pharmacy, VerificationRequest, PlatformSettings, Prescription, Bid } from "@/types";
import { adminService } from "@/services/admin.service";
import { analyticsService } from "@/services/analytics.service";
import { verificationService } from "@/services/verification.service";
import { prescriptionRepository, bidRepository } from "@/repositories";

export function useAdminDashboard() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [stats, setStats] = React.useState<AdminDashboardStats | null>(null);
  const [users, setUsers] = React.useState<Patient[]>([]);
  const [pharmacies, setPharmacies] = React.useState<Pharmacy[]>([]);
  const [verificationQueue, setVerificationQueue] = React.useState<VerificationRequest[]>([]);
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
  const [bids, setBids] = React.useState<Bid[]>([]);
  const [settings, setSettings] = React.useState<PlatformSettings | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      const [usersData, pharmaciesData, queueData, settingsData, rxData, bidsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getPharmacies(),
        adminService.getVerificationQueue(),
        adminService.getPlatformSettings(),
        prescriptionRepository.getPrescriptions(),
        bidRepository.getBids(),
      ]);

      setUsers(usersData);
      setPharmacies(pharmaciesData);
      setVerificationQueue(queueData);
      setSettings(settingsData);
      setPrescriptions(rxData);
      setBids(bidsData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load admin lists"));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // 1. Subscribe to real-time stats updates
    const unsubStats = analyticsService.subscribeAdminStats((data) => {
      setStats(data);
    });

    // 2. Load other lists
    const timer = setTimeout(() => {
      loadData();
    }, 0);

    return () => {
      unsubStats();
      clearTimeout(timer);
    };
  }, [loadData]);

  const approvePharmacy = async (requestId: string, reviewerId: string) => {
    setLoading(true);
    try {
      await verificationService.approvePharmacy(requestId, reviewerId);
      await loadData(); // Reload lists
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
      await verificationService.rejectPharmacy(requestId, reviewerId, notes);
      await loadData(); // Reload lists
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
    prescriptions,
    bids,
    settings,
    approvePharmacy,
    rejectPharmacy,
    refresh: loadData,
  };
}

export default useAdminDashboard;
