import * as React from "react";
import { Star, ShieldCheck, MapPin, Truck, Check } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Offer } from "@/types";
import { cn } from "@/lib/utils";

interface OfferCardProps {
  offer: Offer;
  onAccept?: (offerId: string) => void;
  isAcceptedView?: boolean;
  className?: string;
}

export function OfferCard({ offer, onAccept, isAcceptedView = false, className }: OfferCardProps) {
  return (
    <Card
      className={cn(
        "rounded-card border bg-surface-card select-none",
        isAcceptedView ? "border-tertiary-container/30 bg-tertiary-container/5" : "border-surface-card-border",
        className
      )}
    >
      <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4 flex-wrap border-b border-[#273244]/30">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-outline-variant/30 flex items-center justify-center bg-surface-container-high overflow-hidden">
            {offer.pharmacy_avatar ? (
              <img
                src={offer.pharmacy_avatar}
                alt={offer.pharmacy_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-bold text-primary text-body-lg">
                {offer.pharmacy_name[0]}
              </span>
            )}
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-body-md font-bold text-on-surface">
                {offer.pharmacy_name}
              </h3>
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-center gap-3 text-body-sm text-on-surface-variant mt-0.5">
              <span className="flex items-center gap-0.5 text-secondary">
                <Star className="w-3.5 h-3.5 fill-current" />
                {offer.pharmacy_rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <MapPin className="w-3 h-3" />
                Verified Partner
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-label-md text-on-surface-variant font-medium">Bidding Price</p>
          <p className="text-headline-md font-bold text-primary">₹{offer.amount}</p>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col gap-4">
        {/* Delivery / Pickup Info */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest/50 border border-outline-variant/20 w-fit">
          <Truck className="w-4 h-4 text-primary" />
          <span className="text-body-sm text-on-surface-variant">
            Available for pickup / delivery: <strong className="text-on-surface">{offer.delivery_time}</strong>
          </span>
        </div>

        {/* Medications list preview */}
        <div>
          <span className="text-label-md text-on-surface-variant font-semibold uppercase tracking-wider block mb-1">
            Fulfillment Details
          </span>
          <ul className="text-body-sm text-on-surface-variant space-y-1.5 pl-0 list-none">
            {offer.medications.map((med) => (
              <li key={med.id} className="flex justify-between border-b border-[#273244]/10 pb-1">
                <span>{med.name}</span>
                <span className="font-semibold text-on-surface">Qty: {med.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-[#273244]/30 mt-2">
        {isAcceptedView ? (
          <div className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-tertiary-container/20 border border-tertiary-container/30 text-tertiary font-semibold text-label-lg">
            <Check className="w-4 h-4" />
            <span>Reserved & Confirmed</span>
          </div>
        ) : (
          <Button
            variant="primary"
            onClick={() => onAccept && onAccept(offer.id)}
            className="w-full h-10 py-2 text-label-md"
          >
            Accept & Reserve Order
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default OfferCard;
