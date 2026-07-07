import { writeBatch, doc, DocumentData } from "firebase/firestore";
import { db, prepareForFirestore } from "./firestore";

export const firestoreBatch = {
  create() {
    const batch = writeBatch(db);
    return {
      set<T extends object>(collectionName: string, id: string, data: T): void {
        const docRef = doc(db, collectionName, id);
        batch.set(docRef, prepareForFirestore(data) as DocumentData);
      },
      update(collectionName: string, id: string, data: Record<string, unknown>): void {
        const docRef = doc(db, collectionName, id);
        batch.update(docRef, prepareForFirestore(data) as DocumentData);
      },
      delete(collectionName: string, id: string): void {
        const docRef = doc(db, collectionName, id);
        batch.delete(docRef);
      },
      async commit(): Promise<void> {
        await batch.commit();
      },
    };
  },
};

export default firestoreBatch;
