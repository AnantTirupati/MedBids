"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, User, MapPin, Building, ShieldCheck, Clock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileCard } from "@/components/shared/profile-card";
import { pharmacyService } from "@/services/pharmacy.service";
import { Pharmacy } from "@/types";

export default function PharmacyProfilePage() {
  const [profile, setProfile] = React.useState<Pharmacy | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await pharmacyService.getPharmacyProfile("pharm1");
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading || !profile) {
    return (
      <div className="space-y-6 py-6 animate-pulse select-none">
        <div className="h-8 w-1/4 bg-[#273647]/35 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 h-64 bg-[#273647]/35 rounded" />
          <div className="lg:col-span-8 h-96 bg-[#273647]/35 rounded" />
        </div>
      </div>
    );
  }

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
        <h1 className="text-display-md font-bold text-on-surface tracking-tight">
          Pharmacy Profile Settings
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Update your store listings, operational configurations, and verification licenses.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start mt-4">
        {/* Left Column: Avatar & Summary card */}
        <div className="lg:col-span-4">
          <ProfileCard profile={profile} />
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-8">
          <Card className="rounded-card border border-surface-card-border bg-surface-card p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-headline-md font-semibold text-on-surface">Store Parameters</h2>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Ensure details below match your pharmaceutical retail registration copies.
              </p>
            </div>

            <form className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface-variant font-medium">Pharmacy Registered Name</label>
                  <Input defaultValue={profile.pharmacy_name} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface-variant font-medium">License Registry Code</label>
                  <Input defaultValue={profile.license_number} disabled className="opacity-70" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface-variant font-medium">GSTIN Code</label>
                  <Input defaultValue={profile.gst_number || ""} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface-variant font-medium">Store Established Year</label>
                  <Input defaultValue={profile.established_year.toString()} disabled className="opacity-70" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface-variant font-medium">Physical Address</label>
                <Input defaultValue={profile.address} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface-variant font-medium">City</label>
                  <Input defaultValue={profile.city} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface-variant font-medium">Pincode</label>
                  <Input defaultValue={profile.pincode} />
                </div>
              </div>

              <Button type="button" variant="primary" className="h-12 w-fit mt-2">
                Save Store Settings
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
