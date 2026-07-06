import { Auction, Bid, Offer, OfferStatus, PrescriptionStatus, AuctionStatus } from "@/types";
import { mockAuctions, mockBids, mockOffers, mockPrescriptions } from "@/lib/mock-data";
import { getRandomDelay } from "@/utils/delay";

export const auctionService = {
  async getAuctions(): Promise<Auction[]> {
    await getRandomDelay();
    return mockAuctions;
  },

  async getLiveAuctions(): Promise<Auction[]> {
    await getRandomDelay();
    return mockAuctions.filter((a) => a.status === AuctionStatus.LIVE);
  },

  async getAuction(id: string): Promise<Auction> {
    await getRandomDelay();
    const auction = mockAuctions.find((a) => a.id === id);
    if (!auction) throw new Error("Auction not found");
    return auction;
  },

  async getAuctionHistory(auctionId: string): Promise<Bid[]> {
    await getRandomDelay();
    return mockBids
      .filter((b) => b.auction_id === auctionId)
      .sort((a, b) => a.amount - b.amount); // Lowest bids first
  },

  async acceptOffer(offerId: string): Promise<Offer> {
    await getRandomDelay();
    const offer = mockOffers.find((o) => o.id === offerId);
    if (!offer) throw new Error("Offer not found");

    offer.status = OfferStatus.ACCEPTED;
    offer.accepted_at = new Date().toISOString();

    const rx = mockPrescriptions.find((r) => r.id === offer.prescription_id);
    if (rx) {
      rx.status = PrescriptionStatus.OFFER_ACCEPTED;
    }

    const auction = mockAuctions.find((a) => a.id === offer.auction_id);
    if (auction) {
      auction.status = AuctionStatus.ENDED;
    }

    return offer;
  },

  async cancelAuction(auctionId: string): Promise<Auction> {
    await getRandomDelay();
    const auction = mockAuctions.find((a) => a.id === auctionId);
    if (!auction) throw new Error("Auction not found");

    auction.status = AuctionStatus.CANCELLED;
    return auction;
  },
};

export default auctionService;
