import * as React from "react";
import { User, Phone, Mail, MapPin, BadgePercent } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Patient, Pharmacy } from "@/types";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  profile: Patient | Pharmacy;
  className?: string;
}

export function ProfileCard({ profile, className }: ProfileCardProps) {
  const isPharmacy = profile.role === "pharmacy";

  return (
    <Card className={cn("rounded-card border border-surface-card-border bg-surface-card select-none", className)}>
      <CardHeader className="pb-4 border-b border-[#273244]/30 flex flex-col items-center text-center gap-2">
        <Avatar className="w-20 h-20 border-2 border-primary/20 flex items-center justify-center bg-surface-container-high overflow-hidden">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-primary" />
          )}
        </Avatar>
        <div>
          <h3 className="text-headline-sm font-bold text-on-surface">
            {isPharmacy ? (profile as Pharmacy).pharmacy_name : profile.full_name}
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-0.5 capitalize">
            {isPharmacy ? "Verified Partner Pharmacy" : `${(profile as Patient).membership_tier} Member`}
          </p>
        </div>
        {!isPharmacy && (profile as Patient).membership_tier === "premium" && (
          <Badge variant="secondary" className="bg-secondary-container/20 border border-secondary-container text-secondary px-2.5 py-0.5">
            PRO SAVER
          </Badge>
        )}
      </CardHeader>

      <CardContent className="pt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {/* Phone */}
          <div className="flex items-center gap-3 text-body-md text-on-surface-variant">
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <span>{profile.phone}</span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 text-body-md text-on-surface-variant">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <span className="line-clamp-1">{profile.email}</span>
          </div>

          {/* Location */}
          {profile.address && (
            <div className="flex items-start gap-3 text-body-md text-on-surface-variant">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
              <span>
                {profile.address}, {profile.city}, {profile.state} - {profile.pincode}
              </span>
            </div>
          )}

          {/* Savings/Stats banner for patient */}
          {!isPharmacy && (
            <div className="mt-4 p-4 rounded-xl bg-primary-container/10 border border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BadgePercent className="w-5 h-5 text-primary" />
                <span className="text-body-sm font-semibold text-primary">Estimated Savings</span>
              </div>
              <span className="text-headline-sm font-bold text-primary">
                ₹{(profile as Patient).total_savings.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
