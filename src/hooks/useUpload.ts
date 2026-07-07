"use client";

import * as React from "react";
import { patientService } from "@/services/patient.service";

import { Medication } from "@/types";

export function useUpload() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [success, setSuccess] = React.useState(false);

  const uploadPrescription = async (patientId: string, patientName: string, notes?: string, medications?: Omit<Medication, "id">[]) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const rx = await patientService.uploadPrescription(patientId, patientName, notes, medications);
      setSuccess(true);
      return rx;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Upload prescription failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    uploadPrescription,
  };
}

export default useUpload;
