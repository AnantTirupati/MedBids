import * as React from "react";

export function useAuctionCountdown(endTimeStr: string | null | undefined, onExpire?: () => void) {
  const calculateTimeLeft = React.useCallback(() => {
    if (!endTimeStr) return 0;
    const now = new Date().getTime();
    const endTime = new Date(endTimeStr).getTime();
    return Math.max(0, Math.floor((endTime - now) / 1000));
  }, [endTimeStr]);

  const [timeLeft, setTimeLeft] = React.useState<number>(() => calculateTimeLeft());

  React.useEffect(() => {
    if (!endTimeStr) return;

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        if (onExpire) {
          onExpire();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTimeStr, calculateTimeLeft, onExpire]);

  const formatTime = () => {
    if (timeLeft <= 0) return "00:00:00";
    const hrs = Math.floor(timeLeft / 3600);
    const mins = Math.floor((timeLeft % 3600) / 60);
    const secs = timeLeft % 60;
    return [
      hrs.toString().padStart(2, "0"),
      mins.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  return { timeLeft, formattedTime: formatTime(), isExpired: timeLeft <= 0 };
}

export default useAuctionCountdown;
