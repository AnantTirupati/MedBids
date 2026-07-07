import { Patient, Prescription, Offer, DashboardStats, PrescriptionStatus, Medication, ActivityItem } from "@/types";
import {
  patientRepository,
  prescriptionRepository,
  offerRepository,
} from "@/repositories";
import { getRandomDelay } from "@/utils/delay";

export const patientService = {
  async getTimelineEvents(patientId: string): Promise<ActivityItem[]> {
    await getRandomDelay();
    return patientRepository.getTimelineEvents(patientId);
  },

  async getDashboard(patientId: string): Promise<DashboardStats> {
    await getRandomDelay();
    const rx = await prescriptionRepository.getPrescriptions();
    const patientRx = rx.filter((r) => r.patient_id === patientId);
    
    return {
      active_prescriptions: patientRx.length,
      active_bids: 14, // Simulated active bids count
      accepted_offers: patientRx.filter((r) => r.status === "offer_accepted" || r.status === "fulfilled").length,
      estimated_savings: 4250,
    };
  },

  async getProfile(patientId: string): Promise<Patient> {
    await getRandomDelay();
    const patient = await patientRepository.getPatientById(patientId);
    if (!patient) throw new Error("Patient not found");
    return patient;
  },

  async getPrescriptions(patientId: string): Promise<Prescription[]> {
    await getRandomDelay();
    const rx = await prescriptionRepository.getPrescriptions();
    return rx.filter((r) => r.patient_id === patientId);
  },

  async getPatientPrescriptions(patientId: string): Promise<Prescription[]> {
    return this.getPrescriptions(patientId);
  },

  async getPatientProfile(patientId: string): Promise<Patient> {
    return this.getProfile(patientId);
  },

  async getPatientOffers(patientId: string): Promise<Offer[]> {
    await getRandomDelay();
    const offers = await offerRepository.getOffers();
    return offers.filter((o) => o.patient_id === patientId);
  },

  async acceptOffer(offerId: string): Promise<Offer> {
    return import("./auction.service").then((s) => s.auctionService.acceptOffer(offerId));
  },

  async getAcceptedOffers(patientId: string): Promise<Offer[]> {
    await getRandomDelay();
    const offers = await offerRepository.getOffers();
    return offers.filter(
      (o) => o.patient_id === patientId && (o.status === "accepted" || o.status === "fulfilled")
    );
  },

  async uploadPrescription(
    patientId: string,
    patientName: string,
    notes?: string,
    medications?: Omit<Medication, "id">[]
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
      medications: medications
        ? medications.map((med, index) => ({
            ...med,
            id: `m_${index}_${Math.random().toString(36).substr(2, 5)}`,
          }))
        : [
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

    return prescriptionRepository.createPrescription(newRx);
  },
};

export default patientService;
