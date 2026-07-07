import { VerificationRequest } from "@/types";

export interface VerificationRepository {
  getRequests(): Promise<VerificationRequest[]>;
  getRequestById(id: string): Promise<VerificationRequest | null>;
  updateRequest(request: VerificationRequest): Promise<VerificationRequest>;
  subscribeRequests(callback: (requests: VerificationRequest[]) => void): () => void;
}
