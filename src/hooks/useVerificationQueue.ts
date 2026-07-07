import * as React from "react";
import { VerificationRequest } from "@/types";
import { verificationService } from "@/services/verification.service";

export function useVerificationQueue() {
  const [requests, setRequests] = React.useState<VerificationRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const unsubscribe = verificationService.subscribeRequests((data) => {
      setRequests(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const approvePharmacy = async (requestId: string, reviewerId: string) => {
    try {
      await verificationService.approvePharmacy(requestId, reviewerId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to approve pharmacy"));
      throw err;
    }
  };

  const rejectPharmacy = async (requestId: string, reviewerId: string, notes: string) => {
    try {
      await verificationService.rejectPharmacy(requestId, reviewerId, notes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to reject pharmacy"));
      throw err;
    }
  };

  const suspendPharmacy = async (requestId: string, reviewerId: string, notes: string) => {
    try {
      await verificationService.suspendPharmacy(requestId, reviewerId, notes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to suspend pharmacy"));
      throw err;
    }
  };

  return {
    requests,
    loading,
    error,
    approvePharmacy,
    rejectPharmacy,
    suspendPharmacy,
  };
}

export default useVerificationQueue;
