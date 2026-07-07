import { VerificationRequest } from "@/types";

export interface AdminRepository {
  getVerificationRequests(): Promise<VerificationRequest[]>;
  updateVerificationRequest(request: VerificationRequest): Promise<VerificationRequest>;
}
