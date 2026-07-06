"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, X, FileSpreadsheet, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { adminService } from "@/services/admin.service";
import { prescriptionService } from "@/services/prescription.service";
import { Prescription } from "@/types";

export default function AdminPrescriptionModerationPage() {
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedRx, setSelectedRx] = React.useState<Prescription | null>(null);

  const loadPrescriptions = async () => {
    try {
      const data = await prescriptionService.getPrescriptions();
      setPrescriptions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPrescriptions();
  }, []);

  const handleModerate = async (rxId: string, approve: boolean) => {
    try {
      await adminService.moderatePrescription(rxId, approve, "admin_user_1");
      setSelectedRx(null);
      await loadPrescriptions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full py-4 select-none">
      {/* Header breadcrumb */}
      <div>
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary transition-colors font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Admin Home
        </Link>
      </div>

      <header className="flex flex-col gap-1.5">
        <h1 className="text-display-md font-bold text-on-surface tracking-tight flex items-center gap-3">
          <FileSpreadsheet className="w-6 h-6 text-primary" />
          Prescription Moderation Portal
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Verify physician details and medications. Approved items automatically start live auctions.
        </p>
      </header>

      {/* Table list */}
      <div className="glass-card rounded-card p-6 md:p-8 flex flex-col mt-4">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-4 py-6 animate-pulse">
              <div className="h-10 bg-[#273647]/35 rounded" />
              <div className="h-10 bg-[#273647]/35 rounded" />
            </div>
          ) : prescriptions.length === 0 ? (
            <p className="text-body-sm text-on-surface-variant text-center py-6">
              No prescriptions awaiting verification.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-0">Rx ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Medications Required</TableHead>
                  <TableHead>Doctor / Hospital</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-0">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((rx) => {
                  const meds = rx.medications
                    .map((m) => `${m.name} (${m.dosage})`)
                    .join(", ");

                  return (
                    <TableRow key={rx.id}>
                      <TableCell className="pl-0 py-4 font-semibold text-on-surface">
                        Rx #{rx.id.substring(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell className="py-4 text-on-surface-variant">{rx.patient_name}</TableCell>
                      <TableCell className="py-4 text-on-surface-variant max-w-xs truncate">
                        {meds}
                      </TableCell>
                      <TableCell className="py-4 text-on-surface-variant">
                        Dr. {rx.doctor_name || "Unknown"} <br />
                        <span className="text-[10px] text-text-muted">{rx.hospital_name || "Self"}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <StatusBadge status={rx.status === "auction_live" ? "Live" : rx.status} />
                      </TableCell>
                      <TableCell className="py-4 text-right pr-0">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedRx(rx)}
                          className="h-10 px-4 flex items-center justify-center gap-1.5 ml-auto bg-surface-container border-outline-variant/40"
                        >
                          <Eye className="w-4 h-4" />
                          Verify Rx
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Verify / Details Modal */}
      {selectedRx && (
        <Dialog open={!!selectedRx} onOpenChange={(open) => !open && setSelectedRx(null)}>
          <DialogContent className="sm:max-w-[540px]">
            <DialogHeader>
              <DialogTitle>Audit Prescription Verification</DialogTitle>
              <DialogDescription>
                Confirm patient prescription matches doctor guidelines.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2 text-body-sm text-on-surface-variant">
              <div className="grid grid-cols-2 gap-4 border-b border-[#273244]/40 pb-4">
                <div>
                  <p className="font-semibold text-on-surface">Patient Name</p>
                  <p className="mt-0.5">{selectedRx.patient_name}</p>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">Doctor / Hospital</p>
                  <p className="mt-0.5">
                    Dr. {selectedRx.doctor_name || "Unknown"} ({selectedRx.hospital_name || "Self"})
                  </p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-on-surface mb-2">Prescribed Items</p>
                <div className="rounded-lg border border-[#273244] p-3 flex flex-col gap-2 bg-[#111827]">
                  {selectedRx.medications.map((med) => (
                    <div key={med.id} className="flex justify-between border-b border-[#273244]/30 pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-bold text-on-surface">{med.name}</p>
                        <p className="text-[12px] text-text-muted">{med.generic_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-on-surface">{med.dosage}</p>
                        <p className="text-[12px] text-text-muted">Qty: {med.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRx.notes && (
                <div>
                  <p className="font-semibold text-on-surface mb-1">Patient notes</p>
                  <p className="italic leading-relaxed">{selectedRx.notes}</p>
                </div>
              )}
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="secondary" onClick={() => setSelectedRx(null)}>
                Cancel
              </Button>
              {selectedRx.status === "pending_verification" && (
                <div className="flex gap-2">
                  <Button type="button" variant="danger" onClick={() => handleModerate(selectedRx.id, false)}>
                    Reject
                  </Button>
                  <Button type="button" variant="primary" onClick={() => handleModerate(selectedRx.id, true)}>
                    Approve & Live
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
