"use client";

import * as React from "react";

export function useCountdown(endTime: string | Date, urgentMinutes = 15) {
  const [timeLeft, setTimeLeft] = React.useState<string>("");
  const [isUrgent, setIsUrgent] = React.useState<boolean>(false);
  const [hasEnded, setHasEnded] = React.useState<boolean>(false);

  React.useEffect(() => {
    const end = new Date(endTime).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Ended");
        setIsUrgent(false);
        setHasEnded(true);
        return false;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setIsUrgent(diff < urgentMinutes * 60 * 1000);
      setHasEnded(false);

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
  }, [endTime, urgentMinutes]);

  return { timeLeft, isUrgent, hasEnded };
}

export default useCountdown;
