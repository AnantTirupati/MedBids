import { Auction, Bid } from "@/types";
import { mockAuctions, mockBids } from "@/lib/mock-data";

export const auctionService = {
  async getAuctions(): Promise<Auction[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockAuctions;
  },

  async getAuctionById(id: string): Promise<Auction> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const auction = mockAuctions.find((a) => a.id === id);
    if (!auction) throw new Error("Auction not found");
    return auction;
  },

  async getAuctionBids(auctionId: string): Promise<Bid[]> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return mockBids
      .filter((b) => b.auction_id === auctionId)
      .sort((a, b) => a.amount - b.amount); // Lowest bids first
  },
};

export default auctionService;
