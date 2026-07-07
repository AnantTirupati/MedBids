"use client";

import * as React from "react";
import { Auction, Bid } from "@/types";
import { auctionService } from "@/services/auction.service";
import { pharmacyService } from "@/services/pharmacy.service";
import { auctionRepository, bidRepository } from "@/repositories";

export function useAuctions(auctionId?: string) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [auctions, setAuctions] = React.useState<Auction[]>([]);
  const [auction, setAuction] = React.useState<Auction | null>(null);
  const [bids, setBids] = React.useState<Bid[]>([]);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const refresh = React.useCallback(() => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  React.useEffect(() => {
    if (auctionId) {
      const unsubAuction = auctionRepository.subscribeAuctionById(auctionId, (data: Auction | null) => {
        setAuction(data);
      });
      const unsubBids = bidRepository.subscribeBidsByAuctionId(auctionId, (data: Bid[]) => {
        const sorted = [...data].sort((a, b) => a.amount - b.amount);
        setBids(sorted);
        setLoading(false);
        setSuccess(true);
      });
      return () => {
        unsubAuction();
        unsubBids();
      };
    } else {
      const unsubAuctions = auctionRepository.subscribeAuctions((data: Auction[]) => {
        setAuctions(data);
        setLoading(false);
        setSuccess(true);
      });
      return () => {
        unsubAuctions();
      };
    }
  }, [auctionId, refreshTrigger]);

  const placeBid = async (pharmacyId: string, amount: number, deliveryTime: string, notes?: string) => {
    if (!auctionId) return;
    setLoading(true);
    try {
      await pharmacyService.submitBid(auctionId, pharmacyId, amount, deliveryTime, notes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Submit bid failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const acceptOffer = async (offerId: string) => {
    setLoading(true);
    try {
      const offer = await auctionService.acceptOffer(offerId);
      return offer;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Accept offer failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelAuction = async () => {
    if (!auctionId) return;
    setLoading(true);
    try {
      await auctionService.cancelAuction(auctionId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Cancel auction failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    auctions,
    auction,
    bids,
    placeBid,
    acceptOffer,
    cancelAuction,
    refresh,
  };
}

export default useAuctions;
