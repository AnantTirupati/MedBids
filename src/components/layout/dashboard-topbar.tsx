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
import { useAuth } from "@/hooks/useAuth";
import { notificationService } from "@/services/notification.service";

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
  const { user, profile } = useAuth();

  // Real-time notifications from Firestore
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = notificationService.subscribeNotifications(user.uid, (notifs) => {
      setNotifications(notifs);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const handleMarkRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleClearAll = async () => {
    setNotifications([]);
    if (user?.uid) {
      try {
        await notificationService.clearAll(user.uid);
      } catch (err) {
        console.error("Failed to clear notifications:", err);
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getProfileImage = (): string | null => {
    // Use Firebase Auth photoURL (set by Google sign-in)
    if (user?.photoURL) return user.photoURL;
    // Fall back to profile avatar if stored
    if (profile?.avatar_url) return profile.avatar_url;
    return null;
  };

  const getInitials = (): string => {
    const name = profile?.full_name || user?.displayName || user?.email || "";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.charAt(0).toUpperCase() || "?";
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
          MedBids
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
                <img src={getProfileImage()!} alt="profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="font-bold text-primary text-xs">{getInitials()}</span>
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
