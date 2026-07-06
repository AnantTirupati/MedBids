import { Patient, Prescription, Offer } from "@/types";
import { mockPatients, mockPrescriptions, mockOffers } from "@/lib/mock-data";

export const patientService = {
  async getPatientProfile(patientId: string): Promise<Patient> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    const patient = mockPatients.find((p) => p.id === patientId);
    if (!patient) throw new Error("Patient not found");
    return patient;
  },

  async getPatientPrescriptions(patientId: string): Promise<Prescription[]> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return mockPrescriptions.filter((rx) => rx.patient_id === patientId);
  },

  async getPatientOffers(patientId: string): Promise<Offer[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockOffers.filter((o) => o.patient_id === patientId);
  },

  async acceptOffer(offerId: string): Promise<Offer> {
    await new Promise((resolve) => setTimeout(resolve, 450));
    const offerIndex = mockOffers.findIndex((o) => o.id === offerId);
    if (offerIndex === -1) throw new Error("Offer not found");

    // Mutate local state for simulation
    mockOffers[offerIndex].status = "accepted";
    mockOffers[offerIndex].accepted_at = new Date().toISOString();

    // End associated auction
    const associatedRxId = mockOffers[offerIndex].prescription_id;
    const rx = mockPrescriptions.find((r) => r.id === associatedRxId);
    if (rx) {
      rx.status = "offer_accepted";
    }

    return mockOffers[offerIndex];
  },
};

export default patientService;
