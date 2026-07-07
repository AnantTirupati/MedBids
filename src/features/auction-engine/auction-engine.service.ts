import { Auction, Bid, Offer, Reservation, BidStatus } from "@/types";
import { auctionEngineRepository, auctionRepository, bidRepository } from "@/repositories";
import { auctionEngineValidators } from "./auction-engine.validators";
import { auctionEngineEvents } from "./auction-engine.events";
import { BidEventType } from "./auction-engine.types";

export const auctionEngineService = {
  async startAuction(prescriptionId: string, durationHours: number): Promise<Auction> {
    const auction = await auctionEngineRepository.startAuction(prescriptionId, durationHours);
    auctionEngineEvents.publishEvent(
      BidEventType.AUCTION_STARTED,
      auction.id,
      auction.prescription.patient_id,
      { prescriptionId, durationHours }
    );
    return auction;
  },

  async submitBid(
    auctionId: string,
    pharmacyId: string,
    amount: number,
    deliveryTime: string,
    notes?: string
  ): Promise<Bid> {
    // 1. Validator checks
    auctionEngineValidators.validateBidAmount(amount);

    const auction = await auctionRepository.getAuctionById(auctionId);
    if (!auction) throw new Error("Auction not found");
    auctionEngineValidators.validateAuctionActive(auction);
    auctionEngineValidators.validateBidDerivation(amount, auction.lowest_bid);

    // 2. Transact bid creation
    const { pharmacyRepository } = await import("@/repositories");
    const pharmacy = await pharmacyRepository.getPharmacyById(pharmacyId);
    if (!pharmacy) throw new Error("Pharmacy not registered");

    // Deactivate previous active bids first
    const bids = await bidRepository.getBidsByAuctionId(auctionId);
    for (const b of bids) {
      if (b.pharmacy_id === pharmacyId && b.status === BidStatus.ACTIVE) {
        await bidRepository.updateBid({ ...b, status: BidStatus.OUTBID });
      }
    }

    const newBid: Bid = {
      id: `b_${Math.random().toString(36).substr(2, 9)}`,
      auction_id: auctionId,
      pharmacy_id: pharmacyId,
      pharmacy_name: pharmacy.pharmacy_name,
      pharmacy_avatar: pharmacy.avatar_url,
      pharmacy_rating: pharmacy.rating,
      amount,
      delivery_time: deliveryTime,
      notes: notes || null,
      status: BidStatus.ACTIVE,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const bid = await bidRepository.createBidTransaction(newBid);

    // 3. Event Publish
    auctionEngineEvents.publishEvent(
      BidEventType.BID_PLACED,
      auctionId,
      pharmacyId,
      { bidId: bid.id, amount }
    );

    return bid;
  },

  async updateBid(bidId: string, amount: number): Promise<Bid> {
    auctionEngineValidators.validateBidAmount(amount);

    const bid = await bidRepository.getBidById(bidId);
    if (!bid) throw new Error("Bid not found");

    const auction = await auctionRepository.getAuctionById(bid.auction_id);
    if (!auction) throw new Error("Auction not found");
    auctionEngineValidators.validateAuctionActive(auction);
    auctionEngineValidators.validateBidDerivation(amount, auction.lowest_bid);

    const updatedBid = await bidRepository.updateBidTransaction(bidId, amount);

    auctionEngineEvents.publishEvent(
      BidEventType.BID_UPDATED,
      bid.auction_id,
      bid.pharmacy_id,
      { bidId, amount }
    );

    return updatedBid;
  },

  async withdrawBid(bidId: string): Promise<Bid> {
    const bid = await bidRepository.getBidById(bidId);
    if (!bid) throw new Error("Bid not found");

    const updatedBid = await bidRepository.withdrawBidTransaction(bidId);

    auctionEngineEvents.publishEvent(
      BidEventType.BID_WITHDRAWN,
      bid.auction_id,
      bid.pharmacy_id,
      { bidId }
    );

    return updatedBid;
  },

  async closeAuction(auctionId: string): Promise<{ auction: Auction; offer: Offer | null; reservation: Reservation | null }> {
    const result = await auctionEngineRepository.closeAuction(auctionId);

    auctionEngineEvents.publishEvent(
      BidEventType.AUCTION_ENDED,
      auctionId,
      result.auction.prescription.patient_id,
      {
        status: result.auction.status,
        winningOfferId: result.offer?.id || null,
        reservationId: result.reservation?.id || null,
      }
    );

    return result;
  },

  async acceptOffer(offerId: string): Promise<{ offer: Offer; reservation: Reservation }> {
    const result = await auctionEngineRepository.acceptWinningOffer(offerId);

    auctionEngineEvents.publishEvent(
      BidEventType.OFFER_ACCEPTED,
      result.offer.auction_id,
      result.offer.patient_id,
      { offerId, reservationId: result.reservation.id }
    );

    return result;
  },
};

export default auctionEngineService;
