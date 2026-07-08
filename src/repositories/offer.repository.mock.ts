import { OfferRepository } from "./interfaces/offer.repository";
import { mockOffers } from "@/lib/mock-data";
import { Offer } from "@/types";

const patientListeners: Map<string, Set<(offers: Offer[]) => void>> = new Map();
const pharmacyListeners: Map<string, Set<(offers: Offer[]) => void>> = new Map();

function notifyOfferListeners(patientId: string, pharmacyId: string) {
  const pSets = patientListeners.get(patientId);
  if (pSets) {
    pSets.forEach((cb) => cb(mockOffers.filter((o) => o.patient_id === patientId).map((o) => ({ ...o }))));
  }
  const phSets = pharmacyListeners.get(pharmacyId);
  if (phSets) {
    phSets.forEach((cb) => cb(mockOffers.filter((o) => o.pharmacy_id === pharmacyId).map((o) => ({ ...o }))));
  }
}

export const offerRepositoryMock: OfferRepository = {
  async getOffers(patientId?: string): Promise<Offer[]> {
    if (patientId) {
      return mockOffers.filter((o) => o.patient_id === patientId);
    }
    return mockOffers;
  },

  async getOfferById(id: string): Promise<Offer | null> {
    const offer = mockOffers.find((o) => o.id === id);
    return offer || null;
  },

  async createOffer(offer: Offer): Promise<Offer> {
    mockOffers.push(offer);
    notifyOfferListeners(offer.patient_id, offer.pharmacy_id);
    return offer;
  },

  async updateOffer(offer: Offer): Promise<Offer> {
    const index = mockOffers.findIndex((o) => o.id === offer.id);
    if (index !== -1) {
      mockOffers[index] = {
        ...mockOffers[index],
        ...offer,
      };
      notifyOfferListeners(offer.patient_id, offer.pharmacy_id);
      return mockOffers[index];
    }
    throw new Error("Offer not found");
  },

  subscribeOffersByPatientId(patientId: string, callback: (offers: Offer[]) => void): () => void {
    if (!patientListeners.has(patientId)) {
      patientListeners.set(patientId, new Set());
    }
    patientListeners.get(patientId)!.add(callback);
    callback(mockOffers.filter((o) => o.patient_id === patientId));
    return () => {
      const sets = patientListeners.get(patientId);
      if (sets) {
        sets.delete(callback);
        if (sets.size === 0) {
          patientListeners.delete(patientId);
        }
      }
    };
  },

  subscribeOffersByPharmacyId(pharmacyId: string, callback: (offers: Offer[]) => void): () => void {
    if (!pharmacyListeners.has(pharmacyId)) {
      pharmacyListeners.set(pharmacyId, new Set());
    }
    pharmacyListeners.get(pharmacyId)!.add(callback);
    callback(mockOffers.filter((o) => o.pharmacy_id === pharmacyId));
    return () => {
      const sets = pharmacyListeners.get(pharmacyId);
      if (sets) {
        sets.delete(callback);
        if (sets.size === 0) {
          pharmacyListeners.delete(pharmacyId);
        }
      }
    };
  },
};

export default offerRepositoryMock;
