"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function LegacySignupPage() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/auth");
  }, [router]);

  return (
    <div className="flex items-center justify-center p-8 text-center text-on-surface-variant">
      Redirecting to portal gateway...
    </div>
  );
}
