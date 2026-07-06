import * as React from "react";
import { ShieldCheck, Heart, HeartPulse, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-[#051424] py-section-gap px-margin-mobile md:px-margin-desktop select-none">
      <div className="max-w-[800px] mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-display-lg-mobile md:text-display-md text-on-surface font-bold tracking-tight">
            Trust Standards & Mission
          </h1>
          <p className="text-body-lg text-on-surface-variant mt-3 max-w-[600px] mx-auto leading-relaxed">
            MedBids is engineered to combine absolute medical compliance with competitive bidding efficiency, giving you complete clarity over prescription costs.
          </p>
        </div>

        {/* Editorial Content - 2 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg border-t border-outline-variant/30 pt-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-headline-md font-bold text-on-surface">Our Medical Mission</h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              We believe that acquiring critical medication should not be a complex negotiation. By standardizing digital verification and enabling secure marketplace competition, we shift pricing leverage back to patients.
            </p>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              Our system ensures every competing provider is an officially licensed pharmacy. No unverified third parties, no compromise on storage safety.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-headline-md font-bold text-on-surface">The Trust Standard</h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              Every prescription uploaded undergoes encrypted security validation before matching with pharmacies. Our double-verification protocol protects patient confidentiality while fulfilling local regulatory criteria.
            </p>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              By delivering real-time bidding visibility, we eliminate hidden retail surcharges, making medication procurement transparent.
            </p>
          </div>
        </div>

        {/* Value boxes grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-stack-md mt-6">
          <div className="p-6 rounded-card border border-outline-variant/55 bg-surface-container flex flex-col gap-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <h3 className="text-headline-sm font-semibold text-on-surface">100% Verified</h3>
            <p className="text-body-sm text-on-surface-variant">
              Only licensed, physical pharmacies operate within our bids network.
            </p>
          </div>
          <div className="p-6 rounded-card border border-outline-variant/55 bg-surface-container flex flex-col gap-2">
            <Heart className="w-8 h-8 text-primary" />
            <h3 className="text-headline-sm font-semibold text-on-surface">Patient First</h3>
            <p className="text-body-sm text-on-surface-variant">
              Every detail is engineered to simplify search loads and minimize fees.
            </p>
          </div>
          <div className="p-6 rounded-card border border-outline-variant/55 bg-surface-container flex flex-col gap-2">
            <HeartPulse className="w-8 h-8 text-primary" />
            <h3 className="text-headline-sm font-semibold text-on-surface">Precision Logistics</h3>
            <p className="text-body-sm text-on-surface-variant">
              Fulfillment times and delivery terms are verified before reservation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
