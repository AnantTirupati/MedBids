import { Notification } from "@/types";

// Simulating database storage for notifications
let mockNotifications: Notification[] = [
  {
    id: "n1",
    user_id: "p1",
    type: "bid_received",
    title: "New offer received",
    message: "Apollo Pharmacy submitted bid of ₹1,850 for Lantus Solostar.",
    is_read: false,
    action_url: "/dashboard/patient/open-offers",
    created_at: new Date().toISOString(),
  },
  {
    id: "n2",
    user_id: "p1",
    type: "prescription_verified",
    title: "Prescription verified",
    message: "Metformin HCL 500mg has been verified by the medical team.",
    is_read: false,
    action_url: "/dashboard/patient",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockNotifications.filter((n) => n.user_id === userId);
  },

  async markAsRead(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const notif = mockNotifications.find((n) => n.id === id);
    if (notif) {
      notif.is_read = true;
    }
  },

  async clearAll(userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockNotifications = mockNotifications.filter((n) => n.user_id !== userId);
  },
};

export default notificationService;
