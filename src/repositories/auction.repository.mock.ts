import { AuctionRepository } from "./interfaces/auction.repository";
import { mockAuctions } from "@/lib/mock-data";
import { Auction } from "@/types";

const listeners: Set<(auctions: Auction[]) => void> = new Set();
const singleListeners: Map<string, Set<(auction: Auction | null) => void>> = new Map();

function notifyListeners(id?: string) {
  listeners.forEach((cb) => cb([...mockAuctions]));
  if (id) {
    const sets = singleListeners.get(id);
    if (sets) {
      const auction = mockAuctions.find((a) => a.id === id) || null;
      sets.forEach((cb) => cb(auction ? { ...auction } : null));
    }
  }
}

export const auctionRepositoryMock: AuctionRepository = {
  async getAuctions(): Promise<Auction[]> {
    return mockAuctions;
  },

  async getAuctionById(id: string): Promise<Auction | null> {
    const auction = mockAuctions.find((a) => a.id === id);
    return auction || null;
  },

  async createAuction(auction: Auction): Promise<Auction> {
    mockAuctions.push(auction);
    notifyListeners(auction.id);
    return auction;
  },

  async updateAuction(auction: Auction): Promise<Auction> {
    const index = mockAuctions.findIndex((a) => a.id === auction.id);
    if (index !== -1) {
      mockAuctions[index] = {
        ...mockAuctions[index],
        ...auction,
      };
      notifyListeners(auction.id);
      return mockAuctions[index];
    }
    throw new Error("Auction not found");
  },

  subscribeAuctions(callback: (auctions: Auction[]) => void): () => void {
    listeners.add(callback);
    callback([...mockAuctions]);
    return () => {
      listeners.delete(callback);
    };
  },

  subscribeAuctionById(id: string, callback: (auction: Auction | null) => void): () => void {
    if (!singleListeners.has(id)) {
      singleListeners.set(id, new Set());
    }
    singleListeners.get(id)!.add(callback);
    const auction = mockAuctions.find((a) => a.id === id) || null;
    callback(auction ? { ...auction } : null);
    return () => {
      const sets = singleListeners.get(id);
      if (sets) {
        sets.delete(callback);
        if (sets.size === 0) {
          singleListeners.delete(id);
        }
      }
    };
  },
};

export default auctionRepositoryMock;
