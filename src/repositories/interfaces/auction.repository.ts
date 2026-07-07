import { Auction } from "@/types";

export interface AuctionRepository {
  getAuctions(): Promise<Auction[]>;
  getAuctionById(id: string): Promise<Auction | null>;
  createAuction(auction: Auction): Promise<Auction>;
  updateAuction(auction: Auction): Promise<Auction>;
  subscribeAuctions(callback: (auctions: Auction[]) => void): () => void;
  subscribeAuctionById(id: string, callback: (auction: Auction | null) => void): () => void;
}
