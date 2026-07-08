"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ChartCard } from "@/components/shared/chart-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { pharmacyService } from "@/services/pharmacy.service";
import { Bid } from "@/types";

import { useAuth } from "@/hooks/useAuth";

export default function PharmacyBidsAnalyticsPage() {
  const { user } = useAuth();
  const pharmacyId = user?.uid || "";
  const [bids, setBids] = React.useState<Bid[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user?.uid) {
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }
    const loadBidsData = async () => {
      try {
        const data = await pharmacyService.getPharmacyBids(pharmacyId);
        setBids(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadBidsData();
  }, [pharmacyId, user?.uid]);

  return (
    <div className="flex flex-col gap-6 w-full py-4 select-none">
      {/* Header breadcrumb */}
      <div>
        <Link
          href="/dashboard/pharmacy"
          className="inline-flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary transition-colors font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Terminal Console
        </Link>
      </div>

      <header className="flex flex-col gap-1.5">
        <h1 className="text-display-md font-bold text-on-surface tracking-tight flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-primary" />
          Bids History & Analytics
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Monitor your win ratios, revenue generation profiles, and active bid queues.
        </p>
      </header>

      {/* Analytics chart and logs table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start mt-4">
        {/* Left Column: Analytics Chart */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ChartCard
            title="Bidding Conversion"
            description="Comparison of bids placed vs successful orders reserved this month."
          />
        </div>

        {/* Right Column: Bid history */}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-card p-6 md:p-8 flex flex-col">
            <h3 className="text-headline-sm font-semibold text-on-surface mb-6">Recent Bid Submissions</h3>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="space-y-4 py-6 animate-pulse">
                  <div className="h-10 bg-[#273647]/35 rounded" />
                  <div className="h-10 bg-[#273647]/35 rounded" />
                </div>
              ) : bids.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant text-center py-6">
                  No bids recorded in your history log yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-0">Bid ID</TableHead>
                      <TableHead>Auction Room</TableHead>
                      <TableHead>Price Quote</TableHead>
                      <TableHead>Fulfillment</TableHead>
                      <TableHead className="text-right pr-0">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bids.map((bid) => {
                      const formattedTime = new Date(bid.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <TableRow key={bid.id}>
                          <TableCell className="pl-0 py-4 font-semibold text-on-surface">
                            #{bid.id.substring(0, 6).toUpperCase()}
                          </TableCell>
                          <TableCell className="py-4 text-on-surface-variant">
                            Rx #{bid.auction_id.substring(0, 6).toUpperCase()}
                          </TableCell>
                          <TableCell className="py-4 font-bold text-on-surface">₹{bid.amount}</TableCell>
                          <TableCell className="py-4 text-on-surface-variant">{bid.delivery_time}</TableCell>
                          <TableCell className="py-4 text-right pr-0">
                            <StatusBadge status={bid.status} />
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
      </div>
    </div>
  );
}
