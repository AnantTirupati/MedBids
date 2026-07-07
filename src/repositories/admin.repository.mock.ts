import { AdminRepository } from "./interfaces/admin.repository";
import { mockVerificationRequests } from "@/lib/mock-data";
import { VerificationRequest } from "@/types";

export const adminRepositoryMock: AdminRepository = {
  async getVerificationRequests(): Promise<VerificationRequest[]> {
    return mockVerificationRequests;
  },

  async updateVerificationRequest(request: VerificationRequest): Promise<VerificationRequest> {
    const index = mockVerificationRequests.findIndex((r) => r.id === request.id);
    if (index !== -1) {
      mockVerificationRequests[index] = {
        ...mockVerificationRequests[index],
        ...request,
      };
      return mockVerificationRequests[index];
    }
    throw new Error("Verification request not found");
  },
};

export default adminRepositoryMock;
