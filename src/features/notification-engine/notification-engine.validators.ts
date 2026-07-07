import { z } from "zod";

export const notificationPayloadSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  type: z.string().min(1, "Notification type is required"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  actionUrl: z.string().nullable().optional(),
});

export const notificationPreferenceSchema = z.object({
  userId: z.string().min(1),
  pushEnabled: z.boolean(),
  inAppEnabled: z.boolean(),
  auctionAlertsEnabled: z.boolean(),
  bidAlertsEnabled: z.boolean(),
  reservationAlertsEnabled: z.boolean(),
  marketingEnabled: z.boolean(),
  maintenanceEnabled: z.boolean(),
  quietHoursStart: z.string().nullable().optional(),
  quietHoursEnd: z.string().nullable().optional(),
});

export const deviceTokenSchema = z.object({
  userId: z.string().min(1),
  token: z.string().min(1),
  platform: z.enum(["web", "ios", "android"]),
});
