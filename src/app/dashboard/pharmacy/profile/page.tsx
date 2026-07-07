"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, User, MapPin, Building, ShieldCheck, Clock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileCard } from "@/components/shared/profile-card";
import { useAuth } from "@/hooks/useAuth";
import { pharmacyService } from "@/services/pharmacy.service";
import { Pharmacy } from "@/types";

export default function PharmacyProfilePage() {
  const { user } = useAuth();
  const pharmacyId = user?.uid || "pharm1";

  const [profile, setProfile] = React.useState<Pharmacy | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Form states
  const [pharmacyName, setPharmacyName] = React.useState("");
  const [gstNumber, setGstNumber] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [stateName, setStateName] = React.useState("");
  const [pincode, setPincode] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [saving, setSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [saveError, setSaveError] = React.useState("");

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await pharmacyService.getPharmacyProfile(pharmacyId);
        setProfile(data);
        setPharmacyName(data.pharmacy_name);
        setGstNumber(data.gst_number || "");
        setAddress(data.address);
        setCity(data.city);
        setStateName(data.state);
        setPincode(data.pincode);
        setPhone(data.phone);
        setEmail(data.email);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [pharmacyId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError("");
    try {
      const updated = await pharmacyService.updateProfile(pharmacyId, {
        pharmacy_name: pharmacyName,
        gst_number: gstNumber || null,
        address,
        city,
        state: stateName,
        pincode,
        phone,
        email,
      });
      setProfile(updated);
      setSaveSuccess(true);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setSaveError(errorObj?.message || "Failed to update profile settings.");
    } finally {
      setSaving(false);
    }
  };

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

            {saveSuccess && (
              <div className="w-full p-3 rounded-lg bg-green-950/40 border border-green-500/30 text-green-200 text-body-sm text-center select-text">
                Store settings saved successfully.
              </div>
            )}

            {saveError && (
              <div className="w-full p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-body-sm text-center select-text">
                {saveError}
              </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface-variant font-medium">Pharmacy Registered Name</label>
                  <Input value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface-variant font-medium">License Registry Code</label>
                  <Input value={profile.license_number} disabled className="opacity-70" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface-variant font-medium">GSTIN Code</label>
                  <Input value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="e.g. 22AAAAA0000A1Z5" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface-variant font-medium">Store Established Year</label>
                  <Input value={profile.established_year?.toString() || "2024"} disabled className="opacity-70" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface-variant font-medium">Contact Phone</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface-variant font-medium">Contact Email</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface-variant font-medium">Physical Address</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 col-span-1">
                  <label className="text-label-md text-on-surface-variant font-medium">City</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1 col-span-1">
                  <label className="text-label-md text-on-surface-variant font-medium">State</label>
                  <Input value={stateName} onChange={(e) => setStateName(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1 col-span-1">
                  <label className="text-label-md text-on-surface-variant font-medium">Pincode</label>
                  <Input value={pincode} onChange={(e) => setPincode(e.target.value)} required />
                </div>
              </div>

              <Button type="submit" variant="primary" className="h-12 w-fit mt-2 font-semibold" disabled={saving}>
                {saving ? "Saving Changes..." : "Save Store Settings"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
