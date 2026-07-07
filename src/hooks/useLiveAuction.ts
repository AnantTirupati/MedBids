import * as React from "react";
import { Auction } from "@/types";
import { auctionRepository } from "@/repositories";

export function useLiveAuction(auctionId?: string) {
  const [auctions, setAuctions] = React.useState<Auction[]>([]);
  const [auction, setAuction] = React.useState<Auction | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (auctionId) {
      const unsubscribe = auctionRepository.subscribeAuctionById(auctionId, (data) => {
        setAuction(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      const unsubscribe = auctionRepository.subscribeAuctions((data) => {
        setAuctions(data);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [auctionId]);

  return { auctions, auction, loading };
}

export default useLiveAuction;
