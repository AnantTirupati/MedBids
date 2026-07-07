"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HeartPulse, Phone, Lock, ArrowRight, HelpCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { userRepository } from "@/repositories";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const isPhoneValid = phone.replace(/\D/g, "").length >= 10;
  const isOtpValid = otp.replace(/\D/g, "").length === 6;

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid) return;

    setLoading(true);
    setError("");
    try {
      await authService.sendOtp(phone, "recaptcha-container");
      setOtpSent(true);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj?.message || "Failed to send verification code. Please check your number.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpValid) return;

    setLoading(true);
    setError("");
    try {
      const user = await authService.verifyOtp(otp);
      const profile = await userRepository.getProfile(user.uid);
      const role = profile?.role || "patient";
      router.push(`/dashboard/${role}`);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj?.message || "Verification failed. Please check the OTP code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="auth-card w-full max-w-md p-6 md:p-8 relative z-10 shadow-2xl flex flex-col items-center select-none bg-[#1A2332]">
      {/* Brand Header */}
      <div className="w-full flex flex-col items-center mb-6 text-center">
        <div className="h-12 w-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-3 border border-primary/30 text-primary">
          <HeartPulse className="w-6 h-6" />
        </div>
        <h1 className="text-headline-md font-bold text-on-surface">MedBids</h1>
        <p className="text-body-sm text-on-surface-variant">Secure Marketplace Access</p>
      </div>

      <div id="recaptcha-container" className="hidden"></div>

      {error && (
        <div className="w-full p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-body-sm mb-4 text-center select-text">
          {error}
        </div>
      )}

      {!otpSent ? (
        /* Phone Request Form */
        <form onSubmit={handlePhoneSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-label-md text-on-surface-variant" htmlFor="phone">
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<Phone className="w-4 h-4 text-on-surface-variant" />}
              required
            />
          </div>

          <div className="flex items-center justify-between mt-1 mb-2">
            <Checkbox label="Remember Device" />
            <a href="#" className="text-label-md text-text-muted hover:text-primary transition-colors">
              Forgot Number?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={!isPhoneValid || loading}
            className="w-full h-12 flex items-center justify-center gap-2"
          >
            <span>{loading ? "Sending..." : "Continue"}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      ) : (
        /* OTP Verification Form */
        <form onSubmit={handleLoginSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-baseline">
              <label className="text-label-md text-on-surface-variant" htmlFor="otp">
                One-Time Password
              </label>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-[10px] uppercase tracking-wider text-text-muted hover:text-primary transition-colors"
              >
                Change Phone
              </button>
            </div>
            <Input
              id="otp"
              type="text"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              icon={<Lock className="w-4 h-4 text-on-surface-variant" />}
              className="text-center font-bold tracking-[0.2em] text-headline-md h-12"
              required
              autoFocus
            />
          </div>

          <div className="text-body-sm text-on-surface-variant text-center my-2">
            We sent a verification code to <span className="text-on-surface font-semibold">{phone}</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={!isOtpValid || loading}
            className="w-full h-12 flex items-center justify-center gap-2"
          >
            <span>{loading ? "Verifying..." : "Verify & Log In"}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      )}

      {/* Auth Footer Links */}
      <div className="w-full mt-6 pt-4 border-t border-[#273244] flex items-center justify-center gap-4 text-label-md font-semibold text-text-muted select-none">
        <a href="/contact" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" />
          Support
        </a>
        <span className="text-[#273244]">•</span>
        <a href="#" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <FileText className="w-4 h-4" />
          Terms
        </a>
      </div>
    </Card>
  );
}
