"use client";

import * as React from "react";
import { Prescription, Medication } from "@/types";
import { prescriptionService } from "@/services/prescription.service";

export function usePrescription(prescriptionId?: string) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
  const [prescription, setPrescription] = React.useState<Prescription | null>(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      if (prescriptionId) {
        const data = await prescriptionService.getPrescriptionById(prescriptionId);
        setPrescription(data);
      } else {
        const list = await prescriptionService.getPrescriptions();
        setPrescriptions(list);
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load prescription data"));
    } finally {
      setLoading(false);
    }
  }, [prescriptionId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const createPrescription = async (
    patientId: string,
    patientName: string,
    medications: Omit<Medication, "id">[],
    notes?: string
  ) => {
    setLoading(true);
    try {
      const rx = await prescriptionService.createPrescription(
        patientId,
        patientName,
        medications,
        "Dr. Self",
        "Home",
        notes
      );
      await loadData();
      return rx;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Create prescription failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    prescriptions,
    prescription,
    createPrescription,
    refresh: loadData,
  };
}

export default usePrescription;
