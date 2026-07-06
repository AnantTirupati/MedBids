"use client";

import * as React from "react";
import Link from "next/link";
import { HeartPulse, User, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = React.useState<"patient" | "pharmacy" | null>(null);

  return (
    <Card className="auth-card w-full max-w-md p-6 md:p-8 relative z-10 shadow-2xl flex flex-col items-center select-none bg-[#1A2332]">
      {/* Brand Header */}
      <div className="w-full flex flex-col items-center mb-6 text-center">
        <div className="h-12 w-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-3 border border-primary/30 text-primary">
          <HeartPulse className="w-6 h-6" />
        </div>
        <h1 className="text-headline-md font-bold text-on-surface">Join MedBids</h1>
        <p className="text-body-sm text-on-surface-variant">Select your account type to begin</p>
      </div>

      <div className="w-full flex flex-col gap-4 mb-6">
        {/* Patient Selection Card */}
        <div
          onClick={() => setSelectedRole("patient")}
          className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all ${
            selectedRole === "patient"
              ? "border-primary bg-primary-container/10"
              : "border-outline-variant hover:border-outline bg-transparent"
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary border border-outline-variant/30">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-grow">
            <h3 className="text-body-md font-bold text-on-surface">Patient Account</h3>
            <p className="text-body-sm text-on-surface-variant mt-0.5">
              Upload prescriptions and receive competitive savings.
            </p>
          </div>
        </div>

        {/* Pharmacy Selection Card */}
        <div
          onClick={() => setSelectedRole("pharmacy")}
          className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all ${
            selectedRole === "pharmacy"
              ? "border-primary bg-primary-container/10"
              : "border-outline-variant hover:border-outline bg-transparent"
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary border border-outline-variant/30">
            <Award className="w-5 h-5" />
          </div>
          <div className="flex-grow">
            <h3 className="text-body-md font-bold text-on-surface">Pharmacy Partner</h3>
            <p className="text-body-sm text-on-surface-variant mt-0.5">
              Bid on prescriptions and gain local retail volume.
            </p>
          </div>
        </div>
      </div>

      {/* Redirect Button */}
      {selectedRole === "patient" ? (
        <Link href="/login" className="w-full">
          <Button variant="primary" className="w-full h-12 flex items-center justify-center gap-2">
            <span>Continue Signup</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      ) : selectedRole === "pharmacy" ? (
        <Link href="/signup/pharmacy" className="w-full">
          <Button variant="primary" className="w-full h-12 flex items-center justify-center gap-2">
            <span>Onboard Pharmacy</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="primary" disabled className="w-full h-12">
          Select Account Type
        </Button>
      )}

      {/* Footer login trigger */}
      <p className="text-body-sm text-on-surface-variant mt-6 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </Card>
  );
}
