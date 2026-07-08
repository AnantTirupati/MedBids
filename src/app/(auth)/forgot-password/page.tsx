"use client";

import * as React from "react";
import Link from "next/link";
import { HeartPulse, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { authService } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    try {
      await authService.sendPasswordReset(email);
      setSuccess(true);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj?.message || "Failed to dispatch password reset link. Verify your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="auth-card w-full max-w-[480px] p-6 md:p-8 shadow-2xl flex flex-col items-center select-none bg-[#141A24]/90 border border-outline-variant/20 rounded-2xl relative overflow-hidden backdrop-blur-md">
      {/* Brand Header */}
      <div className="w-full flex flex-col items-center mb-6 text-center">
        <div className="h-12 w-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-3 border border-primary/30 text-primary">
          <HeartPulse className="w-6 h-6 text-[#FF6B35]" />
        </div>
        <h1 className="text-headline-md font-bold text-on-surface">Forgot Password</h1>
        <p className="text-body-sm text-on-surface-variant">Reset your security credentials</p>
      </div>

      {error && (
        <div className="w-full p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-body-sm mb-4 text-center select-text">
          {error}
        </div>
      )}

      {success ? (
        <div className="w-full flex flex-col items-center gap-4 text-center py-4">
          <div className="w-12 h-12 rounded-full bg-green-950/30 flex items-center justify-center border border-green-500/30 text-green-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-body-md text-on-surface">
            Password reset email sent successfully.
          </p>
          <p className="text-body-sm text-on-surface-variant max-w-[320px]">
            Please check your inbox at <span className="font-semibold text-on-surface">{email}</span> and follow the instructions.
          </p>
          <Link href="/auth" className="w-full mt-4">
            <Button variant="primary" className="w-full h-11 bg-[#FF6B35] hover:bg-[#FF6B35]/90 border-none text-white">
              Back to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleResetSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-label-md text-on-surface-variant" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4 text-on-surface-variant" />}
              required
              className="h-11 border border-outline-variant/30 focus:border-[#FF6B35]"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 border-none text-white font-bold rounded-xl"
          >
            <span>{loading ? "Sending link..." : "Send Reset Link"}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      )}

      {!success && (
        <p className="text-body-sm text-on-surface-variant mt-6 text-center">
          Go back to{" "}
          <Link href="/auth" className="text-[#FF6B35] font-semibold hover:underline">
            Portal Gateway
          </Link>
        </p>
      )}
    </Card>
  );
}
