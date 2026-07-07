// ============================================
// MedBids Type Definitions
// Mirrors future Supabase database schema
// ============================================

export * from "./user";
export * from "./patient";
export * from "./pharmacy";
export * from "./prescription-item";
export * from "./prescription";
export * from "./auction";
export * from "./bid";
export * from "./offer";
export * from "./reservation";
export * from "./notification";
export * from "./analytics";
export * from "./settings";
export * from "./audit";


// Re-export specific navigation structures if used by layouts
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
}

export interface SidebarConfig {
  user: {
    name: string;
    subtitle: string;
    avatar_url: string;
  };
  nav_items: NavItem[];
  bottom_items: NavItem[];
  cta?: {
    label: string;
    href: string;
  };
}

export interface VerificationRequest {
  id: string;
  pharmacy_id: string;
  pharmacy: import("./pharmacy").Pharmacy;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  status: import("./pharmacy").VerificationStatus;
  documents: {
    license_url: string;
    gst_certificate_url: string | null;
    address_proof_url: string | null;
  };
  notes: string | null;
}
