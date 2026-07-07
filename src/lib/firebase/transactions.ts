import { runTransaction, doc, DocumentSnapshot, DocumentData } from "firebase/firestore";
import { db, prepareForFirestore } from "./firestore";

export const firestoreTransaction = {
  async run<T>(
    updateFunction: (transaction: {
      get: (collectionName: string, id: string) => Promise<DocumentSnapshot>;
      set: <D extends object>(collectionName: string, id: string, data: D) => void;
      update: (collectionName: string, id: string, data: Record<string, unknown>) => void;
      delete: (collectionName: string, id: string) => void;
    }) => Promise<T>
  ): Promise<T> {
    return runTransaction(db, async (transaction) => {
      return updateFunction({
        async get(collectionName: string, id: string): Promise<DocumentSnapshot> {
          const docRef = doc(db, collectionName, id);
          return transaction.get(docRef);
        },
        set<D extends object>(collectionName: string, id: string, data: D): void {
          const docRef = doc(db, collectionName, id);
          transaction.set(docRef, prepareForFirestore(data) as DocumentData);
        },
        update(collectionName: string, id: string, data: Record<string, unknown>): void {
          const docRef = doc(db, collectionName, id);
          transaction.update(docRef, prepareForFirestore(data) as DocumentData);
        },
        delete(collectionName: string, id: string): void {
          const docRef = doc(db, collectionName, id);
          transaction.delete(docRef);
        },
      });
    });
  },
};

export default firestoreTransaction;
