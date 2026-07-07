import { PatientRepository } from "./interfaces/patient.repository";
import { mockPatients, mockTimelineEvents } from "@/lib/mock-data";
import { Patient, ActivityItem } from "@/types";

export const patientRepositoryMock: PatientRepository = {
  async getPatientById(id: string): Promise<Patient | null> {
    const patient = mockPatients.find((p) => p.id === id);
    return patient || null;
  },

  async getPatients(): Promise<Patient[]> {
    return mockPatients;
  },

  async getTimelineEvents(patientId: string): Promise<ActivityItem[]> {
    console.log(`[Mock Patient] Get timeline for ${patientId}`);
    return mockTimelineEvents;
  },
};

export default patientRepositoryMock;
