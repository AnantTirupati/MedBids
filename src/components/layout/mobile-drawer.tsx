"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { X, LogOut, LayoutDashboard, Gavel, Receipt, PiggyBank, Settings, HelpCircle, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { SidebarConfig } from "@/types";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  role: "patient" | "pharmacy" | "admin";
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function MobileDrawer({ role, isOpen, onClose, className }: MobileDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (!isOpen) return null;

  const sidebarData: Record<typeof role, SidebarConfig> = {
    patient: {
      user: {
        name: "Anant Tirupati",
        subtitle: "Premium Member",
        avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-yIlpi6nLlRmFhS0wTZtIFMxFiq0EWEGS9D-4LGUSq7Amss8JMSSF7IH84VPdWwWg6lHdzWvY2yDJWPN8lhy-BNee-ofpsZP6Bpr7HdNNCSL5NtVkW6Jg33nwqc_TgrBrctn5LBbsCQTHXdDsxtT5ASNOwfn_y3ku-joO8rgWe1bqJLWi1bpHR8wroCtEzi3ea8IPWHe4wPkB5Zm2O_JqlNE-xje8p6-cHrxo8hGcGNDOkFeicDL5",
      },
      nav_items: [
        { label: "Dashboard", href: "/dashboard/patient", icon: "dashboard" },
        { label: "Active Bids", href: "/dashboard/patient/live-auctions", icon: "gavel" },
        { label: "My Prescriptions", href: "/dashboard/patient/accepted", icon: "medication" },
        { label: "Open Offers", href: "/dashboard/patient/open-offers", icon: "savings" },
        { label: "Settings", href: "/dashboard/patient/profile", icon: "settings" },
      ],
      bottom_items: [
        { label: "Help Center", href: "#", icon: "help" },
      ],
      cta: {
        label: "Upload Prescription",
        href: "/dashboard/patient/upload",
      },
    },
    pharmacy: {
      user: {
        name: "Apollo Pharmacy",
        subtitle: "Verified Partner",
        avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcAFIy8qO6brIXU26lUqZ8yEvPoM3sjOsaPdIOcouQJF50FK6ukCCpcGQEmXFhYQnq5CcpJDapkCp8hElmtvDhMavZiT5Dy115WoH3468LR2c_EtDblF5OdQQnP1mUubCESQqQsJuya7VuoajPt5OJFSnk4XXf1kfn5UWwu1Wz8-1QwGesZmZWamiD1tEboBoKDTTkJA8A9ECFuw9DOGg8ZxVN1oLk9ecQ6crjfe4n3RLPxcM4-y_J",
      },
      nav_items: [
        { label: "Console", href: "/dashboard/pharmacy", icon: "dashboard" },
        { label: "Live Auctions", href: "/dashboard/pharmacy/live-auctions", icon: "gavel" },
        { label: "My Active Bids", href: "/dashboard/pharmacy/my-bids", icon: "bids" },
        { label: "Pharmacy Profile", href: "/dashboard/pharmacy/profile", icon: "settings" },
      ],
      bottom_items: [
        { label: "Support Dispatch", href: "#", icon: "help" },
      ],
    },
    admin: {
      user: {
        name: "Admin Control",
        subtitle: "System Auditor",
        avatar_url: "",
      },
      nav_items: [
        { label: "Control Center", href: "/dashboard/admin", icon: "dashboard" },
        { label: "Verifications", href: "/dashboard/admin/pharmacy-verification", icon: "verification" },
        { label: "Moderations", href: "/dashboard/admin/prescriptions", icon: "medication" },
        { label: "Auctions Admin", href: "/dashboard/admin/auctions", icon: "gavel" },
        { label: "Users & Providers", href: "/dashboard/admin/users", icon: "users" },
        { label: "System Config", href: "/dashboard/admin/settings", icon: "settings" },
      ],
      bottom_items: [
        { label: "Platform Docs", href: "#", icon: "help" },
      ],
    },
  };

  const config = sidebarData[role];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "dashboard":
        return <LayoutDashboard className="w-5 h-5" />;
      case "gavel":
        return <Gavel className="w-5 h-5" />;
      case "medication":
        return <Receipt className="w-5 h-5" />;
      case "savings":
        return <PiggyBank className="w-5 h-5" />;
      case "settings":
        return <Settings className="w-5 h-5" />;
      case "verification":
        return <ShieldCheck className="w-5 h-5" />;
      case "users":
        return <Users className="w-5 h-5" />;
      case "bids":
        return <Gavel className="w-5 h-5" />;
      case "help":
      default:
        return <HelpCircle className="w-5 h-5" />;
    }
  };

  const handleLogout = async () => {
    onClose();
    try {
      await authService.signOut();
    } catch (err) {
      console.error("SignOut failed:", err);
    }
    router.push("/login");
  };

  return (
    <div className={cn("fixed inset-0 z-50 flex md:hidden", className)}>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content wrapper */}
      <div className="relative w-[280px] max-w-[80%) bg-surface-container-low h-full flex flex-col p-6 gap-6 animate-in slide-in-from-left duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-5 mt-4">
          <Avatar className="w-10 h-10 border border-outline-variant flex items-center justify-center bg-[#1A2332]">
            {config.user.avatar_url ? (
              <img src={config.user.avatar_url} alt={config.user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-primary text-body-md">{config.user.name[0]}</span>
            )}
          </Avatar>
          <div className="overflow-hidden">
            <div className="text-body-md font-semibold text-primary truncate leading-snug">
              {config.user.name}
            </div>
            <div className="text-[11px] text-on-surface-variant truncate">
              {config.user.subtitle}
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex flex-col gap-1.5 flex-grow overflow-y-auto">
          {config.nav_items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-label-lg font-semibold transition-all",
                  isActive
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                )}
              >
                {getIcon(item.icon)}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        {config.cta && (
          <Link href={config.cta.href} onClick={onClose} className="w-full">
            <Button variant="primary" className="w-full py-2.5 h-11 text-label-md">
              {config.cta.label}
            </Button>
          </Link>
        )}

        {/* Bottom items */}
        <div className="flex flex-col gap-1.5 border-t border-outline-variant/30 pt-4 mt-auto">
          {config.bottom_items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-lg text-label-md font-semibold"
            >
              {getIcon(item.icon)}
              <span>{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container/10 rounded-lg text-label-md font-semibold w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileDrawer;
