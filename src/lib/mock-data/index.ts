import { Patient, Pharmacy, Prescription, Auction, Bid, Offer, Notification, VerificationRequest, ActivityItem } from "@/types";

// ============================================
// Mock Patients
// ============================================
export const mockPatients: Patient[] = [
  {
    id: "p1",
    email: "anant.tirupati@gmail.com",
    phone: "+91 98765 43210",
    role: "patient",
    full_name: "Anant Tirupati",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-yIlpi6nLlRmFhS0wTZtIFMxFiq0EWEGS9D-4LGUSq7Amss8JMSSF7IH84VPdWwWg6lHdzWvY2yDJWPN8lhy-BNee-ofpsZP6Bpr7HdNNCSL5NtVkW6Jg33nwqc_TgrBrctn5LBbsCQTHXdDsxtT5ASNOwfn_y3ku-joO8rgWe1bqJLWi1bpHR8wroCtEzi3ea8IPWHe4wPkB5Zm2O_JqlNE-xje8p6-cHrxo8hGcGNDOkFeicDL5",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true,
    date_of_birth: "1994-05-12",
    address: "Flat 402, Block A, Premium Residency, Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500033",
    membership_tier: "premium",
    total_savings: 4250,
  },
  {
    id: "p2",
    email: "alexander.voss@gmail.com",
    phone: "+91 99999 88888",
    role: "patient",
    full_name: "Alexander Voss",
    avatar_url: null,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true,
    date_of_birth: "1988-11-20",
    address: "12/A Park Street",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700016",
    membership_tier: "free",
    total_savings: 1200,
  }
];

// ============================================
// Mock Pharmacies
// ============================================
export const mockPharmacies: Pharmacy[] = [
  {
    id: "pharm1",
    email: "contact@apollopharmacy.in",
    phone: "+91 40 2345 6789",
    role: "pharmacy",
    full_name: "Apollo Pharmacy Store Managers",
    avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcAFIy8qO6brIXU26lUqZ8yEvPoM3sjOsaPdIOcouQJF50FK6ukCCpcGQEmXFhYQnq5CcpJDapkCp8hElmtvDhMavZiT5Dy115WoH3468LR2c_EtDblF5OdQQnP1mUubCESQqQsJuya7VuoajPt5OJFSnk4XXf1kfn5UWwu1Wz8-1QwGesZmZWamiD1tEboBoKDTTkJA8A9ECFuw9DOGg8ZxVN1oLk9ecQ6crjfe4n3RLPxcM4-y_J",
    created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true,
    pharmacy_name: "Apollo Pharmacy",
    license_number: "DL-HYD-2023-9988",
    license_expiry: "2028-12-31",
    gst_number: "36AAAAA1111A1Z1",
    address: "Road No 36, Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500033",
    verification_status: "approved",
    rating: 4.8,
    total_bids: 412,
    successful_bids: 289,
    response_time_avg: "8 minutes",
    established_year: 2011,
  },
  {
    id: "pharm2",
    email: "info@medplusindia.com",
    phone: "+91 40 4444 8888",
    role: "pharmacy",
    full_name: "MedPlus Store Manager",
    avatar_url: null,
    created_at: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true,
    pharmacy_name: "MedPlus Pharmacy",
    license_number: "DL-HYD-2024-4455",
    license_expiry: "2029-06-30",
    gst_number: "36BBBBB2222B2Z2",
    address: "Madhapur Main Road",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
    verification_status: "approved",
    rating: 4.6,
    total_bids: 350,
    successful_bids: 210,
    response_time_avg: "12 minutes",
    established_year: 2015,
  },
  {
    id: "pharm3",
    email: "contact@netmeds.com",
    phone: "+91 44 6677 8899",
    role: "pharmacy",
    full_name: "Netmeds Logistics Manager",
    avatar_url: null,
    created_at: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true,
    pharmacy_name: "Netmeds Store",
    license_number: "DL-MAS-2023-3322",
    license_expiry: "2028-09-15",
    gst_number: "33CCCCC3333C3Z3",
    address: "Kondapur Cross Roads",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500084",
    verification_status: "approved",
    rating: 4.5,
    total_bids: 280,
    successful_bids: 180,
    response_time_avg: "15 minutes",
    established_year: 2018,
  },
  {
    id: "pharm4",
    email: "admin@wellnessforever.com",
    phone: "+91 22 8888 9999",
    role: "pharmacy",
    full_name: "Wellness Manager",
    avatar_url: null,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    is_active: false,
    pharmacy_name: "Wellness Forever",
    license_number: "DL-BOM-2026-1122",
    license_expiry: "2031-03-20",
    gst_number: "27DDDDD4444D4Z4",
    address: "Hitech City Boulevard",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
    verification_status: "pending",
    rating: 0,
    total_bids: 0,
    successful_bids: 0,
    response_time_avg: "—",
    established_year: 2023,
  }
];

