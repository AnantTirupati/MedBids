"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Award, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PrescriptionCard } from "@/components/shared/prescription-card";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { OfferCard } from "@/components/shared/offer-card";
import { usePrescription } from "@/hooks/usePrescription";
import { patientService } from "@/services/patient.service";
import { Offer } from "@/types";

export default function PrescriptionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const prescriptionId = params.id as string;

  const { loading: rxLoading, prescription } = usePrescription(prescriptionId);
  const [offers, setOffers] = React.useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = React.useState(true);

  React.useEffect(() => {
    const loadOffers = async () => {
      try {
        const offersData = await patientService.getPatientOffers("p1");
        setOffers(offersData.filter((o) => o.prescription_id === prescriptionId));
      } catch (err) {
        console.error(err);
      } finally {
        setOffersLoading(false);
      }
    };
    if (prescription) {
      loadOffers();
    }
  }, [prescription, prescriptionId]);

  const handleAcceptOffer = async (offerId: string) => {
    try {
      await patientService.acceptOffer(offerId);
      router.push("/dashboard/patient/accepted");
    } catch (err) {
      console.error(err);
    }
  };

  const loading = rxLoading || (prescription ? offersLoading : false);

  if (loading) {
    return (
      <div className="space-y-6 py-6 animate-pulse select-none">
        <div className="h-8 w-1/4 bg-[#273647]/35 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-96 bg-[#273647]/35 rounded" />
          <div className="lg:col-span-4 h-64 bg-[#273647]/35 rounded" />
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
        <ShieldAlert className="w-16 h-16 text-error" />
        <div>
          <h2 className="text-headline-md font-bold text-on-surface">Prescription Not Found</h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            The requested prescription ID does not exist in the marketplace.
          </p>
        </div>
        <Link href="/dashboard/patient">
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    );
  }

  const isLive = prescription.status === "auction_live";
  const activeOffer = offers.find((o) => o.status === "open");

  return (
    <div className="flex flex-col gap-6 w-full py-4 select-none">
      {/* Back link */}
      <div>
        <Link
          href="/dashboard/patient"
          className="inline-flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary transition-colors font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column: Prescription details card */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <PrescriptionCard prescription={prescription} />
        </div>

        {/* Right Column: Bid / Offer Action summary */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Bid Summary monitor */}
          <Card className="rounded-card border border-surface-card-border bg-surface-card p-6 flex flex-col gap-4">
            <h3 className="text-headline-sm font-semibold text-on-surface">Bidding Monitor</h3>
            
            {isLive ? (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center py-2 border-b border-[#273244]/30">
                  <span className="text-body-sm text-on-surface-variant">Auction Ends In</span>
                  {/* Mock countdown for Lantus Solostar end date */}
                  <CountdownTimer endTime={new Date(Date.now() + 15 * 60 * 1000).toISOString()} />
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#273244]/30">
                  <span className="text-body-sm text-on-surface-variant">Total Offers Received</span>
                  <span className="font-bold text-on-surface">{offers.length} competing stores</span>
                </div>
                <Link href="/dashboard/patient/open-offers" className="w-full mt-2">
                  <Button variant="primary" className="w-full">
                    Review Competitive Offers
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2 text-center py-4">
                <Clock className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
                <p className="text-body-md font-semibold text-on-surface mt-2">Auction Concluded</p>
                <p className="text-body-sm text-on-surface-variant">
                  Offers window has closed for this prescription.
                </p>
              </div>
            )}
          </Card>

          {/* Best offer highlights */}
          {activeOffer && (
            <div className="flex flex-col gap-3">
              <h3 className="text-label-lg uppercase tracking-wider text-on-surface-variant font-semibold select-none">
                Best Competing Offer
              </h3>
              <OfferCard offer={activeOffer} onAccept={handleAcceptOffer} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
