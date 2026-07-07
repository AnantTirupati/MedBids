"use client";

import * as React from "react";
import { User as FirebaseUser } from "firebase/auth";
import { authService } from "@/services/auth.service";
import { userRepository } from "@/repositories";
import { User, UserRole, Patient, Pharmacy, VerificationStatus } from "@/types";

interface AuthContextType {
  user: FirebaseUser | null;
  profile: User | null;
  role: UserRole | null;
  loading: boolean;
  authenticated: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [profile, setProfile] = React.useState<User | null>(null);
  const [role, setRole] = React.useState<UserRole | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Sync cookies for Next.js Middleware route guards
  const setAuthCookies = (uid: string, userRole: UserRole) => {
    document.cookie = `medbids-uid=${uid}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `medbids-role=${userRole}; path=/; max-age=86400; SameSite=Lax`;
  };

  const clearAuthCookies = () => {
    document.cookie = "medbids-uid=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "medbids-role=; path=/; max-age=0; SameSite=Lax";
  };

  const syncProfile = React.useCallback(async (currentUser: FirebaseUser) => {
    try {
      let userProfile = await userRepository.getProfile(currentUser.uid);

      if (!userProfile) {
        // User profile doesn't exist. Check if we have pharmacy onboarding credentials in sessionStorage
        const onboardingStr = typeof window !== "undefined" ? sessionStorage.getItem("medbids_onboarding_pharmacy") : null;
        
        if (onboardingStr) {
          const onboardingData = JSON.parse(onboardingStr);
          const newPharmacy: Pharmacy = {
            id: currentUser.uid,
            email: currentUser.email || onboardingData.email || "",
            phone: currentUser.phoneNumber || "",
            role: UserRole.PHARMACY,
            full_name: onboardingData.pharmacyName,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            pharmacy_name: onboardingData.pharmacyName,
            license_number: onboardingData.licenseNumber,
            license_expiry: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
            gst_number: onboardingData.gstNumber || null,
            address: onboardingData.address,
            city: onboardingData.city,
            state: onboardingData.state || "Active",
            pincode: onboardingData.pincode,
            verification_status: VerificationStatus.PENDING,
            rating: 5.0,
            total_bids: 0,
            successful_bids: 0,
            response_time_avg: "15 mins",
            established_year: new Date().getFullYear(),
          };
          userProfile = await userRepository.createProfile(newPharmacy);
          sessionStorage.removeItem("medbids_onboarding_pharmacy");
        } else {
          // Standard Patient Profile Creation
          const newPatient: Patient = {
            id: currentUser.uid,
            email: currentUser.email || "",
            phone: currentUser.phoneNumber || "",
            role: UserRole.PATIENT,
            full_name: currentUser.displayName || "Patient Partner",
            avatar_url: currentUser.photoURL || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true,
            date_of_birth: null,
            address: null,
            city: null,
            state: null,
            pincode: null,
            membership_tier: "free",
            total_savings: 0,
          };
          userProfile = await userRepository.createProfile(newPatient);
        }
      }

      setProfile(userProfile);
      setRole(userProfile.role);
      setAuthCookies(currentUser.uid, userProfile.role);
    } catch (err) {
      console.error("[AuthProvider] Profile synchronization failed:", err);
      setProfile(null);
      setRole(null);
      clearAuthCookies();
    }
  }, []);

  const refresh = React.useCallback(async () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      await syncProfile(currentUser);
    }
  }, [syncProfile]);

  React.useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncProfile(currentUser);
      } else {
        setProfile(null);
        setRole(null);
        clearAuthCookies();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncProfile]);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
      setRole(null);
      clearAuthCookies();
    } catch (err) {
      console.error("[AuthProvider] SignOut error:", err);
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    profile,
    role,
    loading,
    authenticated: !!user,
    signOut: handleSignOut,
    refresh,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          <p className="text-body-sm text-on-surface-variant animate-pulse">Initializing Security Session...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
