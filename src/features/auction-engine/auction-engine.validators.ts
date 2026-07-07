import { Auction } from "@/types";
import { AUCTION_ENGINE_CONSTANTS } from "./auction-engine.constants";

export const auctionEngineValidators = {
  validateBidAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error("Bid amount must be a positive number.");
    }
    if (amount > AUCTION_ENGINE_CONSTANTS.MAX_BID_AMOUNT) {
      throw new Error(`Bid amount cannot exceed ${AUCTION_ENGINE_CONSTANTS.MAX_BID_AMOUNT}`);
    }
  },

  validateAuctionActive(auction: Auction): void {
    if (auction.status !== "live") {
      throw new Error("Bidding is locked. The auction is not active.");
    }
    const now = new Date();
    const endTime = new Date(auction.end_time);
    if (now >= endTime) {
      throw new Error("Bidding is locked. The auction has expired.");
    }
  },

  validateBidDerivation(amount: number, currentLowest: number | null): void {
    if (currentLowest !== null && amount >= currentLowest) {
      throw new Error(`Bid amount must be strictly lower than the current lowest bid of ₹${currentLowest}.`);
    }
  },
};
