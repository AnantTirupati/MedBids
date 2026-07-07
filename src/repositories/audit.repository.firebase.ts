import { AuditRepository } from "./interfaces/audit.repository";
import { AuditLog } from "@/types";
import { db, createConverter } from "@/lib/firebase/firestore";
import { Collections } from "@/constants/firestore";
import { doc, getDocs, collection, setDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

export const auditRepositoryFirebase: AuditRepository = {
  async createLog(log: AuditLog): Promise<AuditLog> {
    try {
      const docRef = doc(db, Collections.AUDIT_LOGS, log.id).withConverter(createConverter<AuditLog>());
      await setDoc(docRef, log);
      return log;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async getLogs(): Promise<AuditLog[]> {
    try {
      const colRef = collection(db, Collections.AUDIT_LOGS).withConverter(createConverter<AuditLog>());
      const q = query(colRef, orderBy("timestamp", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  subscribeLogs(callback: (logs: AuditLog[]) => void): () => void {
    const colRef = collection(db, Collections.AUDIT_LOGS).withConverter(createConverter<AuditLog>());
    const q = query(colRef, orderBy("timestamp", "desc"));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => d.data()));
    });
  },
};

export default auditRepositoryFirebase;
