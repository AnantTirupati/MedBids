import { Auction, Bid, Offer, Reservation } from "@/types";

export interface AuctionEngineRepository {
  startAuction(prescriptionId: string, durationHours: number): Promise<Auction>;
  closeAuction(auctionId: string): Promise<{ auction: Auction; offer: Offer | null; reservation: Reservation | null }>;
  getLowestBid(auctionId: string): Promise<Bid | null>;
  calculateWinner(auctionId: string): Promise<Bid | null>;
  acceptWinningOffer(offerId: string): Promise<{ offer: Offer; reservation: Reservation }>;
  recalculateAuction(auctionId: string): Promise<Auction>;
}
