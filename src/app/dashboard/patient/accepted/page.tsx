"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, QrCode, MapPin, Calendar, Clock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { OfferCard } from "@/components/shared/offer-card";
import { EmptyState } from "@/components/shared/empty-state";
import { patientService } from "@/services/patient.service";
import { Offer } from "@/types";

export default function AcceptedReservationsPage() {
  const [acceptedOffers, setAcceptedOffers] = React.useState<Offer[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadAccepted = async () => {
      try {
        const data = await patientService.getPatientOffers("p1");
        // Show accepted or fulfilled offers
        setAcceptedOffers(data.filter((o) => o.status === "accepted" || o.status === "fulfilled"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAccepted();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full py-4 select-none">
      {/* Header breadcrumb */}
      <div>
        <Link
          href="/dashboard/patient"
          className="inline-flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary transition-colors font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard Home
        </Link>
      </div>

      <header className="flex flex-col gap-1.5">
        <h1 className="text-display-md font-bold text-on-surface tracking-tight flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-primary" />
          My Reserved Orders
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Present the QR code at the selected pharmacy counter to complete verification and pickup.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse mt-4">
          <div className="lg:col-span-8 h-64 bg-[#273647]/35 rounded-card" />
          <div className="lg:col-span-4 h-64 bg-[#273647]/35 rounded-card" />
        </div>
      ) : acceptedOffers.length === 0 ? (
        <EmptyState
          title="No Reservations Yet"
          description="You haven't accepted any pharmacy quotes yet. Head to Live Auctions to monitor bids."
          className="mt-4"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start mt-4">
          {/* List of reservations */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {acceptedOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} isAcceptedView />
            ))}
          </div>

          {/* Verification QR details */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <Card className="rounded-card border border-surface-card-border bg-[#151C26] p-6 flex flex-col items-center text-center gap-4">
              <QrCode className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-headline-sm font-semibold text-on-surface">Store Verification Code</h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Present code below at pickup counter
                </p>
              </div>

              {/* High end SVG QR placeholder */}
              <div className="p-4 rounded-xl bg-white/5 border border-outline-variant/30 flex items-center justify-center w-40 h-40">
                <svg className="w-full h-full text-on-surface" viewBox="0 0 100 100" fill="currentColor">
                  {/* QR blocks matrix */}
                  <rect x="10" y="10" width="20" height="20" />
                  <rect x="15" y="15" width="10" height="10" fill="#0B0F14" />
                  <rect x="70" y="10" width="20" height="20" />
                  <rect x="75" y="15" width="10" height="10" fill="#0B0F14" />
                  <rect x="10" y="70" width="20" height="20" />
                  <rect x="15" y="75" width="10" height="10" fill="#0B0F14" />
                  {/* Random QR pixels */}
                  <rect x="40" y="10" width="5" height="15" />
                  <rect x="45" y="30" width="15" height="5" />
                  <rect x="10" y="45" width="10" height="10" />
                  <rect x="30" y="50" width="10" height="5" />
                  <rect x="50" y="50" width="5" height="15" />
                  <rect x="70" y="40" width="20" height="5" />
                  <rect x="60" y="60" width="10" height="10" />
                  <rect x="80" y="70" width="10" height="10" />
                  <rect x="45" y="80" width="15" height="5" />
                </svg>
              </div>

              <div className="w-full flex flex-col gap-3 text-left border-t border-[#273244]/40 pt-4 mt-2">
                <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>Apollo Pharmacy, Jubilee Hills branch</span>
                </div>
                <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>Pickup window valid for 7 days</span>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}
