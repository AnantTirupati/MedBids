import { z } from "zod";

export const bidSchema = z.object({
  amount: z.number().positive("Bid amount must be greater than zero"),
  delivery_time: z.string().min(1, "Delivery time is required"),
  notes: z.string().nullable().optional(),
});

export const pharmacyProfileSchema = z.object({
  pharmacy_name: z.string().min(3, "Pharmacy name must be at least 3 characters"),
  license_number: z.string().min(5, "License number must be at least 5 characters"),
  gst_number: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST format")
    .nullable()
    .optional()
    .or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City name must be at least 2 characters"),
  state: z.string().min(2, "State name must be at least 2 characters"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
});
