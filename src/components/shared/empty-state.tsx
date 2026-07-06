import * as React from "react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = "No data found",
  description = "There are no records to display at the moment.",
  icon = <Inbox className="w-12 h-12 text-on-surface-variant/40" />,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center glass-card border border-outline-variant min-h-[300px] gap-4 select-none",
        className
      )}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-low border border-outline-variant/50">
        {icon}
      </div>
      <div className="max-w-[400px]">
        <h3 className="text-headline-sm font-semibold text-on-surface mb-1">
          {title}
        </h3>
        <p className="text-body-sm text-on-surface-variant">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
