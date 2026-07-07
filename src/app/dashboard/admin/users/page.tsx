"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Users, Search, Ban, ShieldCheck, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

import { Patient, Pharmacy } from "@/types";

export default function AdminUserManagementPage() {
  const [search, setSearch] = React.useState("");
  const { users, pharmacies, loading } = useAdminDashboard();
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [pharmaciesList, setPharmaciesList] = React.useState<Pharmacy[]>([]);

  React.useEffect(() => {
    if (users.length > 0) {
      Promise.resolve().then(() => {
        setPatients(users);
      });
    }
  }, [users]);

  React.useEffect(() => {
    if (pharmacies.length > 0) {
      Promise.resolve().then(() => {
        setPharmaciesList(pharmacies);
      });
    }
  }, [pharmacies]);

  const handleToggleBlockPatient = (id: string) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p))
    );
  };

  const handleToggleBlockPharmacy = (id: string) => {
    setPharmaciesList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p))
    );
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
          <Users className="w-6 h-6 text-primary" />
          User & Provider Directories
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Inspect patient account directories, adjust verification statuses, and toggle platform access blocks.
        </p>
      </header>

      {/* Patients list */}
      <div className="glass-card rounded-card p-6 md:p-8 flex flex-col mt-4">
        <h3 className="text-headline-sm font-semibold text-on-surface mb-6">Patient Accounts Directory</h3>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-0">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-0">Auditing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((pat) => (
                <TableRow key={pat.id}>
                  <TableCell className="pl-0 py-4 font-semibold text-on-surface">
                    {pat.full_name}
                  </TableCell>
                  <TableCell className="py-4 text-on-surface-variant">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {pat.email}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-on-surface-variant">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {pat.phone}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <StatusBadge status={pat.is_active ? "verified" : "expired"} />
                  </TableCell>
                  <TableCell className="py-4 text-right pr-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleToggleBlockPatient(pat.id)}
                      className={`h-9 px-3 text-label-md flex items-center justify-center gap-1 ml-auto ${
                        pat.is_active
                          ? "border-error-container/20 hover:bg-error-container/10 hover:text-error"
                          : "border-primary-container/20 hover:bg-primary-container/10 hover:text-primary"
                      }`}
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>{pat.is_active ? "Block User" : "Activate"}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pharmacies list */}
      <div className="glass-card rounded-card p-6 md:p-8 flex flex-col mt-4">
        <h3 className="text-headline-sm font-semibold text-on-surface mb-6">Verified Pharmacies Directory</h3>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-0">Pharmacy Shop</TableHead>
                <TableHead>License Number</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Verification Status</TableHead>
                <TableHead className="text-right pr-0">Auditing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pharmaciesList.map((pharm) => (
                <TableRow key={pharm.id}>
                  <TableCell className="pl-0 py-4 font-semibold text-on-surface">
                    {pharm.pharmacy_name}
                  </TableCell>
                  <TableCell className="py-4 text-on-surface-variant">{pharm.license_number}</TableCell>
                  <TableCell className="py-4 text-on-surface-variant">
                    {pharm.city}, {pharm.pincode}
                  </TableCell>
                  <TableCell className="py-4">
                    <StatusBadge status={pharm.verification_status} />
                  </TableCell>
                  <TableCell className="py-4 text-right pr-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleToggleBlockPharmacy(pharm.id)}
                      className={`h-9 px-3 text-label-md flex items-center justify-center gap-1 ml-auto ${
                        pharm.is_active
                          ? "border-error-container/20 hover:bg-error-container/10 hover:text-error"
                          : "border-primary-container/20 hover:bg-primary-container/10 hover:text-primary"
                      }`}
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>{pharm.is_active ? "Block Store" : "Activate"}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
