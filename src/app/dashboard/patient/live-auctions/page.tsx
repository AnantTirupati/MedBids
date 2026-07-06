"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Gavel } from "lucide-react";
import { AuctionCard } from "@/components/shared/auction-card";
import { EmptyState } from "@/components/shared/empty-state";
import { useAuctions } from "@/hooks/useAuctions";

export default function LiveAuctionsPage() {
  const { auctions, loading } = useAuctions();

  return (
    <div className="flex flex-col gap-6 w-full py-4 select-none">
      {/* Header breadcrumb */}
      <div>
        <Link
          href="/dashboard/patient"
          className="inline-flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary transition-colors font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard Home
        </Link>
      </div>

      <header className="flex flex-col gap-1.5">
        <h1 className="text-display-md font-bold text-on-surface tracking-tight flex items-center gap-3">
          <Gavel className="w-6 h-6 text-primary" />
          Live Bidding Auctions
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Pharmacies are currently competing on these items. Click on any card to review exact offers.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse mt-4">
          <div className="h-64 bg-[#273647]/35 rounded-card" />
          <div className="h-64 bg-[#273647]/35 rounded-card" />
        </div>
      ) : auctions.length === 0 ? (
        <EmptyState
          title="No Active Auctions"
          description="You don't have any prescriptions currently live in the bidding marketplace."
          className="mt-4"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter mt-4">
          {auctions.map((auc) => (
            <AuctionCard key={auc.id} auction={auc} userRole="patient" />
          ))}
        </div>
      )}
    </div>
  );
}
