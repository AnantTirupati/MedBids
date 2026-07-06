import * as React from "react";
import Link from "next/link";
import { Upload, ArrowRight, ShieldCheck, HeartPulse, ShieldAlert, Award, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full bg-[#051424]">
      {/* Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[60vh] flex items-center justify-center px-margin-mobile md:px-margin-desktop py-10 md:py-16 overflow-hidden">
        {/* Radial Background Gradients (matching Stitch specs) */}
        <div
          className="absolute inset-0 z-0 opacity-25 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(15, 118, 110, 0.15) 0%, rgba(5, 20, 36, 1) 100%)",
          }}
        />
        <div className="absolute right-[-10%] top-[-10%] w-[50%] h-[50%] bg-primary-container/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-[800px] mx-auto text-center flex flex-col items-center gap-stack-md">
          {/* Secured marketplace badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container border border-outline-variant text-primary font-semibold text-label-md select-none">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Medical Marketplace</span>
          </div>

          {/* Heading */}
          <h1 className="text-display-lg-mobile md:text-display-lg text-on-surface font-bold tracking-tight">
            Upload Your Prescription. <br className="hidden md:block" />
            <span className="text-primary-container">Verified Pharmacies Compete.</span> <br className="hidden md:block" />
            You Save More.
          </h1>

          {/* Description */}
          <p className="text-body-lg text-on-surface-variant max-w-[600px] mt-2 leading-relaxed">
            Upload your prescription and receive competitive offers from trusted pharmacies in your area.
            Secure, transparent, and built for precision logistics.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-stack-sm mt-4 w-full sm:w-auto">
            <Link href="/dashboard/patient/upload" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full h-14 px-8 text-headline-sm flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Prescription
              </Button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full h-14 px-8 text-headline-sm flex items-center justify-center gap-2">
                How It Works
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-stack-lg border-y border-outline-variant/30 bg-surface-container-lowest select-none">
        <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-stack-md md:gap-0">
          <div className="flex items-center gap-3 text-on-surface-variant opacity-80 hover:opacity-100 transition-opacity">
            <HeartPulse className="w-6 h-6 text-primary" />
            <span className="text-label-lg tracking-wide uppercase font-semibold">Verified Pharmacies</span>
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-outline-variant" />
          <div className="flex items-center gap-3 text-on-surface-variant opacity-80 hover:opacity-100 transition-opacity">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="text-label-lg tracking-wide uppercase font-semibold">Secure Platform</span>
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-outline-variant" />
          <div className="flex items-center gap-3 text-on-surface-variant opacity-80 hover:opacity-100 transition-opacity">
            <Award className="w-6 h-6 text-primary" />
            <span className="text-label-lg tracking-wide uppercase font-semibold">Transparent Pricing</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto select-none" id="how-it-works">
        <div className="text-center mb-stack-lg">
          <h2 className="text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
            The Precision Process
          </h2>
          <p className="text-body-md text-on-surface-variant mt-2 max-w-[500px] mx-auto leading-relaxed">
            A streamlined, secure workflow designed to connect you with the best pharmacy options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Card 1 */}
          <div className="bg-surface-container border border-outline-variant rounded-card p-6 flex flex-col gap-4 hover:bg-surface-container-high transition-colors duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
              <Upload className="w-24 h-24" />
            </div>
            <div className="w-12 h-12 rounded-lg bg-surface-bright flex items-center justify-center border border-outline-variant text-primary mb-2 shrink-0">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-headline-sm font-semibold text-on-surface">1. Upload Prescription</h3>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Securely capture and upload your doctor's prescription. Our end-to-end encrypted platform ensures your medical data remains strictly confidential.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container border border-outline-variant rounded-card p-6 flex flex-col gap-4 hover:bg-surface-container-high transition-colors duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
              <Gavel className="w-24 h-24" />
            </div>
            <div className="w-12 h-12 rounded-lg bg-surface-bright flex items-center justify-center border border-outline-variant text-primary mb-2 shrink-0">
              <Gavel className="w-6 h-6" />
            </div>
            <h3 className="text-headline-sm font-semibold text-on-surface">2. Receive Bids</h3>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Verified, local pharmacies review your required medication and submit competitive pricing bids within our secure marketplace environment.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container border border-outline-variant rounded-card p-6 flex flex-col gap-4 hover:bg-surface-container-high transition-colors duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
              <ShieldCheck className="w-24 h-24" />
            </div>
            <div className="w-12 h-12 rounded-lg bg-surface-bright flex items-center justify-center border border-outline-variant text-primary mb-2 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-headline-sm font-semibold text-on-surface">3. Choose Best Offer</h3>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Review the submitted bids based on price, location, and fulfillment time. Select the optimal offer and proceed to secure checkout or pickup.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
