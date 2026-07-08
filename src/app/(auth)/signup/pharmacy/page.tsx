"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartPulse, Award, FileText, ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { UploadArea } from "@/components/shared/upload-area";

export default function PharmacyOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    pharmacyName: "",
    licenseNumber: "",
    gstNumber: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [licenseFile, setLicenseFile] = React.useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.pharmacyName || !formData.licenseNumber) return;
      setStep(2);
    } else if (step === 2) {
      if (!formData.address || !formData.city || !formData.pincode) return;
      setStep(3);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseFile) return;

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "medbids_onboarding_pharmacy",
        JSON.stringify({
          ...formData,
          licenseFileUrl: "mock_license_url",
        })
      );
    }

    router.push("/auth/pharmacy/signup");
  };

  return (
    <Card className="auth-card w-full max-w-lg p-6 md:p-8 relative z-10 shadow-2xl flex flex-col bg-[#141A24]/90 border border-outline-variant/20 rounded-2xl relative overflow-hidden backdrop-blur-md select-none">
      {/* Brand Header */}
      <div className="w-full flex flex-col items-center mb-6 text-center">
        <div className="h-12 w-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-3 border border-primary/30 text-primary">
          <Award className="w-6 h-6 text-secondary" />
        </div>
        <h1 className="text-headline-md font-bold text-on-surface">Pharmacy Partner</h1>
        <p className="text-body-sm text-on-surface-variant">Step {step} of 3: Onboarding Credentials</p>
      </div>

      {step === 1 && (
        /* Step 1: Legal Credentials */
        <form onSubmit={handleNextStep} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-label-md text-on-surface-variant font-medium">Pharmacy Retail Name</label>
            <Input
              placeholder="e.g. Apollo Pharmacy Store"
              value={formData.pharmacyName}
              onChange={(e) => handleInputChange("pharmacyName", e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label-md text-on-surface-variant font-medium">Drug Retail License Number</label>
            <Input
              placeholder="e.g. DL-HYD-2023-9988"
              value={formData.licenseNumber}
              onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label-md text-on-surface-variant font-medium">GSTIN Registration (Optional)</label>
            <Input
              placeholder="e.g. 36AAAAA1111A1Z1"
              value={formData.gstNumber}
              onChange={(e) => handleInputChange("gstNumber", e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full h-12 mt-2 flex items-center justify-center gap-2">
            <span>Next: Location Details</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      )}

      {step === 2 && (
        /* Step 2: Location and Coordinates */
        <form onSubmit={handleNextStep} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-label-md text-on-surface-variant font-medium">Shop Address</label>
            <Input
              placeholder="e.g. Shop No 4, Road No 36, Jubilee Hills"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-label-md text-on-surface-variant font-medium">City</label>
              <Input
                placeholder="e.g. Hyderabad"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-label-md text-on-surface-variant font-medium">Pincode</label>
              <Input
                placeholder="e.g. 500033"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <Button type="button" variant="secondary" onClick={() => setStep(1)} className="w-1/3">
              Back
            </Button>
            <Button type="submit" variant="primary" className="w-2/3 flex items-center justify-center gap-2">
              <span>Next: Documents</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        /* Step 3: Document Uploads */
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-label-md text-on-surface-variant font-medium mb-1">
              Upload Drug Retail License Copy (PDF or Image)
            </label>
            <UploadArea onFileSelect={(file) => setLicenseFile(file)} />
          </div>

          <div className="flex gap-3 mt-2">
            <Button type="button" variant="secondary" onClick={() => setStep(2)} className="w-1/3">
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!licenseFile}
              className="w-2/3 flex items-center justify-center gap-2"
            >
              <span>Submit Registration</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      <p className="text-body-sm text-on-surface-variant mt-6 text-center">
        Go back to{" "}
        <Link href="/auth" className="text-primary font-semibold hover:underline">
          Role Selection
        </Link>
      </p>
    </Card>
  );
}
