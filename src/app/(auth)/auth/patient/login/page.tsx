"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HeartPulse, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { userRepository } from "@/repositories";
import { useAuth } from "@/providers/AuthProvider";

export default function PatientLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard/patient";
  const { refresh } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError("");
    try {
      await authService.signInWithEmail(email, password);
      await refresh();
      router.push(redirectPath);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj?.message || "Failed to sign in. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await authService.signInWithGoogle();
      await refresh();
      router.push(redirectPath);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj?.message || "Google Authentication failed. Please try again.");
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
        <h1 className="text-headline-md font-bold text-on-surface">Welcome Back</h1>
        <p className="text-body-sm text-on-surface-variant">Sign in to your Patient Account</p>
      </div>

      {error && (
        <div className="w-full p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-body-sm mb-4 text-center select-text">
          {error}
        </div>
      )}

      <form onSubmit={handleLoginSubmit} className="w-full flex flex-col gap-4">
        {/* Email Address */}
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

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <label className="text-label-md text-on-surface-variant" htmlFor="password">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-label-sm text-[#FF6B35] hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative w-full">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-on-surface-variant" />}
              required
              className="h-11 border border-outline-variant/30 focus:border-[#FF6B35] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-1 mb-2">
          <Checkbox label="Remember Me" />
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full h-12 flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 border-none text-white font-bold rounded-xl"
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? "Signing In..." : "Sign In"}</span>
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex py-5 items-center w-full">
        <div className="flex-grow border-t border-[#273244]"></div>
        <span className="flex-shrink mx-4 text-text-muted text-xs uppercase tracking-wider">OR</span>
        <div className="flex-grow border-t border-[#273244]"></div>
      </div>

      {/* Google Button */}
      <Button
        type="button"
        variant="secondary"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full h-12 flex items-center justify-center gap-3 border border-outline hover:bg-surface-container-highest rounded-xl text-on-surface font-semibold"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="#EA4335"
            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.82.95 15.108 0 12 0 7.336 0 3.298 2.677 1.298 6.59l3.968 3.175z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.275c0-.825-.075-1.62-.212-2.385H12v4.545h6.448a5.51 5.51 0 0 1-2.39 3.615l3.728 2.89c2.18-2.01 3.712-4.975 3.712-8.665z"
          />
          <path
            fill="#FBBC05"
            d="M5.266 14.235A7.098 7.098 0 0 1 4.909 12c0-.795.137-1.56.357-2.265L1.298 6.56a11.96 11.96 0 0 0 0 10.88l3.968-3.205z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.955-1.075 7.94-2.915l-3.727-2.89c-1.035.69-2.355 1.105-4.213 1.105-3.238 0-5.98-2.18-6.962-5.11L1.07 17.38c1.996 3.933 6.034 6.62 10.93 6.62z"
          />
        </svg>
        <span>Continue with Google</span>
      </Button>

      {/* Auth Footer Links */}
      <p className="text-body-sm text-on-surface-variant mt-6 text-center">
        Don&apos;t have an account?{" "}
        <Link href={`/auth/patient/signup${redirectPath ? `?redirect=${redirectPath}` : ""}`} className="text-[#FF6B35] font-semibold hover:underline">
          Create Account
        </Link>
      </p>
    </Card>
  );
}
