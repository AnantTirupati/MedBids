import { Pharmacy, Bid, PharmacyDashboardStats, Auction, BidStatus, AuctionStatus } from "@/types";
import { mockPharmacies, mockBids, mockAuctions } from "@/lib/mock-data";
import { getRandomDelay } from "@/utils/delay";

export const pharmacyService = {
  async getDashboard(pharmacyId: string): Promise<PharmacyDashboardStats> {
    await getRandomDelay();
    const bids = mockBids.filter((b) => b.pharmacy_id === pharmacyId);
    const wins = bids.filter((b) => b.status === BidStatus.WON).length;

    return {
      active_auctions: mockAuctions.filter((a) => a.status === AuctionStatus.LIVE).length,
      bids_placed: bids.length,
      bids_won: wins,
      win_rate: bids.length > 0 ? Math.round((wins / bids.length) * 100) : 0,
      revenue_this_month: wins * 1500,
      avg_response_time: "10 minutes",
    };
  },

  async getAvailableAuctions(): Promise<Auction[]> {
    await getRandomDelay();
    return mockAuctions.filter((a) => a.status === AuctionStatus.LIVE);
  },

  async submitBid(
    auctionId: string,
    pharmacyId: string,
    amount: number,
    deliveryTime: string,
    notes?: string
  ): Promise<Bid> {
    await getRandomDelay();
    const pharmacy = mockPharmacies.find((p) => p.id === pharmacyId);
    if (!pharmacy) throw new Error("Pharmacy not registered");

    // Deactivate previous active bid for this pharmacy on this auction
    mockBids.forEach((b) => {
      if (b.auction_id === auctionId && b.pharmacy_id === pharmacyId && b.status === BidStatus.ACTIVE) {
        b.status = BidStatus.OUTBID;
      }
    });

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

    mockBids.push(newBid);

    // Update auction bids count and lowest bid
    const auction = mockAuctions.find((a) => a.id === auctionId);
    if (auction) {
      auction.total_bids += 1;
      if (!auction.lowest_bid || amount < auction.lowest_bid) {
        auction.lowest_bid = amount;
      }
    }

    return newBid;
  },

  async updateBid(bidId: string, amount: number): Promise<Bid> {
    await getRandomDelay();
    const bid = mockBids.find((b) => b.id === bidId);
    if (!bid) throw new Error("Bid not found");

    bid.amount = amount;
    bid.updated_at = new Date().toISOString();

    const auction = mockAuctions.find((a) => a.id === bid.auction_id);
    if (auction) {
      if (!auction.lowest_bid || amount < auction.lowest_bid) {
        auction.lowest_bid = amount;
      }
    }

    return bid;
  },

  async getMyBids(pharmacyId: string): Promise<Bid[]> {
    await getRandomDelay();
    return mockBids.filter((b) => b.pharmacy_id === pharmacyId);
  },

  async getDashboardStats(pharmacyId: string): Promise<PharmacyDashboardStats> {
    return this.getDashboard(pharmacyId);
  },

  async placeBid(
    auctionId: string,
    pharmacyId: string,
    amount: number,
    deliveryTime: string,
    notes?: string
  ): Promise<Bid> {
    return this.submitBid(auctionId, pharmacyId, amount, deliveryTime, notes);
  },

  async getProfile(pharmacyId: string): Promise<Pharmacy> {
    await getRandomDelay();
    const pharmacy = mockPharmacies.find((p) => p.id === pharmacyId);
    if (!pharmacy) throw new Error("Pharmacy not found");
    return pharmacy;
  },

  async getPharmacyBids(pharmacyId: string): Promise<Bid[]> {
    return this.getMyBids(pharmacyId);
  },

  async getPharmacyProfile(pharmacyId: string): Promise<Pharmacy> {
    return this.getProfile(pharmacyId);
  },
};

export default pharmacyService;
