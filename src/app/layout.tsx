import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        {children}
      </body>
    </html>
  );
}
