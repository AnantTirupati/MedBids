"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Gavel, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  role: "patient" | "pharmacy" | "admin";
  className?: string;
}

export function MobileBottomNav({ role, className }: MobileBottomNavProps) {
  const pathname = usePathname();

  const getLinks = () => {
    switch (role) {
      case "pharmacy":
        return [
          { label: "Console", href: "/dashboard/pharmacy", icon: <Home className="w-5 h-5" /> },
          { label: "Live Auctions", href: "/dashboard/pharmacy/live-auctions", icon: <Gavel className="w-5 h-5" /> },
          { label: "Bids", href: "/dashboard/pharmacy/my-bids", icon: <Wallet className="w-5 h-5" /> },
          { label: "Profile", href: "/dashboard/pharmacy/profile", icon: <User className="w-5 h-5" /> },
        ];
      case "admin":
        return [
          { label: "Console", href: "/dashboard/admin", icon: <Home className="w-5 h-5" /> },
          { label: "Verif", href: "/dashboard/admin/pharmacy-verification", icon: <Gavel className="w-5 h-5" /> },
          { label: "Moderations", href: "/dashboard/admin/prescriptions", icon: <Wallet className="w-5 h-5" /> },
          { label: "Users", href: "/dashboard/admin/users", icon: <User className="w-5 h-5" /> },
        ];
      case "patient":
      default:
        return [
          { label: "Home", href: "/dashboard/patient", icon: <Home className="w-5 h-5" /> },
          { label: "Bids", href: "/dashboard/patient/live-auctions", icon: <Gavel className="w-5 h-5" /> },
          { label: "Wallet", href: "/dashboard/patient/accepted", icon: <Wallet className="w-5 h-5" /> },
          { label: "Profile", href: "/dashboard/patient/profile", icon: <User className="w-5 h-5" /> },
        ];
    }
  };

  const navLinks = getLinks();

  return (
    <nav
      className={cn(
        "md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 bg-surface rounded-t-xl border-t border-outline-variant shadow-lg select-none",
        className
      )}
    >
      {navLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              "flex flex-col items-center gap-1 active:scale-95 transition-transform duration-100 p-2 rounded-lg",
              isActive ? "text-primary font-bold" : "text-on-surface-variant"
            )}
          >
            {link.icon}
            <span className="text-[10px] font-semibold tracking-wide uppercase">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default MobileBottomNav;
