import * as React from "react";
import { cn } from "@/lib/utils";

export interface TimelineEvent {
  id: string;
  timeLabel: string;
  title: string;
  description?: string;
  accent?: "primary" | "secondary" | "outline-variant" | "tertiary";
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function ActivityTimeline({ events, className }: ActivityTimelineProps) {
  return (
    <div className={cn("relative pl-6 border-l border-[#273244] flex flex-col gap-8", className)}>
      {events.map((event) => {
        let nodeBorderColor = "border-outline-variant";
        let timeColor = "text-on-surface-variant";

        if (event.accent === "primary") {
          nodeBorderColor = "border-primary";
          timeColor = "text-primary";
        } else if (event.accent === "secondary") {
          nodeBorderColor = "border-secondary";
          timeColor = "text-secondary";
        } else if (event.accent === "tertiary") {
          nodeBorderColor = "border-tertiary";
          timeColor = "text-tertiary";
        }

        return (
          <div key={event.id} className="relative">
            {/* Timeline node */}
            <div
              className={cn(
                "absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-[#0B0F14] border-2",
                nodeBorderColor
              )}
            />
            {/* Timestamp */}
            <div className={cn("text-label-md font-semibold mb-1 select-none", timeColor)}>
              {event.timeLabel}
            </div>
            {/* Title */}
            <p className="text-body-md font-medium text-on-surface">
              {event.title}
            </p>
            {/* Optional Description */}
            {event.description && (
              <p className="text-body-sm text-on-surface-variant mt-0.5">
                {event.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ActivityTimeline;
