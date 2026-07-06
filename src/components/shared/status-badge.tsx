import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType =
  | "live"
  | "pending"
  | "verified"
  | "rejected"
  | "expired"
  | "accepted"
  | "fulfilled";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase() as StatusType;

  let badgeVariant: "default" | "secondary" | "outline" | "success" | "destructive" = "default";
  let pulseDot = false;
  let label = status;

  switch (normalized) {
    case "live":
      badgeVariant = "secondary";
      pulseDot = true;
      label = "Live";
      break;
    case "pending":
      badgeVariant = "default";
      label = "Pending";
      break;
    case "verified":
      badgeVariant = "success";
      label = "Verified";
      break;
    case "accepted":
      badgeVariant = "success";
      label = "Accepted";
      break;
    case "fulfilled":
      badgeVariant = "success";
      label = "Fulfilled";
      break;
    case "rejected":
      badgeVariant = "destructive";
      label = "Rejected";
      break;
    case "expired":
      badgeVariant = "outline";
      label = "Expired";
      break;
    default:
      badgeVariant = "outline";
  }

  return (
    <Badge
      variant={badgeVariant}
      className={cn(
        "gap-1.5 px-2 py-0.5",
        normalized === "live" && "border-secondary-container text-secondary bg-secondary-container/20",
        normalized === "pending" && "border-outline-variant text-on-surface-variant bg-surface-container",
        normalized === "verified" && "border-tertiary-container text-tertiary bg-tertiary-container/10",
        normalized === "accepted" && "border-tertiary-container text-tertiary bg-tertiary-container/10",
        normalized === "fulfilled" && "border-tertiary-container text-tertiary bg-tertiary-container/10",
        normalized === "rejected" && "border-error-container text-error bg-error-container/10",
        normalized === "expired" && "border-outline text-text-muted bg-transparent",
        className
      )}
    >
      {pulseDot && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      <span>{label}</span>
    </Badge>
  );
}

export default StatusBadge;
