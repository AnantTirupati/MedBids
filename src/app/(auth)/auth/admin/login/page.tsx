"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartPulse, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/providers/AuthProvider";

export default function AdminLoginPage() {
  const router = useRouter();
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
      router.push("/dashboard/admin");
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj?.message || "Failed to sign in. Please verify your email and password.");
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
        <p className="text-body-sm text-on-surface-variant">Sign in to your Admin Account</p>
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
            placeholder="admin@medbids.com"
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

      <p className="text-body-sm text-on-surface-variant mt-8 text-center">
        Go back to{" "}
        <Link href="/auth" className="text-[#FF6B35] font-semibold hover:underline">
          Portal Gateway
        </Link>
      </p>
    </Card>
  );
}
