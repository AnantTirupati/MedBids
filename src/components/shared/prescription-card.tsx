import * as React from "react";
import { Receipt, Calendar, User, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Prescription } from "@/types";
import { cn } from "@/lib/utils";

interface PrescriptionCardProps {
  prescription: Prescription;
  className?: string;
}

export function PrescriptionCard({ prescription, className }: PrescriptionCardProps) {
  const formattedDate = new Date(prescription.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className={cn("rounded-card border border-surface-card-border bg-surface-card", className)}>
      <CardHeader className="border-b border-[#273244] pb-4 flex flex-row items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-container/10 border border-primary/20 flex items-center justify-center text-primary">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-headline-sm font-semibold text-on-surface">
              Rx #{prescription.id.substring(0, 8).toUpperCase()}
            </h3>
            <div className="flex items-center gap-4 text-body-sm text-on-surface-variant mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              {prescription.doctor_name && (
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Dr. {prescription.doctor_name}
                </span>
              )}
            </div>
          </div>
        </div>
        <StatusBadge status={prescription.status} />
      </CardHeader>

      <CardContent className="pt-6 flex flex-col gap-6">
        <div>
          <h4 className="text-label-lg uppercase tracking-wider text-on-surface-variant mb-3 select-none">
            Prescribed Medications
          </h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-0">Medication Name</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Form</TableHead>
                <TableHead className="text-right pr-0">Qty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescription.medications.map((med) => (
                <TableRow key={med.id} className="hover:bg-transparent border-[#273244]/50">
                  <TableCell className="pl-0 py-3">
                    <p className="font-semibold text-on-surface">{med.name}</p>
                    {med.generic_name && (
                      <p className="text-body-sm text-on-surface-variant">{med.generic_name}</p>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-on-surface-variant">{med.dosage}</TableCell>
                  <TableCell className="py-3 text-on-surface-variant">{med.form}</TableCell>
                  <TableCell className="py-3 text-right text-on-surface font-semibold pr-0">{med.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {prescription.notes && (
          <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/30">
            <h5 className="text-label-md font-semibold text-primary uppercase tracking-wider mb-1 select-none">
              Patient Instructions / Notes
            </h5>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              {prescription.notes}
            </p>
          </div>
        )}

        {prescription.hospital_name && (
          <div className="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
            <span className="font-semibold text-on-surface">Hospital:</span>
            <span>{prescription.hospital_name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PrescriptionCard;
