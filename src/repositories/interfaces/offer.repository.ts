import { Offer } from "@/types";

export interface OfferRepository {
  getOffers(): Promise<Offer[]>;
  getOfferById(id: string): Promise<Offer | null>;
  createOffer(offer: Offer): Promise<Offer>;
  updateOffer(offer: Offer): Promise<Offer>;
  subscribeOffersByPatientId(patientId: string, callback: (offers: Offer[]) => void): () => void;
  subscribeOffersByPharmacyId(pharmacyId: string, callback: (offers: Offer[]) => void): () => void;
}
