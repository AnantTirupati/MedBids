"use client";

import * as React from "react";
import { Bell, ShieldAlert, Award, FileSpreadsheet, PlusCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Notification } from "@/types";
import { cn } from "@/lib/utils";

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkRead?: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export function NotificationPanel({
  notifications,
  onMarkRead,
  onClearAll,
  className,
}: NotificationPanelProps) {
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Card
      className={cn(
        "w-80 rounded-card border border-surface-card-border bg-[#151C26] shadow-2xl relative overflow-hidden select-none",
        className
      )}
    >
      <CardHeader className="p-4 border-b border-[#273244] flex flex-row items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-primary" />
          <CardTitle className="text-body-md font-bold">Notifications</CardTitle>
          {unreadCount > 0 && (
            <span className="h-5 px-1.5 rounded-full bg-primary-container text-on-primary-container text-[11px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        {notifications.length > 0 && onClearAll && (
          <button
            onClick={onClearAll}
            className="text-[11px] font-bold text-text-muted hover:text-primary transition-colors uppercase tracking-wider"
          >
            Clear All
          </button>
        )}
      </CardHeader>

      <CardContent className="p-0 max-h-[320px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-body-sm text-on-surface-variant flex flex-col items-center justify-center gap-2">
            <Bell className="w-8 h-8 text-on-surface-variant/30" />
            <span>All caught up! No notifications.</span>
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.map((notif) => {
              // Icon selector
              let icon = <PlusCircle className="w-4 h-4 text-primary" />;
              if (notif.type === "bid_received") {
                icon = <Award className="w-4 h-4 text-secondary" />;
              } else if (notif.type === "prescription_verified") {
                icon = <FileSpreadsheet className="w-4 h-4 text-tertiary" />;
              } else if (notif.type === "system") {
                icon = <ShieldAlert className="w-4 h-4 text-error" />;
              }

              return (
                <div
                  key={notif.id}
                  onClick={() => onMarkRead && onMarkRead(notif.id)}
                  className={cn(
                    "p-3 border-b border-[#273244]/40 flex gap-3 cursor-pointer hover:bg-surface-card-hover/40 transition-colors relative",
                    !notif.is_read && "bg-primary-container/5"
                  )}
                >
                  {!notif.is_read && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                  <div className="shrink-0 mt-0.5">{icon}</div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-body-sm font-semibold text-on-surface">
                      {notif.title}
                    </span>
                    <span className="text-[12px] text-on-surface-variant leading-relaxed">
                      {notif.message}
                    </span>
                    <span className="text-[10px] text-text-muted mt-1">
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default NotificationPanel;
