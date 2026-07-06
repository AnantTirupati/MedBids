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
