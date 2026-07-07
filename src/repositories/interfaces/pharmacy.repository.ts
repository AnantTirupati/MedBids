import { Pharmacy } from "@/types";

export interface PharmacyRepository {
  getPharmacyById(id: string): Promise<Pharmacy | null>;
  getPharmacies(): Promise<Pharmacy[]>;
  updatePharmacy(pharmacy: Pharmacy): Promise<Pharmacy>;
}
