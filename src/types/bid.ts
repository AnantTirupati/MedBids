export enum BidStatus {
  ACTIVE = "active",
  OUTBID = "outbid",
  WON = "won",
  LOST = "lost",
  WITHDRAWN = "withdrawn",
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
