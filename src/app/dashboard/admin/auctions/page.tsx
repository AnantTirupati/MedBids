"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Gavel, PauseCircle, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { StatusBadge } from "@/components/shared/status-badge";
import { auctionService } from "@/services/auction.service";
import { Auction } from "@/types";

export default function AdminAuctionMonitoringPage() {
  const [auctions, setAuctions] = React.useState<Auction[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadAuctions = async () => {
    try {
      const data = await auctionService.getAuctions();
      setAuctions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadAuctions();
  }, []);

  const handlePause = (auctionId: string) => {
    setAuctions((prev) =>
      prev.map((auc) => (auc.id === auctionId ? { ...auc, status: "cancelled" } : auc))
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full py-4 select-none">
      {/* Header breadcrumb */}
      <div>
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary transition-colors font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Admin Home
        </Link>
      </div>

      <header className="flex flex-col gap-1.5">
        <h1 className="text-display-md font-bold text-on-surface tracking-tight flex items-center gap-3">
          <Gavel className="w-6 h-6 text-primary" />
          Auction Monitoring Board
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Oversee active bidding streams and platform transaction metrics.
        </p>
      </header>

      {/* Tables grid */}
      <div className="glass-card rounded-card p-6 md:p-8 flex flex-col mt-4">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-4 py-6 animate-pulse">
              <div className="h-10 bg-[#273647]/35 rounded" />
              <div className="h-10 bg-[#273647]/35 rounded" />
            </div>
          ) : auctions.length === 0 ? (
            <p className="text-body-sm text-on-surface-variant text-center py-6">
              No active auctions monitoring metrics found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-0">Auction ID</TableHead>
                  <TableHead>Medications List</TableHead>
                  <TableHead>Bids Count</TableHead>
                  <TableHead>Lowest bid</TableHead>
                  <TableHead>Time remaining</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-0">Interventions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auctions.map((auc) => {
                  const meds = auc.prescription.medications
                    .map((m) => `${m.name} (${m.quantity})`)
                    .join(", ");

                  return (
                    <TableRow key={auc.id}>
                      <TableCell className="pl-0 py-4 font-semibold text-on-surface">
                        auc #{auc.id.substring(0, 6).toUpperCase()}
                      </TableCell>
                      <TableCell className="py-4 text-on-surface-variant max-w-xs truncate">
                        {meds}
                      </TableCell>
                      <TableCell className="py-4 font-semibold text-on-surface">
                        {auc.total_bids} bids
                      </TableCell>
                      <TableCell className="py-4 font-bold text-primary">
                        {auc.lowest_bid ? `₹${auc.lowest_bid}` : "—"}
                      </TableCell>
                      <TableCell className="py-4">
                        {auc.status === "live" ? (
                          <CountdownTimer endTime={auc.end_time} />
                        ) : (
                          <span className="text-body-sm text-text-muted">Concluded</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        <StatusBadge status={auc.status === "live" ? "Live" : "Expired"} />
                      </TableCell>
                      <TableCell className="py-4 text-right pr-0">
                        {auc.status === "live" ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handlePause(auc.id)}
                            className="h-9 px-3 text-label-md flex items-center justify-center gap-1.5 ml-auto border-error-container/20 hover:bg-error-container/10 hover:text-error"
                          >
                            <PauseCircle className="w-3.5 h-3.5" />
                            Force End
                          </Button>
                        ) : (
                          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                            Audited
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
