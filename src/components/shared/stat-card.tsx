import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  highlighted?: boolean;
  className?: string;
}

export function StatCard({ label, value, icon, highlighted = false, className }: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative rounded-card p-6 flex flex-col justify-between h-32 select-none",
        highlighted ? "border-primary-container/40" : "border-surface-card-border",
        className
      )}
    >
      {highlighted && (
        <div className="absolute inset-0 bg-primary-container/10 pointer-events-none rounded-card" />
      )}
      <div className="relative z-10 flex justify-between items-start">
        <span
          className={cn(
            "text-label-lg uppercase tracking-widest font-semibold",
            highlighted ? "text-primary" : "text-on-surface-variant"
          )}
        >
          {label}
        </span>
        {icon && (
          <span className={cn("text-on-surface-variant", highlighted && "text-primary")}>
            {icon}
          </span>
        )}
      </div>
      <div
        className={cn(
          "relative z-10 text-display-md font-bold tracking-tight",
          highlighted ? "text-primary" : "text-on-surface"
        )}
      >
        {value}
      </div>
    </Card>
  );
}

export default StatCard;
