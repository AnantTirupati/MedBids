import { Bid } from "@/types";

export interface BidRepository {
  getBids(): Promise<Bid[]>;
  getBidById(id: string): Promise<Bid | null>;
  getBidsByAuctionId(auctionId: string): Promise<Bid[]>;
  getBidsByPharmacyId(pharmacyId: string): Promise<Bid[]>;
  createBid(bid: Bid): Promise<Bid>;
  updateBid(bid: Bid): Promise<Bid>;
  createBidTransaction(bid: Bid): Promise<Bid>;
  updateBidTransaction(bidId: string, amount: number): Promise<Bid>;
  withdrawBidTransaction(bidId: string): Promise<Bid>;
  subscribeBidsByAuctionId(auctionId: string, callback: (bids: Bid[]) => void): () => void;
}
