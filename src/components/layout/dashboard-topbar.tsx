"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, User, LogOut, Settings } from "lucide-react";
import { authService } from "@/services/auth.service";
import { Avatar } from "@/components/ui/avatar";
import { NotificationPanel } from "@/components/shared/notification-panel";
import { Notification, NotificationType } from "@/types";
import { cn } from "@/lib/utils";

interface DashboardTopbarProps {
  role: "patient" | "pharmacy" | "admin";
  onMobileMenuToggle?: () => void;
  className?: string;
}

export function DashboardTopbar({ role, onMobileMenuToggle, className }: DashboardTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  // Mock Notifications for dropdown display
  const [notifications, setNotifications] = React.useState<Notification[]>(() => [
    {
      id: "n1",
      user_id: "u1",
      type: NotificationType.BID_RECEIVED,
      title: "New offer received",
      message: "Apollo Pharmacy submitted bid of ₹1,850 for Lantus Solostar.",
      is_read: false,
      action_url: "/dashboard/patient/open-offers",
      created_at: new Date().toISOString(),
    },
    {
      id: "n2",
      user_id: "u1",
      type: NotificationType.PRESCRIPTION_VERIFIED,
      title: "Prescription verified",
      message: "Metformin HCL 500mg has been verified by the medical team.",
      is_read: false,
      action_url: "/dashboard/patient",
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "n3",
      user_id: "u1",
      type: NotificationType.SYSTEM,
      title: "System Maintenance",
      message: "Platform services will undergo scheduled upgrades tonight at 12 AM.",
      is_read: true,
      action_url: null,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getProfileImage = () => {
    if (role === "patient") {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuD-yIlpi6nLlRmFhS0wTZtIFMxFiq0EWEGS9D-4LGUSq7Amss8JMSSF7IH84VPdWwWg6lHdzWvY2yDJWPN8lhy-BNee-ofpsZP6Bpr7HdNNCSL5NtVkW6Jg33nwqc_TgrBrctn5LBbsCQTHXdDsxtT5ASNOwfn_y3ku-joO8rgWe1bqJLWi1bpHR8wroCtEzi3ea8IPWHe4wPkB5Zm2O_JqlNE-xje8p6-cHrxo8hGcGNDOkFeicDL5";
    }
    if (role === "pharmacy") {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuDcAFIy8qO6brIXU26lUqZ8yEvPoM3sjOsaPdIOcouQJF50FK6ukCCpcGQEmXFhYQnq5CcpJDapkCp8hElmtvDhMavZiT5Dy115WoH3468LR2c_EtDblF5OdQQnP1mUubCESQqQsJuya7VuoajPt5OJFSnk4XXf1kfn5UWwu1Wz8-1QwGesZmZWamiD1tEboBoKDTTkJA8A9ECFuw9DOGg8ZxVN1oLk9ecQ6crjfe4n3RLPxcM4-y_J";
    }
    return "";
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full h-16 bg-[#051424] border-b border-outline-variant z-50 px-6 flex justify-between items-center select-none",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link href="/" className="text-headline-sm font-bold text-on-surface tracking-tight">
          MedMarket Premium
        </Link>
      </div>

      <div className="flex items-center gap-5 relative">
        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-1.5 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-10 z-50">
              <NotificationPanel
                notifications={notifications}
                onMarkRead={handleMarkRead}
                onClearAll={handleClearAll}
              />
            </div>
          )}
        </div>

        {/* Profile Avatar Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-outline-variant overflow-hidden"
          >
            <Avatar className="w-full h-full flex items-center justify-center bg-[#101419]">
              {getProfileImage() ? (
                <img src={getProfileImage()} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-primary" />
              )}
            </Avatar>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-10 w-48 rounded-card border border-surface-card-border bg-[#151C26] shadow-xl p-1 z-50 flex flex-col">
              <Link
                href={`/dashboard/${role}/profile`}
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-body-sm text-on-surface-variant hover:bg-surface-card-hover hover:text-on-surface rounded-lg transition-colors font-semibold"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button
                onClick={async () => {
                  setShowProfileMenu(false);
                  try {
                    await authService.signOut();
                  } catch (err) {
                    console.error("SignOut failed:", err);
                  }
                  router.push("/login");
                }}
                className="flex items-center gap-2 px-3 py-2 text-body-sm text-error hover:bg-error-container/10 rounded-lg transition-colors font-semibold border-t border-[#273244]/30 mt-1 pt-2 w-full text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default DashboardTopbar;
