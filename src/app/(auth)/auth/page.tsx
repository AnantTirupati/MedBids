"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HeartPulse, User, Award, ShieldAlert, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AuthGatewayPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const queryStr = redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";

  return (
    <div className="w-full max-w-4xl px-4 py-2 md:py-4 select-none flex flex-col items-center">
      {/* Brand Header with minimal top and bottom margins */}
      <div className="w-full flex flex-col items-center mb-5 text-center">
        <div className="h-10 w-10 rounded-full bg-primary-container/20 flex items-center justify-center mb-2 border border-primary/30 text-primary">
          <HeartPulse className="w-5 h-5 text-[#FF6B35]" />
        </div>
        <h1 className="text-headline-lg font-bold text-on-surface">Welcome to MedBids</h1>
        <p className="text-body-sm text-on-surface-variant max-w-[400px] mt-1">
          Select your portal to sign in or register your account on the secure medical bidding marketplace.
        </p>
      </div>

      {/* Gateway Cards Grid with optimized heights and spacing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {/* Patient Card */}
        <Card className="auth-card p-5 md:p-6 flex flex-col justify-between items-center text-center bg-[#141A24]/90 border border-outline-variant/20 hover:border-primary/50 transition-all rounded-2xl relative overflow-hidden backdrop-blur-md min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center border border-primary/20 text-[#FF6B35]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-title-lg font-bold text-on-surface">Patient Portal</h3>
              <p className="text-body-xs text-on-surface-variant mt-1 leading-relaxed">
                Receive medicine quotations from nearby pharmacies by uploading prescriptions.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full mt-4">
            <Link href={`/auth/patient/login${queryStr}`} className="w-full">
              <Button variant="primary" className="w-full h-9 flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 border-none text-white text-label-sm">
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Button>
            </Link>
            <Link href={`/auth/patient/signup${queryStr}`} className="w-full">
              <Button variant="secondary" className="w-full h-9 flex items-center justify-center gap-2 border border-outline hover:bg-surface-container-highest text-label-sm">
                <UserPlus className="w-3.5 h-3.5" />
                Create Account
              </Button>
            </Link>
          </div>
        </Card>

        {/* Pharmacy Card */}
        <Card className="auth-card p-5 md:p-6 flex flex-col justify-between items-center text-center bg-[#141A24]/90 border border-outline-variant/20 hover:border-secondary/50 transition-all rounded-2xl relative overflow-hidden backdrop-blur-md min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container/10 flex items-center justify-center border border-secondary/20 text-[#0F766E]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-title-lg font-bold text-on-surface">Pharmacy Partner</h3>
              <p className="text-body-xs text-on-surface-variant mt-1 leading-relaxed">
                Bid on prescriptions, manage inventory and serve nearby patients.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full mt-4">
            <Link href={`/auth/pharmacy/login${queryStr}`} className="w-full">
              <Button variant="primary" className="w-full h-9 flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 border-none text-white text-label-sm">
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Button>
            </Link>
            <Link href={`/auth/pharmacy/signup${queryStr}`} className="w-full">
              <Button variant="secondary" className="w-full h-9 flex items-center justify-center gap-2 border border-outline hover:bg-surface-container-highest text-label-sm">
                <UserPlus className="w-3.5 h-3.5" />
                Create Account
              </Button>
            </Link>
          </div>
        </Card>

        {/* Admin Card */}
        <Card className="auth-card p-5 md:p-6 flex flex-col justify-between items-center text-center bg-[#141A24]/90 border border-outline-variant/20 hover:border-error/50 transition-all rounded-2xl relative overflow-hidden backdrop-blur-md min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center border border-error/20 text-red-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-title-lg font-bold text-on-surface">Administrator</h3>
              <p className="text-body-xs text-on-surface-variant mt-1 leading-relaxed">
                Manage the MedBids platform, users, pharmacies, analytics and moderation.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full mt-4">
            <Link href={`/auth/admin/login${queryStr}`} className="w-full">
              <Button variant="primary" className="w-full h-9 flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 border-none text-white text-label-sm">
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Button>
            </Link>
            <div className="h-9 w-full opacity-0 pointer-events-none select-none hidden md:block">
              {/* Spacer so card sizes match perfectly */}
            </div>
          </div>
        </Card>
      </div>

      <p className="text-body-sm text-on-surface-variant mt-6 text-center">
        Need assistance?{" "}
        <Link href="/contact" className="text-[#FF6B35] font-semibold hover:underline">
          Contact Support
        </Link>
      </p>
    </div>
  );
}
