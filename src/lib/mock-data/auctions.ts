import { Auction, AuctionStatus } from "@/types";
import { mockPrescriptions } from "./prescriptions";

export const mockAuctions: Auction[] = [
  {
    id: "auc1",
    prescription_id: "rx1",
    prescription: mockPrescriptions[0],
    status: AuctionStatus.LIVE,
    start_time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins left
    duration_minutes: 270,
    total_bids: 14,
    lowest_bid: 1850,
    highest_bid: 2300,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "auc2",
    prescription_id: "rx3",
    prescription: mockPrescriptions[2],
    status: AuctionStatus.ENDED,
    start_time: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 1440,
    total_bids: 8,
    lowest_bid: 120,
    highest_bid: 180,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  }
];
