"use client";

import * as React from "react";
import { Patient, Prescription, Offer, DashboardStats, ActivityItem } from "@/types";
import { patientService } from "@/services/patient.service";

export function usePatientDashboard(patientId: string) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [profile, setProfile] = React.useState<Patient | null>(null);
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
  const [acceptedOffers, setAcceptedOffers] = React.useState<Offer[]>([]);
  const [timelineEvents, setTimelineEvents] = React.useState<ActivityItem[]>([]);

  const loadData = React.useCallback(async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const [statsData, profileData, rxData, offersData, timelineData] = await Promise.all([
        patientService.getDashboard(patientId),
        patientService.getProfile(patientId),
        patientService.getPrescriptions(patientId),
        patientService.getAcceptedOffers(patientId),
        patientService.getTimelineEvents(patientId),
      ]);

      setStats(statsData);
      setProfile(profileData);
      setPrescriptions(rxData);
      setAcceptedOffers(offersData);
      setTimelineEvents(timelineData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load dashboard data"));
    } finally {
      setLoading(false);
    }
  }, [patientId]);

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
    prescriptions,
    acceptedOffers,
    timelineEvents,
    refresh: loadData,
  };
}

export default usePatientDashboard;
