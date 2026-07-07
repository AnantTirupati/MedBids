import { Prescription } from "@/types";

export interface PrescriptionRepository {
  getPrescriptions(): Promise<Prescription[]>;
  getPrescriptionById(id: string): Promise<Prescription | null>;
  createPrescription(prescription: Prescription): Promise<Prescription>;
  updatePrescription(prescription: Prescription): Promise<Prescription>;
}
