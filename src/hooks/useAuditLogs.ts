import * as React from "react";
import { AuditLog } from "@/types";
import { auditService } from "@/services/audit.service";

export function useAuditLogs() {
  const [logs, setLogs] = React.useState<AuditLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const unsubscribe = auditService.subscribeLogs((data) => {
      setLogs(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return {
    logs,
    loading,
    error,
    refresh: async () => {
      setLoading(true);
      try {
        const data = await auditService.getLogs();
        setLogs(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load audit logs"));
      } finally {
        setLoading(false);
      }
    },
  };
}

export default useAuditLogs;
