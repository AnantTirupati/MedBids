"use client";

import * as React from "react";
import { SidebarProvider, useSidebar } from "@/providers/sidebar-provider";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import DashboardTopbar from "@/components/layout/dashboard-topbar";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import MobileDrawer from "@/components/layout/mobile-drawer";

function PharmacyLayoutContent({ children }: { children: React.ReactNode }) {
  const { isMobileOpen, toggleMobile, closeMobile } = useSidebar();

  return (
    <div className="relative min-h-screen bg-[#0B0F14] text-on-surface">
      {/* Top Navbar */}
      <DashboardTopbar role="pharmacy" onMobileMenuToggle={toggleMobile} />

      {/* Sidebar Nav */}
      <DashboardSidebar role="pharmacy" />

      {/* Slide-out mobile drawer */}
      <MobileDrawer role="pharmacy" isOpen={isMobileOpen} onClose={closeMobile} />

      {/* Main Content Area */}
      <main className="pt-16 pb-24 md:pb-12 md:pl-[280px] px-margin-mobile md:px-margin-tablet max-w-container-max mx-auto min-h-[calc(100vh-64px)] relative z-10">
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
