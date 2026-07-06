"use client";

import * as React from "react";
import Link from "next/link";
import { Upload, Eye, Receipt, Gavel, CheckCircle2, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { ActivityTimeline } from "@/components/shared/activity-timeline";
import { StatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePatientDashboard } from "@/hooks/usePatientDashboard";
export default function PatientDashboard() {
  const {
    loading,
    error,
    stats,
    prescriptions,
    timelineEvents,
    refresh
  } = usePatientDashboard("p1");

  const activePrescriptions = stats?.active_prescriptions ?? 0;
  const activeBids = stats?.active_bids ?? 0;
  const acceptedOffersCount = stats?.accepted_offers ?? 0;
  const estimatedSavings = stats?.estimated_savings ? `₹${stats.estimated_savings.toLocaleString()}` : "—";

  return (
    <div className="flex flex-col gap-stack-lg w-full">
      {/* Header section */}
      <header className="flex flex-col gap-1.5 select-none">
        <h1 className="text-display-md font-bold text-on-surface tracking-tight">
          Good Evening, Anant.
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          You currently have {activePrescriptions} active prescriptions receiving offers.
        </p>
      </header>

      {/* KPI Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter select-none">
        <StatCard
          label="Active Prescriptions"
          value={activePrescriptions}
          icon={<Receipt className="w-5 h-5 text-on-surface-variant" />}
        />
        <StatCard
          label="Active Bids"
          value={activeBids}
          icon={<Gavel className="w-5 h-5 text-on-surface-variant" />}
        />
        <StatCard
          label="Accepted Offers"
          value={acceptedOffersCount}
          icon={<CheckCircle2 className="w-5 h-5 text-on-surface-variant" />}
        />
        <StatCard
          label="Estimated Savings"
          value={estimatedSavings}
          icon={<PiggyBank className="w-5 h-5 text-primary" />}
          highlighted
        />
      </section>

      {/* Main Grid: Table & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        
        {/* Main Section: Recent Prescriptions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card rounded-card p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-headline-md font-semibold text-on-surface">Recent Prescriptions</h2>
              <Link href="/dashboard/patient/accepted">
                <span className="text-primary text-label-md font-semibold uppercase tracking-wider hover:text-opacity-80 transition-opacity select-none cursor-pointer">
                  View All
                </span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="space-y-4 py-6">
                  <div className="h-10 bg-[#273647]/35 rounded animate-pulse" />
                  <div className="h-10 bg-[#273647]/35 rounded animate-pulse" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-0">Medicine</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-0">Lowest Bid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((rx) => {
                      const formattedDate = new Date(rx.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      const lowestBid = rx.id === "rx1" ? "₹1,850" : rx.id === "rx3" ? "₹120" : "—";
                      const progressVal = rx.id === "rx1" ? 85 : rx.id === "rx3" ? 15 : 0;
                      const subtitle = rx.medications[0] ? `${rx.medications[0].name} ${rx.medications[0].dosage}` : "";

                      return (
                        <TableRow key={rx.id} className="cursor-pointer">
                          <TableCell className="pl-0 py-4">
                            <Link href={`/dashboard/patient/prescription/${rx.id}`}>
                              <p className="font-semibold text-on-surface hover:text-primary transition-colors">
                                {rx.medications[0]?.name || "Prescription Order"}
                              </p>
                              <p className="text-body-sm text-on-surface-variant">{subtitle}</p>
                            </Link>
                          </TableCell>
                          <TableCell className="py-4 text-on-surface-variant">{formattedDate}</TableCell>
                          <TableCell className="py-4">
                            <StatusBadge status={rx.status === "auction_live" ? "Live" : rx.status} />
                          </TableCell>
                          <TableCell className="py-4 text-right pr-0 flex flex-col items-end gap-1">
                            <span className="font-bold text-on-surface">{lowestBid}</span>
                            {progressVal > 0 && (
                              <div className="w-24">
                                <Progress value={progressVal} className="h-1" />
                              </div>
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

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/dashboard/patient/upload" className="w-full">
              <Button variant="primary" className="w-full h-14 flex items-center justify-center gap-3 text-headline-sm">
                <Upload className="w-5 h-5" />
                Upload Prescription
              </Button>
            </Link>
            <Link href="/dashboard/patient/live-auctions" className="w-full">
              <Button
                variant="secondary"
                className="w-full h-14 flex items-center justify-center gap-3 text-headline-sm bg-surface-card border border-surface-card-border"
              >
                <Eye className="w-5 h-5" />
                View Live Auctions
              </Button>
            </Link>
          </div>
        </div>

        {/* Side Section: Activity Timeline */}
        <aside className="lg:col-span-4 h-full">
          <div className="glass-card rounded-card p-6 md:p-8 flex flex-col gap-6">
            <h3 className="text-headline-md font-semibold text-on-surface">Recent Activity</h3>
            <ActivityTimeline
              events={timelineEvents.map((evt) => ({
                id: evt.id,
                timeLabel: evt.relative_time,
                title: evt.title,
                description: evt.description,
                accent: evt.accent_color,
              }))}
            />
          </div>
        </aside>

      </div>
    </div>
  );
}
