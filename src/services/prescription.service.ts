import { Prescription, Medication, PrescriptionStatus } from "@/types";
import { prescriptionRepository } from "@/repositories";

export const prescriptionService = {
  async getPrescriptions(): Promise<Prescription[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return prescriptionRepository.getPrescriptions();
  },

  async getPrescriptionById(id: string): Promise<Prescription> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const rx = await prescriptionRepository.getPrescriptionById(id);
    if (!rx) throw new Error("Prescription not found");
    return rx;
  },

  async createPrescription(
    patientId: string,
    patientName: string,
    medications: Omit<Medication, "id">[],
    doctorName?: string,
    hospitalName?: string,
    notes?: string
  ): Promise<Prescription> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newRx: Prescription = {
      id: `rx_new_${Math.random().toString(36).substr(2, 9)}`,
      patient_id: patientId,
      patient_name: patientName,
      status: PrescriptionStatus.PENDING_VERIFICATION,
      prescription_image_url: null,
      doctor_name: doctorName || null,
      hospital_name: hospitalName || null,
      notes: notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      verified_at: null,
      verified_by: null,
      auction_id: null,
      medications: medications.map((med, index) => ({
        ...med,
        id: `m_new_${index}_${Math.random().toString(36).substr(2, 5)}`,
      })),
    };

    return prescriptionRepository.createPrescription(newRx);
  },
};

export default prescriptionService;
