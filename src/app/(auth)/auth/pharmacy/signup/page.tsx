"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HeartPulse, Mail, Lock, User, Phone, Eye, EyeOff, UserPlus, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/providers/AuthProvider";
import { userRepository, pharmacyRepository, verificationRepository } from "@/repositories";
import { UserRole, Pharmacy, User as AppUser, VerificationRequest, VerificationStatus } from "@/types";

export default function PharmacySignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard/pharmacy";
  const { refresh } = useAuth();

  const [hasOnboardingData, setHasOnboardingData] = React.useState<boolean | null>(null);
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [agree, setAgree] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const data = sessionStorage.getItem("medbids_onboarding_pharmacy");
      const timer = setTimeout(() => {
        setHasOnboardingData(!!data);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const createPharmacyProfile = async (uid: string, userEmail: string) => {
    const exists = await userRepository.profileExists(uid);
    if (exists) return;

    const rawData = sessionStorage.getItem("medbids_onboarding_pharmacy");
    if (!rawData) return;

    const onboarding = JSON.parse(rawData);
    const isoString = new Date().toISOString();

    // 1. User document
    const newUser: AppUser = {
      id: uid,
      email: userEmail.toLowerCase().trim(),
      phone: phone || "",
      role: UserRole.PHARMACY,
      full_name: fullName.trim() || onboarding.pharmacyName,
      avatar_url: null,
      created_at: isoString,
      updated_at: isoString,
      is_active: true,
    };
    await userRepository.createProfile(newUser);

    // 2. Pharmacy document
    const newPharmacy: Pharmacy = {
      id: uid,
      email: userEmail.toLowerCase().trim(),
      phone: phone || "",
      role: UserRole.PHARMACY,
      full_name: fullName.trim() || onboarding.pharmacyName,
      avatar_url: null,
      created_at: isoString,
      updated_at: isoString,
      is_active: true,
      pharmacy_name: onboarding.pharmacyName,
      license_number: onboarding.licenseNumber,
      gst_number: onboarding.gstNumber || null,
      address: onboarding.address,
      city: onboarding.city,
      state: "Telangana",
      pincode: onboarding.pincode,
      license_expiry: "2029-12-31",
      rating: 5.0,
      verification_status: VerificationStatus.PENDING,
      total_bids: 0,
      successful_bids: 0,
      response_time_avg: "10m",
      established_year: new Date().getFullYear(),
    };
    await pharmacyRepository.updatePharmacy(newPharmacy);

    // 3. Verification request document
    const newRequest: VerificationRequest = {
      id: `ver_${Math.random().toString(36).substring(2, 11)}`,
      pharmacy_id: uid,
      pharmacy: newPharmacy,
      submitted_at: isoString,
      reviewed_at: null,
      reviewed_by: null,
      status: VerificationStatus.PENDING,
      documents: {
        license_url: onboarding.licenseFileUrl,
        gst_certificate_url: null,
        address_proof_url: null,
      },
      notes: null,
    };
    await verificationRepository.updateRequest(newRequest);

    // Clean up onboarding session data
    sessionStorage.removeItem("medbids_onboarding_pharmacy");
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      setError("You must agree to the Terms & Privacy Policy.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const user = await authService.signUpWithEmail(email, password);
      
      // Store profiles and verification requests
      await createPharmacyProfile(user.uid, email);

      // Verification email dispatch
      try {
        await authService.sendEmailVerification(user);
      } catch (err) {
        console.warn("[AuthSignup] Verification dispatch warning:", err);
      }

      await refresh();
      router.push(redirectPath);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj?.message || "Registration failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await authService.signInWithGoogle();
      
      // Store profiles and verification requests if onboarding data exists
      await createPharmacyProfile(user.uid, user.email || "");

      await refresh();
      router.push(redirectPath);
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj?.message || "Google Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (hasOnboardingData === null) {
    return (
      <Card className="auth-card w-full max-w-[480px] p-6 md:p-8 flex items-center justify-center bg-[#141A24]/90 border border-outline-variant/20 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </Card>
    );
  }

  if (!hasOnboardingData) {
    return (
      <Card className="auth-card w-full max-w-[480px] p-6 md:p-8 shadow-2xl flex flex-col items-center select-none bg-[#141A24]/90 border border-outline-variant/20 rounded-2xl relative overflow-hidden backdrop-blur-md text-center">
        <div className="h-12 w-12 rounded-full bg-red-950/30 flex items-center justify-center mb-4 border border-red-500/20 text-red-500">
          <FileWarning className="w-6 h-6" />
        </div>
        <h2 className="text-headline-sm font-bold text-on-surface">Registration Sequence Paused</h2>
        <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
          Pharmacy accounts require license and location registration before credentials can be setup.
        </p>
        <Link href="/signup/pharmacy" className="w-full mt-6">
          <Button variant="primary" className="w-full h-12 bg-[#FF6B35] hover:bg-[#FF6B35]/90 border-none text-white font-bold">
            Register Pharmacy Profile
          </Button>
        </Link>
        <Link href="/auth" className="text-body-sm text-[#FF6B35] mt-4 hover:underline">
          Go Back to Role Selection
        </Link>
      </Card>
    );
  }

  return (
    <Card className="auth-card w-full max-w-[480px] p-6 md:p-8 shadow-2xl flex flex-col items-center select-none bg-[#141A24]/90 border border-outline-variant/20 rounded-2xl relative overflow-hidden backdrop-blur-md">
      {/* Brand Header */}
      <div className="w-full flex flex-col items-center mb-6 text-center">
        <div className="h-12 w-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-3 border border-primary/30 text-primary">
          <HeartPulse className="w-6 h-6 text-[#FF6B35]" />
        </div>
        <h1 className="text-headline-md font-bold text-on-surface">Create Your Account</h1>
        <p className="text-body-sm text-on-surface-variant">Setup credentials for Pharmacy Partner</p>
      </div>

      {error && (
        <div className="w-full p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-body-sm mb-4 text-center select-text">
          {error}
        </div>
      )}

      <form onSubmit={handleSignupSubmit} className="w-full flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="fullName">
            Full Name / Store Manager
          </label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={<User className="w-4 h-4 text-on-surface-variant" />}
            required
            className="h-11 border border-outline-variant/30 focus:border-[#FF6B35]"
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="email">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="manager@pharmacy.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4 text-on-surface-variant" />}
            required
            className="h-11 border border-outline-variant/30 focus:border-[#FF6B35]"
          />
        </div>

        {/* Phone Number (Optional) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="phone">
            Phone Number <span className="text-xs text-text-muted">(Optional)</span>
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 99999 99999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon={<Phone className="w-4 h-4 text-on-surface-variant" />}
            className="h-11 border border-outline-variant/30 focus:border-[#FF6B35]"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="password">
            Password
          </label>
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

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-label-md text-on-surface-variant" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="w-4 h-4 text-on-surface-variant" />}
            required
            className="h-11 border border-outline-variant/30 focus:border-[#FF6B35]"
          />
        </div>

        <div className="flex items-center gap-2 mt-1 mb-2">
          <Checkbox 
            id="agree" 
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            label="I agree to the Terms & Privacy Policy" 
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading || !agree}
          className="w-full h-12 flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 border-none text-white font-bold rounded-xl"
        >
          <UserPlus className="w-4 h-4" />
          <span>{loading ? "Creating Account..." : "Create Account"}</span>
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
        Already have an account?{" "}
        <Link href={`/auth/pharmacy/login${redirectPath ? `?redirect=${redirectPath}` : ""}`} className="text-[#FF6B35] font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </Card>
  );
}
