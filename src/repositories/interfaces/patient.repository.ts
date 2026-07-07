import { Patient, ActivityItem } from "@/types";

export interface PatientRepository {
  getPatientById(id: string): Promise<Patient | null>;
  getPatients(): Promise<Patient[]>;
  getTimelineEvents(patientId: string): Promise<ActivityItem[]>;
}
