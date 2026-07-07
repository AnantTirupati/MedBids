import { ModerationRepository } from "./interfaces/moderation.repository";
import { Prescription } from "@/types";
import { mockPrescriptions } from "@/lib/mock-data/prescriptions";

const listeners: Set<(prescriptions: Prescription[]) => void> = new Set();

function notifyListeners() {
  listeners.forEach((cb) => cb([...mockPrescriptions]));
}

export const moderationRepositoryMock: ModerationRepository = {
  async getPrescriptions(): Promise<Prescription[]> {
    return mockPrescriptions;
  },

  async updatePrescription(rx: Prescription): Promise<Prescription> {
    const index = mockPrescriptions.findIndex((p) => p.id === rx.id);
    if (index !== -1) {
      mockPrescriptions[index] = {
        ...mockPrescriptions[index],
        ...rx,
      };
      notifyListeners();
      return mockPrescriptions[index];
    }
    throw new Error("Prescription not found");
  },

  subscribePrescriptions(callback: (rxList: Prescription[]) => void): () => void {
    listeners.add(callback);
    callback([...mockPrescriptions]);
    return () => {
      listeners.delete(callback);
    };
  },
};

export default moderationRepositoryMock;
