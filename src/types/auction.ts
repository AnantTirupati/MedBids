import { Prescription } from "./prescription";

export enum AuctionStatus {
  SCHEDULED = "scheduled",
  LIVE = "live",
  ENDING_SOON = "ending_soon",
  ENDED = "ended",
  CANCELLED = "cancelled",
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