// ============================================
// Mock Prescriptions
// ============================================
export const mockPrescriptions: Prescription[] = [
  {
    id: "rx1",
    patient_id: "p1",
    patient_name: "Anant Tirupati",
    status: "auction_live",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    verified_at: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
    verified_by: "Dr. Sandeep Reddy",
    doctor_name: "Suresh Rao",
    hospital_name: "AIG Hospitals",
    notes: "Take Lantus once daily before bedtime. Monitor blood sugar levels closely.",
    prescription_image_url: null,
    auction_id: "auc1",
    medications: [
      {
        id: "m1",
        name: "Lantus Solostar",
        generic_name: "Insulin Glargine 100IU/ml",
        dosage: "10 units daily",
        form: "Pre-filled Pen",
        quantity: 2,
        frequency: "Once daily",
      },
      {
        id: "m2",
        name: "Metformin HCL",
        generic_name: "Metformin Hydrochloride 500mg",
        dosage: "500mg",
        form: "Tablets",
        quantity: 60,
        frequency: "Twice daily with meals",
      }
    ],
  },
  {
    id: "rx2",
    patient_id: "p1",
    patient_name: "Anant Tirupati",
    status: "verified",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    verified_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    verified_by: "Dr. Sandeep Reddy",
    doctor_name: "K. Prasad",
    hospital_name: "Apollo Hospitals",
    notes: "Take post lunch regularly.",
    prescription_image_url: null,
    auction_id: null,
    medications: [
      {
        id: "m3",
        name: "Januvia",
        generic_name: "Sitagliptin 100mg",
        dosage: "100mg",
        form: "Tablets",
        quantity: 30,
        frequency: "Once daily",
      }
    ],
  },
  {
    id: "rx3",
    patient_id: "p1",
    patient_name: "Anant Tirupati",
    status: "fulfilled",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    verified_at: new Date(Date.now() - 9.5 * 24 * 60 * 60 * 1000).toISOString(),
    verified_by: "Dr. Sandeep Reddy",
    doctor_name: "Raman Murthy",
    hospital_name: "Care Hospitals",
    notes: "For hypertension control.",
    prescription_image_url: null,
    auction_id: "auc2",
    medications: [
      {
        id: "m4",
        name: "Telmisartan",
        generic_name: "Telmisartan 40mg",
        dosage: "40mg",
        form: "Tablets",
        quantity: 30,
        frequency: "Once daily in the morning",
      }
    ],
  }
];

