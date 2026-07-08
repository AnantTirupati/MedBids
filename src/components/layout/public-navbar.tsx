"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function PublicNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const { authenticated, role } = useAuth();

  const dashboardPath =
    role === "pharmacy"
      ? "/dashboard/pharmacy"
      : role === "admin"
        ? "/dashboard/admin"
        : "/dashboard/patient";

  const navLinks = [
    { label: "How it Works", href: "/#how-it-works" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-20 bg-background/80 backdrop-blur-md border-b border-outline-variant z-50 px-margin-mobile md:px-margin-desktop flex justify-between items-center select-none">
        <div className="flex items-center gap-stack-lg">
          <Link href="/" className="text-headline-md font-bold text-on-surface hover:text-primary transition-colors">
            MedBids
          </Link>
          <div className="hidden md:flex items-center gap-stack-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-label-lg transition-colors font-semibold",
                    isActive
                      ? "text-primary"
                      : "text-on-surface-variant hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {authenticated ? (
            <Link href={dashboardPath}>
              <Button variant="primary" className="h-10 px-5 text-label-md bg-[#FF6B35] hover:bg-[#FF6B35]/90 border-none text-white font-bold flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/auth">
              <Button variant="primary" className="h-10 px-5 text-label-md bg-[#FF6B35] hover:bg-[#FF6B35]/90 border-none text-white font-bold">
                Get Started
              </Button>
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-20 bg-background/95 backdrop-blur-md z-40 md:hidden flex flex-col p-6 gap-6 animate-in fade-in slide-in-from-top-5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-headline-sm font-semibold text-on-surface border-b border-outline-variant/30 pb-3"
            >
              {link.label}
            </Link>
          ))}
          {authenticated ? (
            <Link href={dashboardPath} onClick={() => setIsOpen(false)}>
              <Button variant="primary" className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 border-none text-white font-bold flex items-center justify-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/auth" onClick={() => setIsOpen(false)}>
              <Button variant="primary" className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 border-none text-white font-bold">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default PublicNavbar;
