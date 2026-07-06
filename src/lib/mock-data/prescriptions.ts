import { Prescription, PrescriptionStatus } from "@/types";

export const mockPrescriptions: Prescription[] = [
  {
    id: "rx1",
    patient_id: "p1",
    patient_name: "Anant Tirupati",
    status: PrescriptionStatus.AUCTION_LIVE,
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
    status: PrescriptionStatus.VERIFIED,
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
    status: PrescriptionStatus.FULFILLED,
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
