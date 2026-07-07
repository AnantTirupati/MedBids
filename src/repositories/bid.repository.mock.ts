import { BidRepository } from "./interfaces/bid.repository";
import { mockBids, mockAuctions } from "@/lib/mock-data";
import { Bid, BidStatus, Auction } from "@/types";

const bidListeners: Map<string, Set<(bids: Bid[]) => void>> = new Map();

function notifyBidListeners(auctionId: string) {
  const sets = bidListeners.get(auctionId);
  if (sets) {
    const list = mockBids.filter((b) => b.auction_id === auctionId);
    sets.forEach((cb) => cb(list.map((b) => ({ ...b }))));
  }
}

export const bidRepositoryMock: BidRepository = {
  async getBids(): Promise<Bid[]> {
    return mockBids;
  },

  async getBidById(id: string): Promise<Bid | null> {
    const bid = mockBids.find((b) => b.id === id);
    return bid || null;
  },

  async getBidsByAuctionId(auctionId: string): Promise<Bid[]> {
    return mockBids.filter((b) => b.auction_id === auctionId);
  },

  async getBidsByPharmacyId(pharmacyId: string): Promise<Bid[]> {
    return mockBids.filter((b) => b.pharmacy_id === pharmacyId);
  },

  async createBid(bid: Bid): Promise<Bid> {
    mockBids.push(bid);
    notifyBidListeners(bid.auction_id);
    return bid;
  },

  async updateBid(bid: Bid): Promise<Bid> {
    const index = mockBids.findIndex((b) => b.id === bid.id);
    if (index !== -1) {
      mockBids[index] = {
        ...mockBids[index],
        ...bid,
        updated_at: new Date().toISOString(),
      };
      notifyBidListeners(bid.auction_id);
      return mockBids[index];
    }
    throw new Error("Bid not found");
  },

  async createBidTransaction(bid: Bid): Promise<Bid> {
    const auction = mockAuctions.find((a: Auction) => a.id === bid.auction_id);
    if (!auction) throw new Error("Auction not found");
    if (auction.status !== "live") throw new Error("Auction is no longer active");

    if (auction.lowest_bid && bid.amount >= auction.lowest_bid) {
      throw new Error("Bid amount must be lower than the current lowest bid");
    }

    mockBids.push(bid);
    auction.total_bids = (auction.total_bids || 0) + 1;
    auction.lowest_bid = bid.amount;
    notifyBidListeners(bid.auction_id);
    return bid;
  },

  async updateBidTransaction(bidId: string, amount: number): Promise<Bid> {
    const bid = mockBids.find((b) => b.id === bidId);
    if (!bid) throw new Error("Bid not found");

    const auction = mockAuctions.find((a: Auction) => a.id === bid.auction_id);
    if (!auction) throw new Error("Auction not found");
    if (auction.status !== "live") throw new Error("Auction is no longer active");

    if (auction.lowest_bid && amount >= auction.lowest_bid && bid.amount !== auction.lowest_bid) {
      throw new Error("Bid amount must be lower than the current lowest bid");
    }

    bid.amount = amount;
    bid.updated_at = new Date().toISOString();

    // Recalculate lowest bid for this auction
    const activeBids = mockBids.filter((b) => b.auction_id === auction.id && b.status === "active");
    if (activeBids.length > 0) {
      auction.lowest_bid = Math.min(...activeBids.map((b) => b.amount));
    } else {
      auction.lowest_bid = amount;
    }

    notifyBidListeners(bid.auction_id);
    return bid;
  },

  async withdrawBidTransaction(bidId: string): Promise<Bid> {
    const bid = mockBids.find((b) => b.id === bidId);
    if (!bid) throw new Error("Bid not found");

    bid.status = BidStatus.WITHDRAWN;
    bid.updated_at = new Date().toISOString();

    const auction = mockAuctions.find((a: Auction) => a.id === bid.auction_id);
    if (auction) {
      auction.total_bids = Math.max(0, (auction.total_bids || 1) - 1);
      const activeBids = mockBids.filter((b) => b.auction_id === auction.id && b.status === "active");
      if (activeBids.length > 0) {
        auction.lowest_bid = Math.min(...activeBids.map((b) => b.amount));
      } else {
        auction.lowest_bid = null;
      }
    }

    notifyBidListeners(bid.auction_id);
    return bid;
  },

  subscribeBidsByAuctionId(auctionId: string, callback: (bids: Bid[]) => void): () => void {
    if (!bidListeners.has(auctionId)) {
      bidListeners.set(auctionId, new Set());
    }
    bidListeners.get(auctionId)!.add(callback);
    callback(mockBids.filter((b) => b.auction_id === auctionId));
    return () => {
      const sets = bidListeners.get(auctionId);
      if (sets) {
        sets.delete(callback);
        if (sets.size === 0) {
          bidListeners.delete(auctionId);
        }
      }
    };
  },
};

export default bidRepositoryMock;
