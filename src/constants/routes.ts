export const ROUTES = {
  // Public Routes
  home: "/",
  about: "/about",
  contact: "/contact",

  // Auth Routes
  login: "/login",
  signup: "/signup",
  signupPharmacy: "/signup/pharmacy",

  // Patient Dashboard
  patient: {
    dashboard: "/dashboard/patient",
    upload: "/dashboard/patient/upload",
    prescriptionDetails: (id: string) => `/dashboard/patient/prescription/${id}`,
    liveAuctions: "/dashboard/patient/live-auctions",
    openOffers: "/dashboard/patient/open-offers",
    accepted: "/dashboard/patient/accepted",
    profile: "/dashboard/patient/profile",
  },

  // Pharmacy Dashboard
  pharmacy: {
    dashboard: "/dashboard/pharmacy",
    liveAuctions: "/dashboard/pharmacy/live-auctions",
    myBids: "/dashboard/pharmacy/my-bids",
    profile: "/dashboard/pharmacy/profile",
  },

  // Admin Dashboard
  admin: {
    dashboard: "/dashboard/admin",
    pharmacyVerification: "/dashboard/admin/pharmacy-verification",
    prescriptions: "/dashboard/admin/prescriptions",
    auctions: "/dashboard/admin/auctions",
    users: "/dashboard/admin/users",
    settings: "/dashboard/admin/settings",
  },
};
export default ROUTES;
