import { Auction, Bid, Offer, AuctionStatus } from "@/types";
import {
  auctionRepository,
  bidRepository,
} from "@/repositories";
import { getRandomDelay } from "@/utils/delay";
import { auctionEngineService } from "@/features/auction-engine/auction-engine.service";

export const auctionService = {
  async getAuctions(): Promise<Auction[]> {
    await getRandomDelay();
    return auctionRepository.getAuctions();
  },

  async getLiveAuctions(): Promise<Auction[]> {
    await getRandomDelay();
    const auctions = await auctionRepository.getAuctions();
    return auctions.filter((a) => a.status === AuctionStatus.LIVE);
  },

  async getAuction(id: string): Promise<Auction> {
    await getRandomDelay();
    const auction = await auctionRepository.getAuctionById(id);
    if (!auction) throw new Error("Auction not found");
    return auction;
  },

  async getAuctionHistory(auctionId: string): Promise<Bid[]> {
    await getRandomDelay();
    const bids = await bidRepository.getBidsByAuctionId(auctionId);
    return bids.sort((a, b) => a.amount - b.amount); // Lowest bids first
  },

  async acceptOffer(offerId: string): Promise<Offer> {
    await getRandomDelay();
    const result = await auctionEngineService.acceptOffer(offerId);
    return result.offer;
  },

  async cancelAuction(auctionId: string): Promise<Auction> {
    await getRandomDelay();
    const auction = await auctionRepository.getAuctionById(auctionId);
    if (!auction) throw new Error("Auction not found");

    auction.status = AuctionStatus.CANCELLED;
    await auctionRepository.updateAuction(auction);
    return auction;
  },
};

export default auctionService;
