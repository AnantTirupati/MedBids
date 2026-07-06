import { Patient, Prescription, Offer, DashboardStats, PrescriptionStatus } from "@/types";
import { mockPatients, mockPrescriptions, mockOffers, mockTimelineEvents } from "@/lib/mock-data";
import { getRandomDelay } from "@/utils/delay";

export const patientService = {
  async getTimelineEvents(patientId: string): Promise<any[]> {
    await getRandomDelay();
    return mockTimelineEvents;
  },
  async getDashboard(patientId: string): Promise<DashboardStats> {
    await getRandomDelay();
    const rx = mockPrescriptions.filter((r) => r.patient_id === patientId);
    const activeOffers = mockOffers.filter((o) => o.patient_id === patientId && o.status === "open").length;
    return {
      active_prescriptions: rx.length,
      active_bids: 14, // Simulated active bids count
      accepted_offers: rx.filter((r) => r.status === "offer_accepted" || r.status === "fulfilled").length,
      estimated_savings: 4250,
    };
  },

  async getProfile(patientId: string): Promise<Patient> {
    await getRandomDelay();
    const patient = mockPatients.find((p) => p.id === patientId);
    if (!patient) throw new Error("Patient not found");
    return patient;
  },

  async getPrescriptions(patientId: string): Promise<Prescription[]> {
    await getRandomDelay();
    return mockPrescriptions.filter((rx) => rx.patient_id === patientId);
  },

  async getPatientPrescriptions(patientId: string): Promise<Prescription[]> {
    return this.getPrescriptions(patientId);
  },

  async getPatientProfile(patientId: string): Promise<Patient> {
    return this.getProfile(patientId);
  },

  async getPatientOffers(patientId: string): Promise<Offer[]> {
    await getRandomDelay();
    return mockOffers.filter((o) => o.patient_id === patientId);
  },

  async acceptOffer(offerId: string): Promise<Offer> {
    return import("./auction.service").then((s) => s.auctionService.acceptOffer(offerId));
  },

  async getAcceptedOffers(patientId: string): Promise<Offer[]> {
    await getRandomDelay();
    return mockOffers.filter(
      (o) => o.patient_id === patientId && (o.status === "accepted" || o.status === "fulfilled")
    );
  },

  async uploadPrescription(
    patientId: string,
    patientName: string,
    notes?: string,
    medications?: any[]
  ): Promise<Prescription> {
    await getRandomDelay();
    const newRx: Prescription = {
      id: `rx_${Math.random().toString(36).substr(2, 9)}`,
      patient_id: patientId,
      patient_name: patientName,
      status: PrescriptionStatus.PENDING_VERIFICATION,
      prescription_image_url: null,
      doctor_name: "Dr. Self",
      hospital_name: "Home",
      notes: notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      verified_at: null,
      verified_by: null,
      auction_id: null,
      medications: medications || [
        {
          id: `m_${Math.random().toString(36).substr(2, 9)}`,
          name: "Pending Verification Medication",
          generic_name: null,
          dosage: "As directed",
          form: "Tablet",
          quantity: 1,
          frequency: null,
        },
      ],
    };

    mockPrescriptions.push(newRx);
    return newRx;
  },
};

export default patientService;
