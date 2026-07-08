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
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Place Competitive Bid</DialogTitle>
              <DialogDescription>
                Bidding on prescription Rx #{selectedAuction.prescription_id.substring(0, 8).toUpperCase()}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handlePlaceBid} className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface-variant font-medium">Bidding Price (₹)</label>
                <Input
                  type="number"
                  placeholder="Enter price in ₹"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                />
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
                  className="w-full min-h-[80px] px-4 py-3 rounded-button bg-[#111827] border border-outline-variant text-on-surface text-body-md placeholder:text-text-muted focus:border-primary-container focus:outline-none transition-colors"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <DialogFooter className="mt-4">
                <Button type="button" variant="secondary" onClick={() => setSelectedAuction(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "Submitting Bid..." : "Submit Bidding Offer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
