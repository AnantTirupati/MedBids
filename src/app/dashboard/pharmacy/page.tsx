"use client";

import * as React from "react";
import Link from "next/link";
import { Gavel, PlayCircle, Star, Award, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { StatusBadge } from "@/components/shared/status-badge";
import { usePharmacyDashboard } from "@/hooks/usePharmacyDashboard";
import { useAuth } from "@/hooks/useAuth";

export default function PharmacyDashboard() {
  const { user } = useAuth();
  const pharmacyId = user?.uid || "";

  const {
    loading,
    stats,
    availableAuctions: liveAuctions,
    refresh
  } = usePharmacyDashboard(pharmacyId);

  return (
    <div className="flex flex-col gap-stack-lg w-full select-none">
      {/* Header section */}
      <header className="flex flex-col gap-1.5">
        <h1 className="text-display-md font-bold text-on-surface tracking-tight">
          Pharmacy Terminal Control
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Console panel for bid management, verification logs, and order fulfillment.
        </p>
      </header>

      {/* Stats Grid */}
      {stats && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <StatCard
            label="Active Auctions"
            value={stats.active_auctions}
            icon={<Hourglass className="w-5 h-5 text-on-surface-variant" />}
          />
          <StatCard
            label="Bids Placed"
            value={stats.bids_placed}
            icon={<Gavel className="w-5 h-5 text-on-surface-variant" />}
          />
          <StatCard
            label="Bids Won"
            value={stats.bids_won}
            icon={<Award className="w-5 h-5 text-primary" />}
            highlighted
          />
          <StatCard
            label="Success Win Rate"
            value={`${stats.win_rate}%`}
            icon={<Star className="w-5 h-5 text-on-surface-variant" />}
          />
        </section>
      )}

      {/* Main Table: Active Auctions to bid on */}
      <div className="glass-card rounded-card p-6 md:p-8 flex flex-col mt-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-headline-md font-semibold text-on-surface">Available Bidding Rooms</h2>
            <p className="text-body-sm text-on-surface-variant mt-0.5">
              Live marketplace prescriptions requiring competitive quotes.
            </p>
          </div>
          <Link href="/dashboard/pharmacy/live-auctions">
            <span className="text-primary text-label-md font-semibold uppercase tracking-wider hover:text-opacity-80 transition-opacity cursor-pointer">
              Go to Auctions
            </span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-4 py-6">
              <div className="h-10 bg-[#273647]/35 rounded animate-pulse" />
              <div className="h-10 bg-[#273647]/35 rounded animate-pulse" />
            </div>
          ) : liveAuctions.length === 0 ? (
            <p className="text-body-sm text-on-surface-variant text-center py-6">
              No live bidding rooms available at the moment.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-0">Prescription ID</TableHead>
                  <TableHead>Medications List</TableHead>
                  <TableHead>Time Remaining</TableHead>
                  <TableHead className="text-right pr-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveAuctions.map((auc) => {
                  const medicationsList = auc.prescription.medications
                    .map((med) => `${med.name} (${med.quantity})`)
                    .join(", ");

                  return (
                    <TableRow key={auc.id}>
                      <TableCell className="pl-0 py-4 font-semibold text-on-surface">
                        Rx #{auc.prescription_id.substring(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell className="py-4 text-on-surface-variant max-w-xs truncate">
                        {medicationsList}
                      </TableCell>
                      <TableCell className="py-4">
                        <CountdownTimer endTime={auc.end_time} />
                      </TableCell>
                      <TableCell className="py-4 text-right pr-0">
                        <Link href="/dashboard/pharmacy/live-auctions">
                          <Button variant="primary" size="sm" className="h-10 px-4 flex items-center justify-center gap-1.5 ml-auto">
                            <PlayCircle className="w-4 h-4" />
                            Open bid room
                          </Button>
                        </Link>
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
