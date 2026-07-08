"use client";

import * as React from "react";
import { Pharmacy, PharmacyDashboardStats, Auction, Bid } from "@/types";
import { pharmacyService } from "@/services/pharmacy.service";

export function usePharmacyDashboard(pharmacyId: string) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [stats, setStats] = React.useState<PharmacyDashboardStats | null>(null);
  const [profile, setProfile] = React.useState<Pharmacy | null>(null);
  const [availableAuctions, setAvailableAuctions] = React.useState<Auction[]>([]);
  const [myBids, setMyBids] = React.useState<Bid[]>([]);

  const loadData = React.useCallback(async () => {
    if (!pharmacyId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const [statsData, profileData, auctionsData, bidsData] = await Promise.all([
        pharmacyService.getDashboard(pharmacyId),
        pharmacyService.getProfile(pharmacyId),
        pharmacyService.getAvailableAuctions(),
        pharmacyService.getMyBids(pharmacyId),
      ]);

      setStats(statsData);
      setProfile(profileData);
      setAvailableAuctions(auctionsData);
      setMyBids(bidsData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load pharmacy dashboard"));
    } finally {
      setLoading(false);
    }
  }, [pharmacyId]);

  React.useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (!ignore) {
        await loadData();
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, [loadData]);

  return {
    loading,
    error,
    success,
    stats,
    profile,
    availableAuctions,
    myBids,
    refresh: loadData,
  };
}

export default usePharmacyDashboard;
