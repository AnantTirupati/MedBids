import * as React from "react";
import { Prescription } from "@/types";
import { moderationService } from "@/services/moderation.service";

export function useModerationQueue() {
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const unsubscribe = moderationService.subscribePrescriptions((data) => {
      setPrescriptions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const approvePrescription = async (rxId: string, reviewerId: string, durationHours: number) => {
    try {
      await moderationService.approvePrescription(rxId, reviewerId, durationHours);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to approve prescription"));
      throw err;
    }
  };

  const rejectPrescription = async (rxId: string, reviewerId: string, notes: string) => {
    try {
      await moderationService.rejectPrescription(rxId, reviewerId, notes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to reject prescription"));
      throw err;
    }
  };

  const flagPrescription = async (rxId: string, reviewerId: string, notes: string) => {
    try {
      await moderationService.flagPrescription(rxId, reviewerId, notes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to flag prescription"));
      throw err;
    }
  };

  return {
    prescriptions,
    loading,
    error,
    approvePrescription,
    rejectPrescription,
    flagPrescription,
  };
}

export default useModerationQueue;
