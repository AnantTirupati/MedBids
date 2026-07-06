import { VerificationRequest, VerificationStatus } from "@/types";
import { mockPharmacies } from "./pharmacies";

export const mockVerificationRequests: VerificationRequest[] = [
  {
    id: "vr1",
    pharmacy_id: "pharm4",
    pharmacy: mockPharmacies[3],
    submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed_at: null,
    reviewed_by: null,
    status: VerificationStatus.PENDING,
    documents: {
      license_url: "https://example.com/license.pdf",
      gst_certificate_url: "https://example.com/gst.pdf",
      address_proof_url: "https://example.com/address.pdf",
    },
    notes: "Requires quick verification of pharmaceutical license against TS drug authority registry.",
  }
];
