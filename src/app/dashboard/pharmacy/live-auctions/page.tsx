"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Gavel, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { StatusBadge } from "@/components/shared/status-badge";
import { auctionService } from "@/services/auction.service";
import { pharmacyService } from "@/services/pharmacy.service";
import { Auction } from "@/types";
import { useAuth } from "@/hooks/useAuth";

export default function PharmacyLiveAuctionsPage() {
  const { user } = useAuth();
  const [auctions, setAuctions] = React.useState<Auction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedAuction, setSelectedAuction] = React.useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = React.useState("");
  const [deliveryTime, setDeliveryTime] = React.useState("Within 2 hours");
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const loadAuctions = async () => {
    try {
      const data = await auctionService.getAuctions();
      setAuctions(data.filter((a) => a.status === "live"));
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
        await loadAuctions();
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenBidModal = (auction: Auction) => {
    setSelectedAuction(auction);
    // Suggest starting bid below current lowest if exists
    if (auction.lowest_bid) {
      setBidAmount((auction.lowest_bid - 50).toString());
    } else {
      setBidAmount("500");
    }
    setNotes("");
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuction || !user?.uid) return;

    setSubmitting(true);
    try {
      await pharmacyService.placeBid(
        selectedAuction.id,
        user.uid,
        parseFloat(bidAmount),
        deliveryTime,
        notes
      );
      setSelectedAuction(null);
      await loadAuctions(); // Reload
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full py-4 select-none">
      {/* Header breadcrumb */}
      <div>
        <Link
          href="/dashboard/pharmacy"
          className="inline-flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-primary transition-colors font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Terminal Console
        </Link>
      </div>

      <header className="flex flex-col gap-1.5">
        <h1 className="text-display-md font-bold text-on-surface tracking-tight flex items-center gap-3">
          <Gavel className="w-6 h-6 text-primary" />
          Active Bidding Marketplace
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Submit competitive quotes for local patient orders. Low pricing increases wins volume.
        </p>
      </header>

      {/* Grid List */}
      {loading ? (
        <div className="space-y-4 py-6 animate-pulse">
          <div className="h-20 bg-[#273647]/35 rounded" />
          <div className="h-20 bg-[#273647]/35 rounded" />
        </div>
      ) : auctions.length === 0 ? (
        <p className="text-body-sm text-on-surface-variant text-center py-12">
          No live prescriptions available for bidding at this time.
        </p>
      ) : (
        <div className="rounded-card border border-surface-card-border bg-surface-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Prescription ID</TableHead>
                <TableHead>Medications Required</TableHead>
                <TableHead>Current Lowest Bid</TableHead>
                <TableHead>Time Remaining</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auctions.map((auc) => {
                const meds = auc.prescription.medications
                  .map((m) => `${m.name} (Qty: ${m.quantity})`)
                  .join(", ");

                return (
                  <TableRow key={auc.id}>
                    <TableCell className="pl-6 py-4 font-semibold text-on-surface">
                      Rx #{auc.prescription_id.substring(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="py-4 text-on-surface-variant max-w-sm truncate">
                      {meds}
                    </TableCell>
                    <TableCell className="py-4 font-bold text-primary">
                      {auc.lowest_bid ? `₹${auc.lowest_bid}` : "No Bids"}
                    </TableCell>
                    <TableCell className="py-4">
                      <CountdownTimer endTime={auc.end_time} />
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenBidModal(auc)}
                        className="h-10 px-4 flex items-center justify-center gap-1.5 ml-auto"
                      >
                        Place Bid
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Place Bid Modal */}
      {selectedAuction && (
        <Dialog open={!!selectedAuction} onOpenChange={(open) => !open && setSelectedAuction(null)}>
          <DialogContent className="sm:max-w-[840px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Place Competitive Bid</DialogTitle>
              <DialogDescription>
                Bidding on prescription Rx #{selectedAuction.prescription_id.substring(0, 8).toUpperCase()} for {selectedAuction.prescription.patient_name}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-2">
              {/* Left Column: Form */}
              <form onSubmit={handlePlaceBid} className="md:col-span-7 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface-variant font-medium">Bidding Price (₹)</label>
                  <Input
                    type="number"
                    placeholder="Enter price in ₹"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                  />
                  {selectedAuction.lowest_bid && (
                    <span className="text-[11px] text-text-muted mt-0.5">
                      Current lowest: <strong className="text-primary">₹{selectedAuction.lowest_bid}</strong>. Bid lower to increase win probability.
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface-variant font-medium">Fulfillment / Delivery Option</label>
                  <Input
                    placeholder="e.g. Within 2 hours, Self Pickup, Next Morning"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface-variant font-medium">Special Notes for Patient</label>
                  <textarea
                    placeholder="e.g. Temperature control delivery bag included free of charge."
                    className="w-full min-h-[100px] px-4 py-3 rounded-button bg-[#111827] border border-outline-variant text-on-surface text-body-md placeholder:text-text-muted focus:border-primary-container focus:outline-none transition-colors"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <DialogFooter className="mt-4 flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={() => setSelectedAuction(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? "Submitting Bid..." : "Submit Bidding Offer"}
                  </Button>
                </DialogFooter>
              </form>

              {/* Right Column: Prescription details & Document Preview */}
              <div className="md:col-span-5 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-[#273244]/40 pt-4 md:pt-0 md:pl-6 text-body-sm text-on-surface-variant">
                <div>
                  <h3 className="font-semibold text-on-surface text-label-md uppercase tracking-wider mb-2">Prescribed Items</h3>
                  <div className="rounded-lg border border-[#273244] p-3 flex flex-col gap-2 bg-[#111827] max-h-[180px] overflow-y-auto">
                    {selectedAuction.prescription.medications.map((med) => (
                      <div key={med.id} className="flex justify-between border-b border-[#273244]/30 pb-2 last:border-0 last:pb-0 text-xs">
                        <div>
                          <p className="font-bold text-on-surface leading-snug">{med.name}</p>
                          <p className="text-[10px] text-text-muted leading-none mt-0.5">{med.generic_name || "Generic"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-on-surface">{med.dosage}</p>
                          <p className="text-[10px] text-text-muted mt-0.5">Qty: {med.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-on-surface block">Doctor</span>
                    <span className="text-text-muted">Dr. {selectedAuction.prescription.doctor_name || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-on-surface block">Hospital</span>
                    <span className="text-text-muted">{selectedAuction.prescription.hospital_name || "Self"}</span>
                  </div>
                </div>

                {selectedAuction.prescription.notes && (
                  <div>
                    <span className="font-semibold text-on-surface text-xs block mb-1">Patient Notes</span>
                    <p className="italic text-xs leading-relaxed max-h-[85px] overflow-y-auto">{selectedAuction.prescription.notes}</p>
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-3 border-t border-[#273244]/40">
                  <span className="font-semibold text-on-surface text-xs uppercase tracking-wider">Prescription File</span>
                  {selectedAuction.prescription.prescription_image_url ? (
                    selectedAuction.prescription.prescription_image_url.toLowerCase().endsWith(".pdf") ||
                    selectedAuction.prescription.prescription_image_url.startsWith("data:application/pdf") ? (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container border border-outline-variant/30 hover:border-primary/40 transition-colors">
                        <div className="w-8 h-8 rounded bg-[#ffb4ab]/10 text-error flex items-center justify-center font-bold text-xs shrink-0">
                          PDF
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-on-surface truncate">
                            prescription_document.pdf
                          </p>
                        </div>
                        <a
                          href={selectedAuction.prescription.prescription_image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-7 px-2.5 rounded-button bg-surface-container-highest border border-outline-variant/30 text-on-surface hover:text-primary text-[10px] font-semibold flex items-center transition-colors"
                        >
                          Open
                        </a>
                      </div>
                    ) : (
                      <div className="relative group overflow-hidden rounded-lg border border-[#273244] bg-[#111827] flex flex-col items-center justify-center p-1.5 max-h-[150px]">
                        <img
                          src={selectedAuction.prescription.prescription_image_url}
                          alt="Uploaded Prescription"
                          className="max-w-full max-h-[135px] object-contain rounded-md transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a
                            href={selectedAuction.prescription.prescription_image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary text-on-primary hover:bg-primary-container px-3 py-1.5 rounded-button text-[10px] font-semibold transition-colors"
                          >
                            Open Full Image
                          </a>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="rounded border border-dashed border-outline-variant/40 p-2.5 text-center text-[10px] text-text-muted bg-surface-container-low/40">
                      No document attached (Manual Entry).
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