// ============================================
// Mock Auctions
// ============================================
export const mockAuctions: Auction[] = [
  {
    id: "auc1",
    prescription_id: "rx1",
    prescription: mockPrescriptions[0],
    status: "live",
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
    status: "ended",
    start_time: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 1440,
    total_bids: 8,
    lowest_bid: 120,
    highest_bid: 180,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// ============================================
// Mock Bids
// ============================================
export const mockBids: Bid[] = [
  {
    id: "b1",
    auction_id: "auc1",
    pharmacy_id: "pharm1",
    pharmacy_name: "Apollo Pharmacy",
    pharmacy_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcAFIy8qO6brIXU26lUqZ8yEvPoM3sjOsaPdIOcouQJF50FK6ukCCpcGQEmXFhYQnq5CcpJDapkCp8hElmtvDhMavZiT5Dy115WoH3468LR2c_EtDblF5OdQQnP1mUubCESQqQsJuya7VuoajPt5OJFSnk4XXf1kfn5UWwu1Wz8-1QwGesZmZWamiD1tEboBoKDTTkJA8A9ECFuw9DOGg8ZxVN1oLk9ecQ6crjfe4n3RLPxcM4-y_J",
    pharmacy_rating: 4.8,
    amount: 1850,
    delivery_time: "Within 2 hours",
    notes: "Direct home delivery with temperature control bags for Insulin.",
    status: "active",
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "b2",
    auction_id: "auc1",
    pharmacy_id: "pharm2",
    pharmacy_name: "MedPlus Pharmacy",
    pharmacy_avatar: null,
    pharmacy_rating: 4.6,
    amount: 1920,
    delivery_time: "Within 4 hours",
    notes: "Insulin syringes included free.",
    status: "outbid",
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "b3",
    auction_id: "auc1",
    pharmacy_id: "pharm3",
    pharmacy_name: "Netmeds Store",
    pharmacy_avatar: null,
    pharmacy_rating: 4.5,
    amount: 1980,
    delivery_time: "Next Morning",
    notes: null,
    status: "outbid",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// ============================================
// Mock Offers (accepted/reservations)
// ============================================
export const mockOffers: Offer[] = [
  {
    id: "o1",
    bid_id: "b1",
    auction_id: "auc1",
    prescription_id: "rx1",
    patient_id: "p1",
    pharmacy_id: "pharm1",
    pharmacy_name: "Apollo Pharmacy",
    pharmacy_avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcAFIy8qO6brIXU26lUqZ8yEvPoM3sjOsaPdIOcouQJF50FK6ukCCpcGQEmXFhYQnq5CcpJDapkCp8hElmtvDhMavZiT5Dy115WoH3468LR2c_EtDblF5OdQQnP1mUubCESQqQsJuya7VuoajPt5OJFSnk4XXf1kfn5UWwu1Wz8-1QwGesZmZWamiD1tEboBoKDTTkJA8A9ECFuw9DOGg8ZxVN1oLk9ecQ6crjfe4n3RLPxcM4-y_J",
    pharmacy_rating: 4.8,
    amount: 1850,
    delivery_time: "Within 2 hours",
    medications: mockPrescriptions[0].medications,
    status: "open",
    accepted_at: null,
    fulfilled_at: null,
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "o2",
    bid_id: "b2",
    auction_id: "auc2",
    prescription_id: "rx3",
    patient_id: "p1",
    pharmacy_id: "pharm2",
    pharmacy_name: "MedPlus Pharmacy",
    pharmacy_avatar: null,
    pharmacy_rating: 4.6,
    amount: 120,
    delivery_time: "Self Pickup",
    medications: mockPrescriptions[2].medications,
    status: "fulfilled",
    accepted_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    fulfilled_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// ============================================
// Mock Timeline events
// ============================================
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

// ============================================
// Mock Verification Requests (Admin Queue)
// ============================================
export const mockVerificationRequests: VerificationRequest[] = [
  {
    id: "vr1",
    pharmacy_id: "pharm4",
    pharmacy: mockPharmacies[3],
    submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed_at: null,
    reviewed_by: null,
    status: "pending",
    documents: {
      license_url: "https://example.com/license.pdf",
      gst_certificate_url: "https://example.com/gst.pdf",
      address_proof_url: "https://example.com/address.pdf",
    },
    notes: "Requires quick verification of pharmaceutical license against TS drug authority registry.",
  }
];
