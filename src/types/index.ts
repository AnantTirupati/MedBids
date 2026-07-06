// ============================================
// MedBids Type Definitions
// Mirrors future Supabase database schema
// ============================================

export type UserRole = "patient" | "pharmacy" | "admin";

export type PrescriptionStatus =
  | "pending_verification"
  | "verified"
  | "auction_live"
  | "auction_ended"
  | "offer_accepted"
  | "fulfilled"
  | "expired"
  | "rejected";

export type AuctionStatus = "scheduled" | "live" | "ending_soon" | "ended" | "cancelled";

export type BidStatus = "active" | "outbid" | "won" | "lost" | "withdrawn";

export type OfferStatus = "open" | "accepted" | "rejected" | "expired" | "fulfilled";

export type VerificationStatus = "pending" | "under_review" | "approved" | "rejected";

export interface User {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Patient extends User {
  role: "patient";
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  membership_tier: "free" | "premium";
  total_savings: number;
}

export interface Pharmacy extends User {
  role: "pharmacy";
  pharmacy_name: string;
  license_number: string;
  license_expiry: string;
  gst_number: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  verification_status: VerificationStatus;
  rating: number;
  total_bids: number;
  successful_bids: number;
  response_time_avg: string;
  established_year: number;
}

export interface Medication {
  id: string;
  name: string;
  generic_name: string | null;
  dosage: string;
  form: string;
  quantity: number;
  frequency: string | null;
}

export interface Prescription {
  id: string;
  patient_id: string;
  patient_name: string;
  status: PrescriptionStatus;
  medications: Medication[];
  prescription_image_url: string | null;
  doctor_name: string | null;
  hospital_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  verified_at: string | null;
  verified_by: string | null;
  auction_id: string | null;
}

export interface Auction {
  id: string;
  prescription_id: string;
  prescription: Prescription;
  status: AuctionStatus;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_bids: number;
  lowest_bid: number | null;
  highest_bid: number | null;
  created_at: string;
}

export interface Bid {
  id: string;
  auction_id: string;
  pharmacy_id: string;
  pharmacy_name: string;
  pharmacy_avatar: string | null;
  pharmacy_rating: number;
  amount: number;
  delivery_time: string;
  notes: string | null;
  status: BidStatus;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  bid_id: string;
  auction_id: string;
  prescription_id: string;
  patient_id: string;
  pharmacy_id: string;
  pharmacy_name: string;
  pharmacy_avatar: string | null;
  pharmacy_rating: number;
  amount: number;
  delivery_time: string;
  medications: Medication[];
  status: OfferStatus;
  accepted_at: string | null;
  fulfilled_at: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: "bid_received" | "auction_ending" | "offer_accepted" | "prescription_verified" | "system" | "savings";
  title: string;
  message: string;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

export interface VerificationRequest {
  id: string;
  pharmacy_id: string;
  pharmacy: Pharmacy;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  status: VerificationStatus;
  documents: {
    license_url: string;
    gst_certificate_url: string | null;
    address_proof_url: string | null;
  };
  notes: string | null;
}

export interface DashboardStats {
  active_prescriptions: number;
  active_bids: number;
  accepted_offers: number;
  estimated_savings: number;
}

export interface PharmacyDashboardStats {
  active_auctions: number;
  bids_placed: number;
  bids_won: number;
  win_rate: number;
  revenue_this_month: number;
  avg_response_time: string;
}

export interface AdminDashboardStats {
  total_users: number;
  total_pharmacies: number;
  active_auctions: number;
  pending_verifications: number;
  total_prescriptions: number;
  revenue_this_month: number;
  user_growth_percent: number;
  auction_volume_percent: number;
}

export interface ActivityItem {
  id: string;
  type: "bid" | "auction" | "verification" | "savings" | "system";
  title: string;
  description: string;
  timestamp: string;
  relative_time: string;
  accent_color: "primary" | "secondary" | "tertiary" | "outline-variant";
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
}

export interface SidebarConfig {
  user: {
    name: string;
    subtitle: string;
    avatar_url: string;
  };
  nav_items: NavItem[];
  bottom_items: NavItem[];
  cta?: {
    label: string;
    href: string;
  };
}
