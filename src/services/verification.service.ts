import { verificationRepository, pharmacyRepository } from "@/repositories";
import { VerificationRequest, VerificationStatus } from "@/types";
import { auditService } from "./audit.service";

export const verificationService = {
  async getRequests(): Promise<VerificationRequest[]> {
    return verificationRepository.getRequests();
  },

  async getRequestById(id: string): Promise<VerificationRequest | null> {
    return verificationRepository.getRequestById(id);
  },

  async approvePharmacy(requestId: string, reviewerId: string): Promise<VerificationRequest> {
    const request = await verificationRepository.getRequestById(requestId);
    if (!request) throw new Error("Verification request not found");

    if (request.status === VerificationStatus.APPROVED) {
      throw new Error("Application is already approved");
    }

    const beforeState = JSON.parse(JSON.stringify(request));

    // Update request
    request.status = VerificationStatus.APPROVED;
    request.reviewed_at = new Date().toISOString();
    request.reviewed_by = reviewerId;
    await verificationRepository.updateRequest(request);

    // Update pharmacy
    const pharm = await pharmacyRepository.getPharmacyById(request.pharmacy_id);
    if (pharm) {
      pharm.verification_status = VerificationStatus.APPROVED;
      pharm.is_active = true;
      await pharmacyRepository.updatePharmacy(pharm);
    }

    await auditService.createLog(
      reviewerId,
      "admin",
      "Approve Pharmacy Application",
      "verification_requests",
      requestId,
      beforeState,
      JSON.parse(JSON.stringify(request))
    );

    return request;
  },

  async rejectPharmacy(requestId: string, reviewerId: string, notes: string): Promise<VerificationRequest> {
    const request = await verificationRepository.getRequestById(requestId);
    if (!request) throw new Error("Verification request not found");

    if (request.status === VerificationStatus.REJECTED) {
      throw new Error("Application is already rejected");
    }

    const beforeState = JSON.parse(JSON.stringify(request));

    // Update request
    request.status = VerificationStatus.REJECTED;
    request.reviewed_at = new Date().toISOString();
    request.reviewed_by = reviewerId;
    request.notes = notes;
    await verificationRepository.updateRequest(request);

    // Update pharmacy
    const pharm = await pharmacyRepository.getPharmacyById(request.pharmacy_id);
    if (pharm) {
      pharm.verification_status = VerificationStatus.REJECTED;
      pharm.is_active = false;
      await pharmacyRepository.updatePharmacy(pharm);
    }

    await auditService.createLog(
      reviewerId,
      "admin",
      "Reject Pharmacy Application",
      "verification_requests",
      requestId,
      beforeState,
      JSON.parse(JSON.stringify(request))
    );

    return request;
  },

  async suspendPharmacy(requestId: string, reviewerId: string, notes: string): Promise<VerificationRequest> {
    const request = await verificationRepository.getRequestById(requestId);
    if (!request) throw new Error("Verification request not found");

    const beforeState = JSON.parse(JSON.stringify(request));

    // Update request
    request.status = VerificationStatus.SUSPENDED;
    request.reviewed_at = new Date().toISOString();
    request.reviewed_by = reviewerId;
    request.notes = notes;
    await verificationRepository.updateRequest(request);

    // Update pharmacy
    const pharm = await pharmacyRepository.getPharmacyById(request.pharmacy_id);
    if (pharm) {
      pharm.verification_status = VerificationStatus.SUSPENDED;
      pharm.is_active = false;
      await pharmacyRepository.updatePharmacy(pharm);
    }

    await auditService.createLog(
      reviewerId,
      "admin",
      "Suspend Pharmacy License",
      "verification_requests",
      requestId,
      beforeState,
      JSON.parse(JSON.stringify(request))
    );

    return request;
  },

  subscribeRequests(callback: (requests: VerificationRequest[]) => void): () => void {
    return verificationRepository.subscribeRequests(callback);
  },
};

export default verificationService;
