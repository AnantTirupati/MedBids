"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Users, Gavel, FileCheck2, Activity, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { ChartCard } from "@/components/shared/chart-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

export default function AdminDashboard() {
  const {
    loading,
    stats,
    verificationQueue,
    prescriptions,
    bids,
    refresh
  } = useAdminDashboard();

  // Calculate dynamic 7-day bid traffic data for chart
  const { chartData, chartLabels } = React.useMemo(() => {
    const days = 7;
    const data: number[] = [];
    const labels: string[] = [];
    
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      labels.push(dateStr);
      
      // Count bids placed on this calendar day
      const count = bids.filter((b) => {
        if (!b.created_at) return false;
        const bDate = new Date(b.created_at);
        return (
          bDate.getDate() === d.getDate() &&
          bDate.getMonth() === d.getMonth() &&
          bDate.getFullYear() === d.getFullYear()
        );
      }).length;
      data.push(count);
    }
    
    return { chartData: data, chartLabels: labels };
  }, [bids]);

  // Build dynamic pending actions list
  const pendingActions = React.useMemo(() => {
    const actions: { id: string; type: string; name: string; detail: string; date: string; link: string; timestamp: string }[] = [];
    
    // Add pending pharmacy verifications
    verificationQueue.forEach((req) => {
      if (req.status === "pending") {
        actions.push({
          id: req.id,
          type: "Pharmacy Verification",
          name: req.pharmacy.pharmacy_name,
          detail: `License: ${req.pharmacy.license_number} (${req.pharmacy.city})`,
          date: req.submitted_at ? new Date(req.submitted_at).toLocaleDateString() : "Just now",
          link: "/dashboard/admin/pharmacy-verification",
          timestamp: req.submitted_at || new Date().toISOString(),
        });
      }
    });

    // Add pending prescriptions
    prescriptions.forEach((rx) => {
      if (rx.status === "pending_verification") {
        const meds = rx.medications.map((m) => m.name).join(", ");
        actions.push({
          id: rx.id,
          type: "Prescription Moderation",
          name: rx.patient_name,
          detail: `Medications: ${meds}`,
          date: rx.created_at ? new Date(rx.created_at).toLocaleDateString() : "Just now",
          link: "/dashboard/admin/prescriptions",
          timestamp: rx.created_at || new Date().toISOString(),
        });
      }
    });

    // Sort by timestamp descending
    return actions.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [verificationQueue, prescriptions]);

  return (
    <div className="flex flex-col gap-stack-lg w-full select-none">
      {/* Header section */}
      <header className="flex flex-col gap-1.5">
        <h1 className="text-display-md font-bold text-on-surface tracking-tight">
          Admin Control Center
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Monitor platform transactions, approve pharmacy licenses, and moderate prescriptions.
        </p>
      </header>

      {/* Stats Bento Grid */}
      {stats && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <StatCard
            label="Registered Users"
            value={stats.total_users}
            icon={<Users className="w-5 h-5 text-on-surface-variant" />}
          />
          <StatCard
            label="Partner Stores"
            value={stats.total_pharmacies}
            icon={<ShieldCheck className="w-5 h-5 text-on-surface-variant" />}
          />
          <StatCard
            label="Active Auctions"
            value={stats.active_auctions}
            icon={<Gavel className="w-5 h-5 text-on-surface-variant" />}
          />
          <StatCard
            label="Pending Moderations"
            value={stats.pending_verifications}
            icon={<FileCheck2 className="w-5 h-5 text-primary" />}
            highlighted
          />
        </section>
      )}

      {/* Main split grid: Analytics & Pending Worklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start mt-4">
        {/* Left Column: Analytics */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Bidding Traffic Volume"
            description="Daily active bid quotes submitted across all prescription rooms."
            data={chartData}
            labels={chartLabels}
          />
        </div>

        {/* Right Column: Pending Moderator Queue */}
        <div className="lg:col-span-4">
          <div className="glass-card rounded-card p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-headline-sm font-semibold text-on-surface">Action Queue</h3>
            </div>

            <div className="flex flex-col gap-4">
              {pendingActions.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant text-center py-6">
                  No pending actions requiring review.
                </p>
              ) : (
                pendingActions.map((action) => (
                  <div key={action.id} className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-label-md text-primary font-bold uppercase tracking-wider">
                        {action.type}
                      </span>
                      <span className="text-[10px] text-text-muted">{action.date}</span>
                    </div>
                    <div>
                      <h4 className="text-body-md font-bold text-on-surface">{action.name}</h4>
                      <p className="text-body-sm text-on-surface-variant line-clamp-2">{action.detail}</p>
                    </div>
                    <Link href={action.link} className="mt-1 w-full">
                      <Button variant="secondary" size="sm" className="w-full h-10 text-label-md flex justify-center items-center gap-1">
                        <span>Audit Request</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
