import * as React from "react";
import { BidEvent } from "@/features/auction-engine/auction-engine.types";

// Static array in memory to hold simulated logs during local dev/runtime
const eventLogs: BidEvent[] = [];

export function useAuctionEvents(auctionId?: string) {
  const [events, setEvents] = React.useState<BidEvent[]>([]);

  React.useEffect(() => {
    // In local dev/mock mode, subscribe to event logging updates
    const timer = setInterval(() => {
      if (auctionId) {
        setEvents(eventLogs.filter((e) => e.auction_id === auctionId));
      } else {
        setEvents([...eventLogs]);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionId]);

  return { events };
}

export function logAuctionEngineEvent(event: BidEvent) {
  eventLogs.push(event);
}

export default useAuctionEvents;
