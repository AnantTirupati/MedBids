"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, User, Bell, Shield, Award } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileCard } from "@/components/shared/profile-card";
import { patientService } from "@/services/patient.service";
import { Patient } from "@/types";

import { useAuth } from "@/hooks/useAuth";

export default function PatientProfilePage() {
  const { user } = useAuth();
  const patientId = user?.uid || "";
  const [profile, setProfile] = React.useState<Patient | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user?.uid) {
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }
    const loadProfile = async () => {
      try {
        const data = await patientService.getPatientProfile(patientId);
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [patientId, user?.uid]);

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
          href="/dashboard/patient"
          className="inline-flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary transition-colors font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard Home
        </Link>
      </div>

      <header className="flex flex-col gap-1.5">
        <h1 className="text-display-md font-bold text-on-surface tracking-tight">
          Profile & Account Settings
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Manage your personal details, notification frequencies, and subscription settings.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start mt-4">
        {/* Left Column: Avatar & summary card */}
        <div className="lg:col-span-4">
          <ProfileCard profile={profile} />
        </div>

        {/* Right Column: Settings Tabs details */}
        <div className="lg:col-span-8">
          <Card className="rounded-card border border-surface-card-border bg-surface-card p-2">
            <CardContent className="pt-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList>
                  <TabsTrigger value="personal" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="membership" className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Membership
                  </TabsTrigger>
                </TabsList>

                {/* Personal Tab */}
                <TabsContent value="personal" className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-label-md text-on-surface-variant">Full Name</label>
                      <Input defaultValue={profile.full_name} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-label-md text-on-surface-variant">Phone Number</label>
                      <Input defaultValue={profile.phone} disabled className="opacity-70" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-label-md text-on-surface-variant">Email Address</label>
                    <Input type="email" defaultValue={profile.email} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-label-md text-on-surface-variant">Delivery Address</label>
                    <Input defaultValue={profile.address || ""} />
                  </div>

                  <Button variant="primary" className="h-12 w-fit mt-2">
                    Save Changes
                  </Button>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="flex flex-col gap-4">
                  <h3 className="text-body-md font-bold text-on-surface">Communication Preferences</h3>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    Select how you want to receive bid alerts, verified reports, and savings logs.
                  </p>
                  <div className="flex flex-col gap-3 mt-2">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant/30">
                      <div>
                        <p className="text-body-md font-semibold text-on-surface">SMS Alerts</p>
                        <p className="text-body-sm text-on-surface-variant">Receive alerts on new bids instantly</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0F766E]" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant/30">
                      <div>
                        <p className="text-body-md font-semibold text-on-surface">Email Summaries</p>
                        <p className="text-body-sm text-on-surface-variant">Receive weekly savings reports</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0F766E]" />
                    </div>
                  </div>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="flex flex-col gap-4">
                  <h3 className="text-body-md font-bold text-on-surface">Account Protection</h3>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    Configure multi-factor login checks and device authorizations.
                  </p>
                  <Button variant="secondary" className="h-12 w-fit mt-2">
                    Revoke Active Sessions
                  </Button>
                </TabsContent>

                {/* Membership Tab */}
                <TabsContent value="membership" className="flex flex-col gap-4">
                  <div className="p-4 rounded-xl bg-primary-container/10 border border-primary/20 flex flex-col gap-2">
                    <h3 className="text-body-md font-bold text-primary flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Premium Saver Enabled
                    </h3>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                      You are currently enjoying priority verification, commission-free bids matching, and priority support desk access.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
