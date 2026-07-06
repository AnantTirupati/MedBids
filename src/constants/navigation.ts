import { ROUTES } from "./routes";

export const PUBLIC_NAV_ITEMS = [
  { label: "How it Works", href: "/#how-it-works" },
  { label: "About Us", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
];

export const PATIENT_NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.patient.dashboard, icon: "dashboard" },
  { label: "Active Bids", href: ROUTES.patient.liveAuctions, icon: "gavel" },
  { label: "My Prescriptions", href: ROUTES.patient.accepted, icon: "medication" },
  { label: "Open Offers", href: ROUTES.patient.openOffers, icon: "savings" },
  { label: "Settings", href: ROUTES.patient.profile, icon: "settings" },
];

export const PHARMACY_NAV_ITEMS = [
  { label: "Console", href: ROUTES.pharmacy.dashboard, icon: "dashboard" },
  { label: "Live Auctions", href: ROUTES.pharmacy.liveAuctions, icon: "gavel" },
  { label: "My Active Bids", href: ROUTES.pharmacy.myBids, icon: "bids" },
  { label: "Pharmacy Profile", href: ROUTES.pharmacy.profile, icon: "settings" },
];

export const ADMIN_NAV_ITEMS = [
  { label: "Control Center", href: ROUTES.admin.dashboard, icon: "dashboard" },
  { label: "Verifications", href: ROUTES.admin.pharmacyVerification, icon: "verification" },
  { label: "Moderations", href: ROUTES.admin.prescriptions, icon: "medication" },
  { label: "Auctions Admin", href: ROUTES.admin.auctions, icon: "gavel" },
  { label: "Users & Providers", href: ROUTES.admin.users, icon: "users" },
  { label: "System Config", href: ROUTES.admin.settings, icon: "settings" },
];
