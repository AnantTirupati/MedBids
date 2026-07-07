import { AuditRepository } from "./interfaces/audit.repository";
import { AuditLog } from "@/types";

const mockAuditLogs: AuditLog[] = [
  {
    id: "log1",
    actorId: "admin1",
    actorRole: "admin",
    action: "System Startup",
    entity: "System",
    entityId: "platform",
    before: null,
    after: { status: "running" },
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: "127.0.0.1",
    userAgent: "Mozilla/5.0",
  },
];

const listeners: Set<(logs: AuditLog[]) => void> = new Set();

function notifyListeners() {
  listeners.forEach((cb) => cb([...mockAuditLogs]));
}

export const auditRepositoryMock: AuditRepository = {
  async createLog(log: AuditLog): Promise<AuditLog> {
    mockAuditLogs.push(log);
    notifyListeners();
    return log;
  },

  async getLogs(): Promise<AuditLog[]> {
    return mockAuditLogs;
  },

  subscribeLogs(callback: (logs: AuditLog[]) => void): () => void {
    listeners.add(callback);
    callback([...mockAuditLogs]);
    return () => {
      listeners.delete(callback);
    };
  },
};

export default auditRepositoryMock;
