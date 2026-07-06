"use client";

import * as React from "react";
import Link from "next/link";
import { Gavel, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/status-badge";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { Auction } from "@/types";
import { cn } from "@/lib/utils";

interface AuctionCardProps {
  auction: Auction;
  userRole?: "patient" | "pharmacy" | "admin";
  onBidAction?: (auctionId: string) => void;
  className?: string;
}

export function AuctionCard({ auction, userRole = "patient", onBidAction, className }: AuctionCardProps) {
  const medicationsList = auction.prescription.medications
    .map((med) => `${med.name} (${med.quantity})`)
    .join(", ");

  const hasBids = auction.total_bids > 0;

  // Let's create dummy percentages for visual display comparison
  const progressPercent = hasBids
    ? Math.max(15, Math.min(85, (auction.lowest_bid || 0) > 0 ? 80 : 0))
    : 0;

  return (
    <Card className={cn("rounded-card border border-surface-card-border bg-surface-card hover:bg-surface-card-hover/40 transition-all select-none", className)}>
      <CardHeader className="pb-3 border-b border-[#273244]/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#273647] flex items-center justify-center text-primary border border-outline-variant/30">
            <Gavel className="w-4 h-4" />
          </div>
          <span className="text-label-md font-semibold uppercase tracking-wider text-text-muted">
            Auction #{auction.id.substring(0, 6).toUpperCase()}
          </span>
        </div>
        <StatusBadge status={auction.status === "live" ? "Live" : "Expired"} />
      </CardHeader>

      <CardContent className="pt-4 flex flex-col gap-4">
        <div>
          <h3 className="text-headline-sm font-semibold text-on-surface line-clamp-1">
            {auction.prescription.medications[0]?.name || "Prescription Order"}
          </h3>
          <p className="text-body-sm text-on-surface-variant line-clamp-1 mt-0.5">
            {medicationsList}
          </p>
        </div>

        {/* Timer & Bids count */}
        <div className="flex items-center justify-between border-t border-b border-[#273244]/30 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-label-md text-on-surface-variant font-medium">Time Remaining</span>
            <CountdownTimer endTime={auction.end_time} />
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-label-md text-on-surface-variant font-medium">Total Bids</span>
            <span className="text-body-md font-bold text-on-surface">{auction.total_bids} bids</span>
          </div>
        </div>

        {/* Current bid info */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <span className="text-label-md text-on-surface-variant font-medium">Lowest Bid</span>
            <div className="flex items-center gap-1.5">
              {hasBids && <TrendingDown className="w-4 h-4 text-primary" />}
              <span className="text-headline-sm font-bold text-primary">
                {auction.lowest_bid ? `₹${auction.lowest_bid}` : "—"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Progress value={progressPercent} className="h-1.5" />
            <div className="flex justify-between text-[11px] text-text-muted">
              <span>Retail Estimate</span>
              <span>Lowest Competing Offer</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        {userRole === "patient" && (
          <Link href={`/dashboard/patient/prescription/${auction.prescription_id}`} className="w-full">
            <Button variant="secondary" className="w-full h-10 py-2 text-label-md">
              Monitor Live Offers
            </Button>
          </Link>
        )}
        {userRole === "pharmacy" && (
          <Button
            variant="primary"
            onClick={() => onBidAction && onBidAction(auction.id)}
            className="w-full h-10 py-2 text-label-md flex justify-center items-center gap-2"
          >
            <Gavel className="w-4 h-4" />
            Place Bid
          </Button>
        )}
        {userRole === "admin" && (
          <Link href={`/dashboard/admin/auctions`} className="w-full">
            <Button variant="secondary" className="w-full h-10 py-2 text-label-md">
              Audit Auction
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

export default AuctionCard;
