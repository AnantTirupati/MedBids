import { Notification, NotificationType } from "@/types";

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    user_id: "p1",
    type: NotificationType.BID_RECEIVED,
    title: "New offer received",
    message: "Apollo Pharmacy submitted bid of ₹1,850 for Lantus Solostar.",
    is_read: false,
    action_url: "/dashboard/patient/open-offers",
    created_at: new Date().toISOString(),
  },
  {
    id: "n2",
    user_id: "p1",
    type: NotificationType.PRESCRIPTION_VERIFIED,
    title: "Prescription verified",
    message: "Metformin HCL 500mg has been verified by the medical team.",
    is_read: false,
    action_url: "/dashboard/patient",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "n3",
    user_id: "p1",
    type: NotificationType.SYSTEM,
    title: "System Maintenance",
    message: "Platform services will undergo scheduled upgrades tonight at 12 AM.",
    is_read: true,
    action_url: null,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  }
];
