import { AuditLog } from "@/types";

export interface AuditRepository {
  createLog(log: AuditLog): Promise<AuditLog>;
  getLogs(): Promise<AuditLog[]>;
  subscribeLogs(callback: (logs: AuditLog[]) => void): () => void;
}
