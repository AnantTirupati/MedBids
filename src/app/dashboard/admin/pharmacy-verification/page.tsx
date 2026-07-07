"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, X, ShieldAlert, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { adminService } from "@/services/admin.service";
import { VerificationRequest } from "@/types";

export default function PharmacyVerificationPage() {
  const [requests, setRequests] = React.useState<VerificationRequest[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadRequests = async () => {
    try {
      const data = await adminService.getVerificationQueue();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (!ignore) {
        await loadRequests();
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, []);

  const handleAction = async (requestId: string, approve: boolean) => {
    try {
      if (approve) {
        await adminService.approvePharmacy(requestId, "admin_user_1");
      } else {
        await adminService.rejectPharmacy(requestId, "admin_user_1", "Documents incomplete");
      }
      await loadRequests();
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
          <ShieldAlert className="w-6 h-6 text-primary" />
          Pharmacy License Verification
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Review legal drug licenses and GST documents. Approved pharmacies gain bidding access.
        </p>
      </header>

      {/* Verification table */}
      <div className="glass-card rounded-card p-6 md:p-8 flex flex-col mt-4">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-4 py-6 animate-pulse">
              <div className="h-10 bg-[#273647]/35 rounded" />
              <div className="h-10 bg-[#273647]/35 rounded" />
            </div>
          ) : requests.length === 0 ? (
            <p className="text-body-sm text-on-surface-variant text-center py-12">
              All pharmacy onboarding requests have been verified. Queue empty.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-0">Pharmacy Name</TableHead>
                  <TableHead>License Details</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>License File</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead className="text-right pr-0">Audit Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="pl-0 py-4 font-semibold text-on-surface">
                      {req.pharmacy.pharmacy_name}
                    </TableCell>
                    <TableCell className="py-4 text-on-surface-variant">
                      <p className="font-semibold text-on-surface">{req.pharmacy.license_number}</p>
                      <p className="text-[11px] text-text-muted">Exp: {req.pharmacy.license_expiry}</p>
                    </TableCell>
                    <TableCell className="py-4 text-on-surface-variant">
                      {req.pharmacy.city}, {req.pharmacy.pincode}
                    </TableCell>
                    <TableCell className="py-4 text-primary">
                      <a href={req.documents.license_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                        <FileText className="w-4 h-4" />
                        <span>License copy</span>
                      </a>
                    </TableCell>
                    <TableCell className="py-4">
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="py-4 text-right pr-0">
                      {req.status === "pending" ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAction(req.id, true)}
                            className="h-9 px-3 text-label-md flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleAction(req.id, false)}
                            className="h-9 px-3 text-label-md flex items-center justify-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-body-sm text-text-muted">Audited</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
