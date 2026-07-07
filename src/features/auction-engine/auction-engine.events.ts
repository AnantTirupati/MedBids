import { BidEvent, BidEventType } from "./auction-engine.types";
import { logAuctionEngineEvent } from "@/hooks/useAuctionEvents";

export const auctionEngineEvents = {
  publishEvent(type: BidEventType, auctionId: string, userId: string, details: Record<string, unknown>): BidEvent {
    const event: BidEvent = {
      id: `evt_${Math.random().toString(36).substr(2, 9)}`,
      type,
      auction_id: auctionId,
      user_id: userId,
      timestamp: new Date().toISOString(),
      details,
    };
    
    // In dev mode, print logs as requested
    console.log(`[AuctionEngineEvent] [${event.timestamp}] Type: ${type} | Auction: ${auctionId} | User: ${userId}`, details);
    
    // Log to useAuctionEvents hook registry
    try {
      logAuctionEngineEvent(event);
    } catch {
      // ignore
    }

    return event;
  },
};
