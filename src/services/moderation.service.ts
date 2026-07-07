import { moderationRepository, prescriptionRepository } from "@/repositories";
import { Prescription, PrescriptionStatus } from "@/types";
import { auditService } from "./audit.service";
import { auctionEngineService } from "@/features/auction-engine/auction-engine.service";

export const moderationService = {
  async getPrescriptions(): Promise<Prescription[]> {
    return moderationRepository.getPrescriptions();
  },

  async approvePrescription(rxId: string, reviewerId: string, durationHours: number): Promise<Prescription> {
    const rx = await prescriptionRepository.getPrescriptionById(rxId);
    if (!rx) throw new Error("Prescription not found");

    if (rx.status === PrescriptionStatus.VERIFIED || rx.status === PrescriptionStatus.AUCTION_LIVE) {
      throw new Error("Prescription is already verified/live");
    }

    const beforeState = JSON.parse(JSON.stringify(rx));

    // 1. Approve prescription and start auction atomically using the Auction Engine!
    await auctionEngineService.startAuction(rxId, durationHours);

    // Retrieve updated prescription with auction_id populated
    const updatedRx = await prescriptionRepository.getPrescriptionById(rxId);
    if (!updatedRx) throw new Error("Failed to load verified prescription");

    await auditService.createLog(
      reviewerId,
      "admin",
      "Approve Prescription",
      "prescriptions",
      rxId,
      beforeState,
      JSON.parse(JSON.stringify(updatedRx))
    );

    return updatedRx;
  },

  async rejectPrescription(rxId: string, reviewerId: string, notes: string): Promise<Prescription> {
    const rx = await prescriptionRepository.getPrescriptionById(rxId);
    if (!rx) throw new Error("Prescription not found");

    const beforeState = JSON.parse(JSON.stringify(rx));

    rx.status = PrescriptionStatus.REJECTED;
    rx.notes = notes;
    rx.verified_by = reviewerId;
    rx.verified_at = new Date().toISOString();
    await moderationRepository.updatePrescription(rx);

    await auditService.createLog(
      reviewerId,
      "admin",
      "Reject Prescription",
      "prescriptions",
      rxId,
      beforeState,
      JSON.parse(JSON.stringify(rx))
    );

    return rx;
  },

  async flagPrescription(rxId: string, reviewerId: string, notes: string): Promise<Prescription> {
    const rx = await prescriptionRepository.getPrescriptionById(rxId);
    if (!rx) throw new Error("Prescription not found");

    const beforeState = JSON.parse(JSON.stringify(rx));

    // Set to pending verification as "flagged"
    rx.status = PrescriptionStatus.PENDING_VERIFICATION;
    rx.notes = `[FLAGGED] ${notes}`;
    await moderationRepository.updatePrescription(rx);

    await auditService.createLog(
      reviewerId,
      "admin",
      "Flag Prescription",
      "prescriptions",
      rxId,
      beforeState,
      JSON.parse(JSON.stringify(rx))
    );

    return rx;
  },

  subscribePrescriptions(callback: (rxList: Prescription[]) => void): () => void {
    return moderationRepository.subscribePrescriptions(callback);
  },
};

export default moderationService;
