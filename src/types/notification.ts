export enum NotificationType {
  BID_RECEIVED = "bid_received",
  AUCTION_ENDING = "auction_ending",
  OFFER_ACCEPTED = "offer_accepted",
  PRESCRIPTION_VERIFIED = "prescription_verified",
  SYSTEM = "system",
  SAVINGS = "savings",
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}
