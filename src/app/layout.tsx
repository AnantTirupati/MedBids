import type { Metadata } from "next";
import "./globals.css";
const geistSans = { variable: "font-sans" };
const geistMono = { variable: "font-mono" };

export const metadata: Metadata = {
  title: {
    default: "MedBids - Premium Healthcare Marketplace",
    template: "%s | MedBids",
  },
  description:
    "Upload your prescription and receive competitive offers from trusted pharmacies in your area. Secure, transparent, and built for precision logistics.",
  keywords: [
    "pharmacy",
    "prescription",
    "healthcare",
    "marketplace",
    "auction",
    "medication",
    "MedBids",
  ],
};

import { AuthProvider } from "@/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-on-surface font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
