import { VerificationRepository } from "./interfaces/verification.repository";
import { VerificationRequest } from "@/types";
import { mockVerificationRequests } from "@/lib/mock-data/verifications";

const listeners: Set<(requests: VerificationRequest[]) => void> = new Set();

function notifyListeners() {
  listeners.forEach((cb) => cb([...mockVerificationRequests]));
}

export const verificationRepositoryMock: VerificationRepository = {
  async getRequests(): Promise<VerificationRequest[]> {
    return mockVerificationRequests;
  },

  async getRequestById(id: string): Promise<VerificationRequest | null> {
    const req = mockVerificationRequests.find((r) => r.id === id);
    return req || null;
  },

  async updateRequest(request: VerificationRequest): Promise<VerificationRequest> {
    const index = mockVerificationRequests.findIndex((r) => r.id === request.id);
    if (index !== -1) {
      mockVerificationRequests[index] = {
        ...mockVerificationRequests[index],
        ...request,
      };
      notifyListeners();
      return mockVerificationRequests[index];
    }
    throw new Error("Verification request not found");
  },

  subscribeRequests(callback: (requests: VerificationRequest[]) => void): () => void {
    listeners.add(callback);
    callback([...mockVerificationRequests]);
    return () => {
      listeners.delete(callback);
    };
  },
};

export default verificationRepositoryMock;
