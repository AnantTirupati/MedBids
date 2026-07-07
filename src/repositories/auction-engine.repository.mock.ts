import { AuctionEngineRepository } from "./interfaces/auction-engine.repository";
import { Auction, Bid, Offer, Reservation, PrescriptionStatus, AuctionStatus, OfferStatus, ReservationStatus } from "@/types";
import { mockAuctions, mockBids, mockOffers, mockReservations, mockPrescriptions } from "@/lib/mock-data";

export const auctionEngineRepositoryMock: AuctionEngineRepository = {
  async startAuction(prescriptionId: string, durationHours: number): Promise<Auction> {
    const rx = mockPrescriptions.find((p) => p.id === prescriptionId);
    if (!rx) throw new Error("Prescription not found");

    const now = new Date();
    const endTime = new Date(now.getTime() + durationHours * 60 * 60 * 1000);

    const auction: Auction = {
      id: `a_${Math.random().toString(36).substr(2, 9)}`,
      prescription_id: prescriptionId,
      prescription: rx,
      status: AuctionStatus.LIVE,
      start_time: now.toISOString(),
      end_time: endTime.toISOString(),
      duration_minutes: durationHours * 60,
      total_bids: 0,
      lowest_bid: null,
      highest_bid: null,
      created_at: now.toISOString(),
    };

    mockAuctions.push(auction);
    rx.status = PrescriptionStatus.AUCTION_LIVE;
    return auction;
  },

  async closeAuction(auctionId: string): Promise<{ auction: Auction; offer: Offer | null; reservation: Reservation | null }> {
    const auction = mockAuctions.find((a) => a.id === auctionId);
    if (!auction) throw new Error("Auction not found");
    if (auction.status !== AuctionStatus.LIVE) {
      throw new Error("Auction is not active");
    }

    const activeBids = mockBids.filter((b) => b.auction_id === auctionId && b.status === BidStatus.ACTIVE);

    if (activeBids.length === 0) {
      auction.status = AuctionStatus.ENDED;
      // Also revert prescription status back to pending/new
      const rx = mockPrescriptions.find((p) => p.id === auction.prescription_id);
      if (rx) {
        rx.status = PrescriptionStatus.VERIFIED;
      }
      return { auction, offer: null, reservation: null };
    }

    // Sort to find lowest bid amount
    activeBids.sort((a, b) => a.amount - b.amount);
    const winningBid = activeBids[0];

    // Determine auto-award condition
    // For mock patient, assume auto_award true for testing
    const autoAward = true;

    const offer: Offer = {
      id: `o_${Math.random().toString(36).substr(2, 9)}`,
      bid_id: winningBid.id,
      auction_id: auctionId,
      prescription_id: auction.prescription_id,
      patient_id: auction.prescription.patient_id,
      pharmacy_id: winningBid.pharmacy_id,
      pharmacy_name: winningBid.pharmacy_name,
      pharmacy_avatar: winningBid.pharmacy_avatar,
      pharmacy_rating: winningBid.pharmacy_rating,
      amount: winningBid.amount,
      delivery_time: winningBid.delivery_time,
      medications: auction.prescription.medications,
      status: autoAward ? OfferStatus.ACCEPTED : OfferStatus.OPEN,
      created_at: new Date().toISOString(),
      accepted_at: autoAward ? new Date().toISOString() : null,
      fulfilled_at: null,
    };

    mockOffers.push(offer);
    auction.status = AuctionStatus.ENDED;

    let reservation: Reservation | null = null;
    const rx = mockPrescriptions.find((p) => p.id === auction.prescription_id);

    if (autoAward) {
      reservation = {
        id: `r_${Math.random().toString(36).substr(2, 9)}`,
        offer_id: offer.id,
        patient_id: offer.patient_id,
        pharmacy_id: offer.pharmacy_id,
        status: ReservationStatus.PENDING,
        pickup_code: Math.floor(1000 + Math.random() * 9000).toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockReservations.push(reservation);
      if (rx) rx.status = PrescriptionStatus.OFFER_ACCEPTED;
    } else {
      if (rx) rx.status = PrescriptionStatus.AUCTION_ENDED;
    }

    // Mark other bids as lost
    activeBids.forEach((b) => {
      if (b.id !== winningBid.id) {
        b.status = BidStatus.LOST;
      } else {
        b.status = BidStatus.WON;
      }
    });

    return { auction, offer, reservation };
  },

  async getLowestBid(auctionId: string): Promise<Bid | null> {
    const activeBids = mockBids.filter((b) => b.auction_id === auctionId && b.status === BidStatus.ACTIVE);
    if (activeBids.length === 0) return null;
    activeBids.sort((a, b) => a.amount - b.amount);
    return activeBids[0];
  },

  async calculateWinner(auctionId: string): Promise<Bid | null> {
    return this.getLowestBid(auctionId);
  },

  async acceptWinningOffer(offerId: string): Promise<{ offer: Offer; reservation: Reservation }> {
    const offer = mockOffers.find((o) => o.id === offerId);
    if (!offer) throw new Error("Offer not found");

    offer.status = OfferStatus.ACCEPTED;
    offer.accepted_at = new Date().toISOString();

    const reservation: Reservation = {
      id: `r_${Math.random().toString(36).substr(2, 9)}`,
      offer_id: offer.id,
      patient_id: offer.patient_id,
      pharmacy_id: offer.pharmacy_id,
      status: ReservationStatus.PENDING,
      pickup_code: Math.floor(1000 + Math.random() * 9000).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockReservations.push(reservation);

    const rx = mockPrescriptions.find((p) => p.id === offer.prescription_id);
    if (rx) rx.status = PrescriptionStatus.OFFER_ACCEPTED;

    const auction = mockAuctions.find((a) => a.id === offer.auction_id);
    if (auction) auction.status = AuctionStatus.ENDED;

    return { offer, reservation };
  },

  async recalculateAuction(auctionId: string): Promise<Auction> {
    const auction = mockAuctions.find((a) => a.id === auctionId);
    if (!auction) throw new Error("Auction not found");

    const activeBids = mockBids.filter((b) => b.auction_id === auctionId && b.status === BidStatus.ACTIVE);
    auction.total_bids = activeBids.length;
    if (activeBids.length > 0) {
      activeBids.sort((a, b) => a.amount - b.amount);
      auction.lowest_bid = activeBids[0].amount;
    } else {
      auction.lowest_bid = null;
    }

    return auction;
  },
};

// Internal import helper to resolve missing typescript definitions in mock compile
import { BidStatus } from "@/types";

export default auctionEngineRepositoryMock;
