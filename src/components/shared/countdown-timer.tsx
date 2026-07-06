"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  endTime: string | Date;
  onEnd?: () => void;
  className?: string;
}

export function CountdownTimer({ endTime, onEnd, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState<string>("");
  const [isUrgent, setIsUrgent] = React.useState<boolean>(false);

  React.useEffect(() => {
    const end = new Date(endTime).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Ended");
        setIsUrgent(false);
        if (onEnd) onEnd();
        return false;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Highlight in gold (#B08D57) if less than 15 minutes left
      const urgent = diff < 15 * 60 * 1000;
      setIsUrgent(urgent);

      let timeString = "";
      if (hours > 0) {
        timeString += `${hours}h `;
      }
      timeString += `${minutes}m ${seconds}s`;

      setTimeLeft(timeString);
      return true;
    };

    updateTimer();
    const interval = setInterval(() => {
      const active = updateTimer();
      if (!active) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, onEnd]);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-sans font-semibold text-body-sm select-none",
        isUrgent ? "text-secondary animate-pulse" : "text-on-surface-variant",
        className
      )}
    >
      <Clock className="w-4 h-4" />
      <span>{timeLeft}</span>
    </div>
  );
}

export default CountdownTimer;
