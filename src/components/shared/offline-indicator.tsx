"use client";

import * as React from "react";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = React.useState(() => {
    if (typeof window !== "undefined") {
      return !window.navigator.onLine;
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-bounce select-none">
      <div className="bg-error text-error-container p-4 rounded-xl shadow-lg border border-error-container/20 flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-white" />
        <div>
          <h4 className="text-body-md font-bold text-white leading-none mb-1">Offline Mode</h4>
          <p className="text-xs text-white/95 leading-none">Connection lost. Reconnecting...</p>
        </div>
      </div>
    </div>
  );
}

export default OfflineIndicator;
