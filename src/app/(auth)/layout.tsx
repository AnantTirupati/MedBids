import * as React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center text-on-surface p-margin-mobile md:p-margin-desktop relative overflow-hidden bg-[#0B0F14]">
      {/* Ambient background effect exactly matching Stitch Auth screens */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="bg-gradient-to-tr from-primary-container/20 to-transparent w-full h-full" />
      </div>
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}
