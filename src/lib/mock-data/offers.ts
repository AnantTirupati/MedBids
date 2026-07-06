import { Offer, OfferStatus } from "@/types";
import { mockPrescriptions } from "./prescriptions";

export const mockOffers: Offer[] = [
  {
    id: "o1",
    bid_id: "b1",
    auction_id: "auc1",
    prescription_id: "rx1",
    patient_id: "p1",
    pharmacy_id: "pharm1",
    pharmacy_name: "Apollo Pharmacy",
    pharmacy_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcAFIy8qO6brIXU26lUqZ8yEvPoM3sjOsaPdIOcouQJF50FK6ukCCpcGQEmXFhYQnq5CcpJDapkCp8hElmtvDhMavZiT5Dy115WoH3468LR2c_EtDblF5OdQQnP1mUubCESQqQsJuya7VuoajPt5OJFSnk4XXf1kfn5UWwu1Wz8-1QwGesZmZWamiD1tEboBoKDTTkJA8A9ECFuw9DOGg8ZxVN1oLk9ecQ6crjfe4n3RLPxcM4-y_J",
    pharmacy_rating: 4.8,
    amount: 1850,
    delivery_time: "Within 2 hours",
    medications: mockPrescriptions[0].medications,
    status: OfferStatus.OPEN,
    accepted_at: null,
    fulfilled_at: null,
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "o2",
    bid_id: "b2",
    auction_id: "auc2",
    prescription_id: "rx3",
    patient_id: "p1",
    pharmacy_id: "pharm2",
    pharmacy_name: "MedPlus Pharmacy",
    pharmacy_avatar: null,
    pharmacy_rating: 4.6,
    amount: 120,
    delivery_time: "Self Pickup",
    medications: mockPrescriptions[2].medications,
    status: OfferStatus.FULFILLED,
    accepted_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    fulfilled_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  }
];
