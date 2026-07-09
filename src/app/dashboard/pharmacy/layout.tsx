"use client";

import * as React from "react";
import { SidebarProvider, useSidebar } from "@/providers/sidebar-provider";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import DashboardTopbar from "@/components/layout/dashboard-topbar";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import MobileDrawer from "@/components/layout/mobile-drawer";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Pharmacy, VerificationStatus } from "@/types";
import { ShieldAlert, LogOut, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

function PharmacyLayoutContent({ children }: { children: React.ReactNode }) {
  const { isMobileOpen, toggleMobile, closeMobile } = useSidebar();
  const { profile, loading, refresh, signOut } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = React.useState(false);

  React.useEffect(() => {
    if (!loading && profile) {
      if (profile.role === "pharmacy") {
        const isCompleted = "license_number" in profile && (profile as Pharmacy).license_number;
        if (!isCompleted) {
          router.push("/signup/pharmacy");
        }
      }
    }
  }, [profile, loading, router]);

  const handleRefresh = async () => {
    setChecking(true);
    try {
      await refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setChecking(false);
      }, 500);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          <p className="text-body-sm text-on-surface-variant animate-pulse">Loading dashboard session...</p>
        </div>
      </div>
    );
  }

  // Cast profile
  const pharmacyProfile = profile as Pharmacy;

  // Gatekeeper check: If verification_status is not approved
  if (pharmacyProfile.verification_status !== "approved") {
    const isRejected = pharmacyProfile.verification_status === "rejected";
    const statusText = isRejected ? "Verification Rejected" : "Verification Pending";
    const statusDescription = isRejected
      ? "Unfortunately, your pharmacy registration request has been rejected. Please review your documents or contact support to appeal."
      : "Your credentials have been registered successfully! Our operations team is currently reviewing your drug license documents. You will receive active bidding permissions as soon as your account is approved.";

    return (
      <div className="min-h-screen bg-[#051424] flex items-center justify-center px-4 py-8 select-none text-on-surface">
        <div className="w-full max-w-[540px] flex flex-col items-center">
          <div className="glass-card w-full p-6 md:p-8 rounded-card border border-surface-card-border bg-[#1A2332]/95 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
            {/* Top decorative gradient bar */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${isRejected ? 'bg-error' : 'bg-secondary'}`} />

            {/* Icon */}
            <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-6 border ${
              isRejected 
                ? 'bg-error-container/10 border-error/20 text-error' 
                : 'bg-secondary-container/10 border-secondary/20 text-secondary'
            }`}>
              {isRejected ? (
                <ShieldAlert className="w-8 h-8 animate-bounce" />
              ) : (
                <Clock className="w-8 h-8 animate-pulse text-secondary" />
              )}
            </div>

            <h1 className="text-headline-md font-bold text-on-surface tracking-tight mb-2">
              {statusText}
            </h1>

            <p className="text-body-sm text-on-surface-variant leading-relaxed max-w-[400px] mb-6">
              {statusDescription}
            </p>

            {/* Onboarding Info Display Card */}
            <div className="w-full rounded-lg border border-[#273244] bg-[#0c1322] p-4 text-left text-xs text-on-surface-variant flex flex-col gap-2.5 mb-6">
              <h3 className="font-semibold text-on-surface uppercase tracking-wider text-[10px] pb-1 border-b border-[#273244]/40">
                Submitted Pharmacy Details
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-text-muted block">Store Name</span>
                  <span className="font-medium text-on-surface truncate block">{pharmacyProfile.pharmacy_name || "N/A"}</span>
                </div>
                <div>
                  <span className="text-text-muted block">License Number</span>
                  <span className="font-medium text-on-surface truncate block">{pharmacyProfile.license_number || "N/A"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-text-muted block">Outlet Address</span>
                  <span className="font-medium text-on-surface block leading-tight">
                    {pharmacyProfile.address || "N/A"}, {pharmacyProfile.city || ""} - {pharmacyProfile.pincode || ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 w-full">
              {!isRejected && (
                <Button
                  onClick={handleRefresh}
                  disabled={checking}
                  variant="primary"
                  className="w-full h-11 bg-primary hover:bg-primary-container text-on-primary font-bold flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
                  <span>{checking ? "Checking Approval..." : "Check Verification Status"}</span>
                </Button>
              )}

              <Button
                onClick={() => signOut()}
                variant="secondary"
                className="w-full h-11 border border-outline-variant hover:bg-surface-container-highest text-on-surface flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4 text-error" />
                <span>Sign Out of Account</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0B0F14] text-on-surface">
      {/* Top Navbar */}
      <DashboardTopbar role="pharmacy" onMobileMenuToggle={toggleMobile} />

      {/* Sidebar Nav */}
      <DashboardSidebar role="pharmacy" />

      {/* Slide-out mobile drawer */}
      <MobileDrawer role="pharmacy" isOpen={isMobileOpen} onClose={closeMobile} />

      {/* Main Content Area */}
      <main className="pt-20 pb-24 md:pb-12 md:pl-[304px] px-margin-mobile md:px-margin-tablet max-w-container-max mx-auto min-h-[calc(100vh-64px)] relative z-10">
        {children}
      </main>

      {/* Mobile Tab-bar */}
      <MobileBottomNav role="pharmacy" />
    </div>
  );
}

export default function PharmacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <PharmacyLayoutContent>{children}</PharmacyLayoutContent>
    </SidebarProvider>
  );
}
