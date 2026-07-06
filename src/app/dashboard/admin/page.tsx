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
    refresh
  } = useAdminDashboard();

  const pendingActions = [
    { id: "act1", type: "Pharmacy Verification", name: "Wellness Forever Shop", detail: "Drug license copy submitted", date: "Just Now", link: "/dashboard/admin/pharmacy-verification" },
    { id: "act2", type: "Prescription Moderation", name: "Rx #rx2 - Sitagliptin 100mg", detail: "Requires dosage confirmation", date: "20m ago", link: "/dashboard/admin/prescriptions" },
  ];

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
              {pendingActions.map((action) => (
                <div key={action.id} className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-label-md text-primary font-bold uppercase tracking-wider">
                      {action.type}
                    </span>
                    <span className="text-[10px] text-text-muted">{action.date}</span>
                  </div>
                  <div>
                    <h4 className="text-body-md font-bold text-on-surface">{action.name}</h4>
                    <p className="text-body-sm text-on-surface-variant">{action.detail}</p>
                  </div>
                  <Link href={action.link} className="mt-1 w-full">
                    <Button variant="secondary" size="sm" className="w-full h-10 text-label-md flex justify-center items-center gap-1">
                      <span>Audit Request</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
