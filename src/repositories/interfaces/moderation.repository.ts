import { Prescription } from "@/types";

export interface ModerationRepository {
  getPrescriptions(): Promise<Prescription[]>;
  updatePrescription(rx: Prescription): Promise<Prescription>;
  subscribePrescriptions(callback: (rxList: Prescription[]) => void): () => void;
}
