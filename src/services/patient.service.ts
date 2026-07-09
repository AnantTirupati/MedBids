import { Patient, Prescription, Offer, DashboardStats, PrescriptionStatus, Medication, ActivityItem, Auction } from "@/types";
import {
  patientRepository,
  prescriptionRepository,
  offerRepository,
  auctionRepository,
} from "@/repositories";
import { getRandomDelay } from "@/utils/delay";

export const patientService = {
  async getTimelineEvents(patientId: string): Promise<ActivityItem[]> {
    await getRandomDelay();
    return patientRepository.getTimelineEvents(patientId);
  },

  async getDashboard(patientId: string): Promise<DashboardStats> {
    await getRandomDelay();
    const patientRx = await prescriptionRepository.getPrescriptions(patientId);
    const patientProfile = await patientRepository.getPatientById(patientId);
    
    // Calculate actual active bids across the patient's live auctions
    const liveRx = patientRx.filter((r) => r.status === "auction_live" && r.auction_id);
    let activeBidsCount = 0;
    
    if (liveRx.length > 0) {
      try {
        const allAuctions = await auctionRepository.getAuctions();
        const liveAuctionIds = new Set(liveRx.map((r) => r.auction_id));
        const patientAuctions = allAuctions.filter((a: Auction) => liveAuctionIds.has(a.id));
        activeBidsCount = patientAuctions.reduce((sum: number, a: Auction) => sum + (a.total_bids || 0), 0);
      } catch (err) {
        console.error("Failed to fetch auctions for dashboard stats:", err);
      }
    }

    return {
      active_prescriptions: patientRx.filter(
        (r) => r.status === "auction_live" || r.status === "verified" || r.status === "pending_verification"
      ).length,
      active_bids: activeBidsCount,
      accepted_offers: patientRx.filter((r) => r.status === "offer_accepted" || r.status === "fulfilled").length,
      estimated_savings: patientProfile?.total_savings ?? 0,
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
    return prescriptionRepository.getPrescriptions(patientId);
  },

  async getPatientPrescriptions(patientId: string): Promise<Prescription[]> {
    return this.getPrescriptions(patientId);
  },

  async getPatientProfile(patientId: string): Promise<Patient> {
    return this.getProfile(patientId);
  },

  async getPatientOffers(patientId: string): Promise<Offer[]> {
    await getRandomDelay();
    return offerRepository.getOffers(patientId);
  },

  async acceptOffer(offerId: string): Promise<Offer> {
    return import("./auction.service").then((s) => s.auctionService.acceptOffer(offerId));
  },

  async getAcceptedOffers(patientId: string): Promise<Offer[]> {
    await getRandomDelay();
    const offers = await offerRepository.getOffers(patientId);
    return offers.filter(
      (o) => o.status === "accepted" || o.status === "fulfilled"
    );
  },

  async uploadPrescription(
    patientId: string,
    patientName: string,
    notes?: string,
    medications?: Omit<Medication, "id">[],
    prescriptionFile?: File
  ): Promise<Prescription> {
    await getRandomDelay();

    let prescription_image_url: string | null = null;
    if (prescriptionFile) {
      if (process.env.NEXT_PUBLIC_USE_FIREBASE === "firebase") {
        try {
          const { storageHelper } = await import("@/lib/firebase/storage");
          const path = storageHelper.generateStoragePath("prescriptions", prescriptionFile.name);
          prescription_image_url = await storageHelper.uploadFile(prescriptionFile, path);
        } catch (err) {
          console.error("Firebase storage upload failed, falling back to base64:", err);
        }
      }

      if (!prescription_image_url) {
        prescription_image_url = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(prescriptionFile);
        });
      }
    }

    const newRx: Prescription = {
      id: `rx_${Math.random().toString(36).substr(2, 9)}`,
      patient_id: patientId,
      patient_name: patientName,
      status: PrescriptionStatus.PENDING_VERIFICATION,
      prescription_image_url,
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
