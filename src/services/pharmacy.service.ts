import { Pharmacy, Bid, PharmacyDashboardStats, Auction, BidStatus, AuctionStatus } from "@/types";
import {
  pharmacyRepository,
  bidRepository,
  auctionRepository,
} from "@/repositories";
import { getRandomDelay } from "@/utils/delay";
import { pharmacyProfileSchema } from "@/lib/validation";
import { auctionEngineService } from "@/features/auction-engine/auction-engine.service";

export const pharmacyService = {
  async getDashboard(pharmacyId: string): Promise<PharmacyDashboardStats> {
    await getRandomDelay();
    const bids = await bidRepository.getBidsByPharmacyId(pharmacyId);
    const wins = bids.filter((b) => b.status === BidStatus.WON).length;
    const auctions = await auctionRepository.getAuctions();

    return {
      active_auctions: auctions.filter((a) => a.status === AuctionStatus.LIVE).length,
      bids_placed: bids.length,
      bids_won: wins,
      win_rate: bids.length > 0 ? Math.round((wins / bids.length) * 100) : 0,
      revenue_this_month: wins * 1500,
      avg_response_time: "10 minutes",
    };
  },

  async getAvailableAuctions(): Promise<Auction[]> {
    await getRandomDelay();
    const auctions = await auctionRepository.getAuctions();
    return auctions.filter((a) => a.status === AuctionStatus.LIVE);
  },

  async submitBid(
    auctionId: string,
    pharmacyId: string,
    amount: number,
    deliveryTime: string,
    notes?: string
  ): Promise<Bid> {
    return auctionEngineService.submitBid(auctionId, pharmacyId, amount, deliveryTime, notes);
  },

  async updateBid(bidId: string, amount: number): Promise<Bid> {
    return auctionEngineService.updateBid(bidId, amount);
  },

  async withdrawBid(bidId: string): Promise<Bid> {
    return auctionEngineService.withdrawBid(bidId);
  },

  async getMyBids(pharmacyId: string): Promise<Bid[]> {
    await getRandomDelay();
    return bidRepository.getBidsByPharmacyId(pharmacyId);
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
    const pharmacy = await pharmacyRepository.getPharmacyById(pharmacyId);
    if (!pharmacy) throw new Error("Pharmacy not found");
    return pharmacy;
  },

  async updateProfile(pharmacyId: string, profileData: Partial<Pharmacy>): Promise<Pharmacy> {
    await getRandomDelay();
    // Validate with Zod (using .partial() so updates can be partial)
    const validated = pharmacyProfileSchema.partial().parse(profileData);
    
    const existing = await pharmacyRepository.getPharmacyById(pharmacyId);
    if (!existing) throw new Error("Pharmacy not found");

    const updated = {
      ...existing,
      ...validated,
      updated_at: new Date().toISOString(),
    } as Pharmacy;

    return pharmacyRepository.updatePharmacy(updated);
  },

  async getPharmacyBids(pharmacyId: string): Promise<Bid[]> {
    return this.getMyBids(pharmacyId);
  },

  async getPharmacyProfile(pharmacyId: string): Promise<Pharmacy> {
    return this.getProfile(pharmacyId);
  },
};

export default pharmacyService;
