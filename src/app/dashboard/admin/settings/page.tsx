"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Settings, ShieldCheck, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [formData, setFormData] = React.useState({
    commissionRate: "5",
    auctionDuration: "24",
    maxBidsPerAuction: "25",
    minTimeLeftToExtend: "10",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          <Settings className="w-6 h-6 text-primary" />
          Global Platform Settings
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Adjust commission margins, default auction schedules, and automated verification rules.
        </p>
      </header>

      {/* Settings inputs cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start mt-4">
        {/* Left main forms card */}
        <div className="md:col-span-8">
          <Card className="rounded-card border border-surface-card-border bg-surface-card p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-headline-md font-semibold text-on-surface">Platform Engine Tuning</h2>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Changing these parameters adjusts pricing variables for the marketplace engine live.
              </p>
            </div>

            <form className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md text-on-surface-variant font-medium">
                    Platform Commission Fee (%)
                  </label>
                  <Input
                    type="number"
                    value={formData.commissionRate}
                    onChange={(e) => handleInputChange("commissionRate", e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md text-on-surface-variant font-medium">
                    Default Auction Window (Hours)
                  </label>
                  <Input
                    type="number"
                    value={formData.auctionDuration}
                    onChange={(e) => handleInputChange("auctionDuration", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md text-on-surface-variant font-medium">
                    Maximum Bids allowed per Rx
                  </label>
                  <Input
                    type="number"
                    value={formData.maxBidsPerAuction}
                    onChange={(e) => handleInputChange("maxBidsPerAuction", e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-md text-on-surface-variant font-medium">
                    Extend Bids time if outbid within (Mins)
                  </label>
                  <Input
                    type="number"
                    value={formData.minTimeLeftToExtend}
                    onChange={(e) => handleInputChange("minTimeLeftToExtend", e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="button" variant="primary" className="h-12 w-fit mt-2">
                Save Adjustments
              </Button>
            </form>
          </Card>
        </div>

        {/* Right side alert block */}
        <aside className="md:col-span-4">
          <Card className="rounded-card border border-surface-card-border bg-[#151C26] p-6 flex flex-col gap-4">
            <h3 className="text-headline-sm font-semibold text-on-surface">Compliance Protocol</h3>
            <div className="flex items-start gap-3 text-body-sm text-on-surface-variant leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>
                All adjustments are logged in accordance with local drug retail marketplace protocols.
              </span>
            </div>
            <div className="flex items-start gap-3 text-body-sm text-on-surface-variant leading-relaxed border-t border-[#273244]/40 pt-4">
              <RefreshCw className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>
                Changes take effect instantly on newly created auction rooms. Active bidding rooms remain unaffected.
              </span>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
