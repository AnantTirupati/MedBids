"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Upload, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function HeroCTA() {
  const { authenticated, role, loading } = useAuth();

  const dashboardPath =
    role === "pharmacy"
      ? "/dashboard/pharmacy"
      : role === "admin"
        ? "/dashboard/admin"
        : "/dashboard/patient";

  // While auth is loading, show a subtle placeholder to avoid layout shift
  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row gap-stack-sm mt-4 w-full sm:w-auto">
        <div className="w-full sm:w-[200px] h-14 rounded-lg bg-surface-container animate-pulse" />
        <div className="w-full sm:w-[220px] h-14 rounded-lg bg-surface-container animate-pulse" />
      </div>
    );
  }

  if (authenticated) {
    return (
      <div className="flex flex-col sm:flex-row gap-stack-sm mt-4 w-full sm:w-auto">
        <Link href={dashboardPath} className="w-full sm:w-auto">
          <Button
            variant="primary"
            className="w-full h-14 px-8 text-headline-sm flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 border-none text-white"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/patient/upload" className="w-full sm:w-auto">
          <Button
            variant="secondary"
            className="w-full h-14 px-8 text-headline-sm flex items-center justify-center gap-2 border border-outline hover:bg-surface-container-highest"
          >
            <Upload className="w-5 h-5 text-[#FF6B35]" />
            Upload Prescription
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-stack-sm mt-4 w-full sm:w-auto">
      <Link href="/auth" className="w-full sm:w-auto">
        <Button
          variant="primary"
          className="w-full h-14 px-8 text-headline-sm flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 border-none text-white"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </Button>
      </Link>
      <Link href="/auth?redirect=/dashboard/patient/upload" className="w-full sm:w-auto">
        <Button
          variant="secondary"
          className="w-full h-14 px-8 text-headline-sm flex items-center justify-center gap-2 border border-outline hover:bg-surface-container-highest"
        >
          <Upload className="w-5 h-5 text-[#FF6B35]" />
          Upload Prescription
        </Button>
      </Link>
    </div>
  );
}
