import { PrescriptionRepository } from "./interfaces/prescription.repository";
import { mockPrescriptions } from "@/lib/mock-data";
import { Prescription } from "@/types";

export const prescriptionRepositoryMock: PrescriptionRepository = {
  async getPrescriptions(): Promise<Prescription[]> {
    return mockPrescriptions;
  },

  async getPrescriptionById(id: string): Promise<Prescription | null> {
    const rx = mockPrescriptions.find((r) => r.id === id);
    return rx || null;
  },

  async createPrescription(prescription: Prescription): Promise<Prescription> {
    mockPrescriptions.push(prescription);
    return prescription;
  },

  async updatePrescription(prescription: Prescription): Promise<Prescription> {
    const index = mockPrescriptions.findIndex((r) => r.id === prescription.id);
    if (index !== -1) {
      mockPrescriptions[index] = {
        ...mockPrescriptions[index],
        ...prescription,
        updated_at: new Date().toISOString(),
      };
      return mockPrescriptions[index];
    }
    throw new Error("Prescription not found");
  },
};

export default prescriptionRepositoryMock;
