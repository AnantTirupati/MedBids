import * as React from "react";
import { Patient, Pharmacy } from "@/types";
import { patientRepository, pharmacyRepository } from "@/repositories";
import { auditService } from "@/services/audit.service";

export function useUserManagement() {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [pharmacies, setPharmacies] = React.useState<Pharmacy[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [patList, pharmList] = await Promise.all([
        patientRepository.getPatients(),
        pharmacyRepository.getPharmacies(),
      ]);
      setPatients(patList);
      setPharmacies(pharmList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  const togglePatientActive = async (patientId: string, adminId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const before = JSON.parse(JSON.stringify(patient));
    const newActive = !patient.is_active;

    const useFirebase = process.env.NEXT_PUBLIC_USE_FIREBASE === "firebase";
    if (useFirebase) {
      const { doc, setDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase/firestore");
      await setDoc(doc(db, "users", patientId), { is_active: newActive }, { merge: true });
    } else {
      patient.is_active = newActive;
    }

    setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, is_active: newActive } : p)));

    await auditService.createLog(
      adminId,
      "admin",
      newActive ? "Activate Patient" : "Suspend Patient",
      "users",
      patientId,
      before,
      { ...before, is_active: newActive }
    );
  };

  const togglePharmacyActive = async (pharmacyId: string, adminId: string) => {
    const pharmacy = pharmacies.find((p) => p.id === pharmacyId);
    if (!pharmacy) return;

    const before = JSON.parse(JSON.stringify(pharmacy));
    const newActive = !pharmacy.is_active;

    const useFirebase = process.env.NEXT_PUBLIC_USE_FIREBASE === "firebase";
    if (useFirebase) {
      const { doc, setDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase/firestore");
      await setDoc(doc(db, "pharmacies", pharmacyId), { is_active: newActive }, { merge: true });
    } else {
      pharmacy.is_active = newActive;
    }

    setPharmacies((prev) => prev.map((p) => (p.id === pharmacyId ? { ...p, is_active: newActive } : p)));

    await auditService.createLog(
      adminId,
      "admin",
      newActive ? "Activate Pharmacy" : "Suspend Pharmacy",
      "pharmacies",
      pharmacyId,
      before,
      { ...before, is_active: newActive }
    );
  };

  return {
    patients,
    pharmacies,
    loading,
    togglePatientActive,
    togglePharmacyActive,
    refresh: loadData,
  };
}

export default useUserManagement;
