"use client";

import * as React from "react";
import { Auction, Bid, Offer } from "@/types";
import { auctionService } from "@/services/auction.service";
import { pharmacyService } from "@/services/pharmacy.service";

export function useAuctions(auctionId?: string) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [auctions, setAuctions] = React.useState<Auction[]>([]);
  const [auction, setAuction] = React.useState<Auction | null>(null);
  const [bids, setBids] = React.useState<Bid[]>([]);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      if (auctionId) {
        const [auctionData, bidsData] = await Promise.all([
          auctionService.getAuction(auctionId),
          auctionService.getAuctionHistory(auctionId),
        ]);
        setAuction(auctionData);
        setBids(bidsData);
      } else {
        const auctionsList = await auctionService.getLiveAuctions();
        setAuctions(auctionsList);
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load auction data"));
    } finally {
      setLoading(false);
    }
  }, [auctionId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const placeBid = async (pharmacyId: string, amount: number, deliveryTime: string, notes?: string) => {
    if (!auctionId) return;
    setLoading(true);
    try {
      await pharmacyService.submitBid(auctionId, pharmacyId, amount, deliveryTime, notes);
      await loadData();
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
      await loadData();
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
      await loadData();
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
    refresh: loadData,
  };
}

export default useAuctions;
