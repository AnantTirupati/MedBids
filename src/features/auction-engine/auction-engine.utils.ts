import { Bid } from "@/types";
import { AuctionEngineState } from "./auction-engine.types";

export const auctionEngineUtils = {
  calculateEngineState(bids: Bid[]): AuctionEngineState {
    const activeBids = bids.filter((b) => b.status === "active");
    if (activeBids.length === 0) {
      return {
        lowestBid: null,
        lowestBidder: null,
        bidCount: 0,
        lastBidTime: null,
      };
    }

    let lowestBid = activeBids[0].amount;
    let lowestBidder = activeBids[0].pharmacy_id;
    let lastBidTime = activeBids[0].created_at;

    for (let i = 1; i < activeBids.length; i++) {
      const bid = activeBids[i];
      if (bid.amount < lowestBid) {
        lowestBid = bid.amount;
        lowestBidder = bid.pharmacy_id;
      }
      if (new Date(bid.created_at) > new Date(lastBidTime)) {
        lastBidTime = bid.created_at;
      }
    }

    return {
      lowestBid,
      lowestBidder,
      bidCount: activeBids.length,
      lastBidTime,
    };
  },
};
