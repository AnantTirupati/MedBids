"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FilePlus, FileText, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadArea } from "@/components/shared/upload-area";
import { useUpload } from "@/hooks/useUpload";

import { useAuth } from "@/hooks/useAuth";

export default function UploadPrescriptionPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [notes, setNotes] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const { loading, uploadPrescription } = useUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const patientId = user?.uid || "";
    const patientName = profile?.full_name || user?.displayName || "Patient";

    try {
      await uploadPrescription(
        patientId,
        patientName,
        notes,
        [
          {
            name: "Uploaded Prescription Item",
            generic_name: null,
            dosage: "As directed",
            form: "Tablet / Syrup",
            quantity: 1,
            frequency: null,
          },
        ],
        file
      );
      router.push("/dashboard/patient");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-stack-lg w-full max-w-[800px] mx-auto py-6 select-none">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-display-md font-bold text-on-surface tracking-tight">
          Upload Doctor&apos;s Prescription
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Upload a clear photograph or PDF scan of your prescription. Our medical team will verify it.
        </p>
      </header>

      <Card className="rounded-card border border-surface-card-border bg-surface-card p-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-container/10 border border-primary/20 flex items-center justify-center text-primary">
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-headline-sm font-semibold text-on-surface">Secure Document Portal</h2>
              <p className="text-body-sm text-on-surface-variant">Encrypted HIPAA-compliant upload</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Upload Area */}
          <UploadArea onFileSelect={(file) => setFile(file)} />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Notes / Instructions */}
            <div className="flex flex-col gap-1.5">
              <label className="text-label-md text-on-surface-variant font-semibold uppercase tracking-wider">
                Special Instructions or Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any preferred drug brands, generic substitution preferences, or notes for the pharmacy..."
                className="w-full min-h-[120px] px-4 py-3 rounded-button bg-[#111827] border border-outline-variant text-on-surface text-body-md placeholder:text-text-muted focus:border-primary-container focus:outline-none transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                className="w-1/3 h-12"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!file || loading}
                className="w-2/3 h-12 flex items-center justify-center gap-2"
              >
                <span>{loading ? "Submitting..." : "Submit to Marketplace"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
