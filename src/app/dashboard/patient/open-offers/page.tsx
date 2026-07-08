"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, PiggyBank } from "lucide-react";
import { OfferCard } from "@/components/shared/offer-card";
import { EmptyState } from "@/components/shared/empty-state";
import { patientService } from "@/services/patient.service";
import { useAuth } from "@/hooks/useAuth";
import { Offer } from "@/types";

export default function OpenOffersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const patientId = user?.uid || "";
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user?.uid) {
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }
    const loadOffers = async () => {
      try {
        const data = await patientService.getPatientOffers(patientId);
        // Show open offers
        setOffers(data.filter((o) => o.status === "open"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOffers();
  }, [patientId, user?.uid]);

  const handleAccept = async (offerId: string) => {
    try {
      await patientService.acceptOffer(offerId);
      router.push("/dashboard/patient/accepted");
    } catch (err) {
      console.error(err);
    }
  };

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
          <PiggyBank className="w-6 h-6 text-primary" />
          Open Competing Offers
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Review competing quotes submitted by local licensed pharmacies. Choose the best offer to reserve your order.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse mt-4">
          <div className="h-56 bg-[#273647]/35 rounded-card" />
          <div className="h-56 bg-[#273647]/35 rounded-card" />
        </div>
      ) : offers.length === 0 ? (
        <EmptyState
          title="No Open Offers"
          description="There are no competing pharmacy quotes currently pending for your verification."
          className="mt-4"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mt-4">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onAccept={handleAccept} />
          ))}
        </div>
      )}
    </div>
  );
}
