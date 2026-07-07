import { PharmacyRepository } from "./interfaces/pharmacy.repository";
import { mockPharmacies } from "@/lib/mock-data";
import { Pharmacy } from "@/types";

export const pharmacyRepositoryMock: PharmacyRepository = {
  async getPharmacyById(id: string): Promise<Pharmacy | null> {
    const pharmacy = mockPharmacies.find((p) => p.id === id);
    return pharmacy || null;
  },

  async getPharmacies(): Promise<Pharmacy[]> {
    return mockPharmacies;
  },

  async updatePharmacy(pharmacy: Pharmacy): Promise<Pharmacy> {
    const index = mockPharmacies.findIndex((p) => p.id === pharmacy.id);
    if (index !== -1) {
      mockPharmacies[index] = {
        ...mockPharmacies[index],
        ...pharmacy,
        updated_at: new Date().toISOString(),
      };
      return mockPharmacies[index];
    }
    throw new Error("Pharmacy not found");
  },
};

export default pharmacyRepositoryMock;
