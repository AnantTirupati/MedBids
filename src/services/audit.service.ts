import { auditRepository } from "@/repositories";
import { AuditLog } from "@/types";

export const auditService = {
  async createLog(
    actorId: string,
    actorRole: string,
    action: string,
    entity: string,
    entityId: string,
    before: Record<string, unknown> | null,
    after: Record<string, unknown> | null
  ): Promise<AuditLog> {
    const log: AuditLog = {
      id: `log_${Math.random().toString(36).substr(2, 9)}`,
      actorId,
      actorRole,
      action,
      entity,
      entityId,
      before,
      after,
      timestamp: new Date().toISOString(),
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };
    
    console.log(`[AuditLog] ${log.timestamp} | Actor: ${actorId} (${actorRole}) | Action: ${action} | Entity: ${entity} (${entityId})`);
    return auditRepository.createLog(log);
  },

  async getLogs(): Promise<AuditLog[]> {
    return auditRepository.getLogs();
  },

  subscribeLogs(callback: (logs: AuditLog[]) => void): () => void {
    return auditRepository.subscribeLogs(callback);
  },
};

export default auditService;
