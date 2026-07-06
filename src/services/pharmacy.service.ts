import { Pharmacy, Bid, PharmacyDashboardStats } from "@/types";
import { mockPharmacies, mockBids, mockAuctions } from "@/lib/mock-data";

export const pharmacyService = {
  async getPharmacyProfile(pharmacyId: string): Promise<Pharmacy> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const pharmacy = mockPharmacies.find((p) => p.id === pharmacyId);
    if (!pharmacy) throw new Error("Pharmacy not found");
    return pharmacy;
  },

  async getPharmacyBids(pharmacyId: string): Promise<Bid[]> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return mockBids.filter((b) => b.pharmacy_id === pharmacyId);
  },

  async getDashboardStats(pharmacyId: string): Promise<PharmacyDashboardStats> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const bids = mockBids.filter((b) => b.pharmacy_id === pharmacyId);
    const activeBids = bids.filter((b) => b.status === "active").length;
    const wins = bids.filter((b) => b.status === "won").length;

    return {
      active_auctions: mockAuctions.filter((a) => a.status === "live").length,
      bids_placed: bids.length,
      bids_won: wins,
      win_rate: bids.length > 0 ? Math.round((wins / bids.length) * 100) : 0,
      revenue_this_month: wins * 1500, // Simulated metric
      avg_response_time: "10 minutes",
    };
  },

  async placeBid(auctionId: string, pharmacyId: string, amount: number, deliveryTime: string, notes?: string): Promise<Bid> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pharmacy = mockPharmacies.find((p) => p.id === pharmacyId);
    if (!pharmacy) throw new Error("Pharmacy not registered");

    // Deactivate previous active bid for this pharmacy on this auction
    mockBids.forEach((b) => {
      if (b.auction_id === auctionId && b.pharmacy_id === pharmacyId && b.status === "active") {
        b.status = "outbid";
      }
    });

    const newBid: Bid = {
      id: `b_new_${Math.random().toString(36).substr(2, 9)}`,
      auction_id: auctionId,
      pharmacy_id: pharmacyId,
      pharmacy_name: pharmacy.pharmacy_name,
      pharmacy_avatar: pharmacy.avatar_url,
      pharmacy_rating: pharmacy.rating,
      amount,
      delivery_time: deliveryTime,
      notes: notes || null,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Simulate appending to the local bids array
    mockBids.push(newBid);

    // Update auction bids count and lowest bid if necessary
    const auction = mockAuctions.find((a) => a.id === auctionId);
    if (auction) {
      auction.total_bids += 1;
      if (!auction.lowest_bid || amount < auction.lowest_bid) {
        auction.lowest_bid = amount;
      }
    }

    return newBid;
  },
};

export default pharmacyService;
