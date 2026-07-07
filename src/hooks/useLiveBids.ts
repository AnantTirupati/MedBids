import * as React from "react";
import { Bid } from "@/types";
import { bidRepository } from "@/repositories";

export function useLiveBids(auctionId: string) {
  const [bids, setBids] = React.useState<Bid[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!auctionId) return;
    const unsubscribe = bidRepository.subscribeBidsByAuctionId(auctionId, (data) => {
      // Sort bids (lowest bid first)
      const sorted = [...data].sort((a, b) => a.amount - b.amount);
      setBids(sorted);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auctionId]);

  return { bids, loading };
}

export default useLiveBids;
