import { ActivityItem } from "@/types";

export const mockTimelineEvents: ActivityItem[] = [
  {
    id: "act1",
    type: "bid",
    title: "New offer from Apollo Pharmacy",
    description: "Lantus Solostar - ₹1,850 (Lowest competing offer)",
    timestamp: new Date().toISOString(),
    relative_time: "Just Now",
    accent_color: "secondary",
  },
  {
    id: "act2",
    type: "auction",
    title: "Auction for Insulin ending in 15m",
    description: "Currently receiving offers from 3 pharmacies.",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    relative_time: "10 mins ago",
    accent_color: "primary",
  },
  {
    id: "act3",
    type: "verification",
    title: "Prescription verified by medical team",
    description: "Metformin HCL 500mg approved for marketplace bidding.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    relative_time: "2 hours ago",
    accent_color: "outline-variant",
  },
  {
    id: "act4",
    type: "savings",
    title: "Successfully saved ₹450 on last order",
    description: "Fulfilled at MedPlus pharmacy on Oct 24, 2023.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    relative_time: "Yesterday",
    accent_color: "outline-variant",
  }
];
