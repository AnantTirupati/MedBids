export enum BidEventType {
  BID_PLACED = "BidPlaced",
  BID_UPDATED = "BidUpdated",
  BID_WITHDRAWN = "BidWithdrawn",
  AUCTION_STARTED = "AuctionStarted",
  AUCTION_EXTENDED = "AuctionExtended",
  AUCTION_ENDED = "AuctionEnded",
  OFFER_ACCEPTED = "OfferAccepted",
  OFFER_REJECTED = "OfferRejected",
  RESERVATION_CREATED = "ReservationCreated",
}

export interface BidEvent {
  id: string;
  type: BidEventType;
  auction_id: string;
  user_id: string;
  timestamp: string;
  details: Record<string, unknown>;
}

export interface AuctionEngineState {
  lowestBid: number | null;
  lowestBidder: string | null;
  bidCount: number;
  lastBidTime: string | null;
}
