import { VerificationRepository } from "./interfaces/verification.repository";
import { VerificationRequest } from "@/types";
import { db, createConverter } from "@/lib/firebase/firestore";
import { Collections } from "@/constants/firestore";
import { doc, getDoc, getDocs, collection, setDoc, onSnapshot } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

export const verificationRepositoryFirebase: VerificationRepository = {
  async getRequests(): Promise<VerificationRequest[]> {
    try {
      const colRef = collection(db, Collections.VERIFICATION_REQUESTS).withConverter(createConverter<VerificationRequest>());
      const snap = await getDocs(colRef);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async getRequestById(id: string): Promise<VerificationRequest | null> {
    try {
      const docRef = doc(db, Collections.VERIFICATION_REQUESTS, id).withConverter(createConverter<VerificationRequest>());
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async updateRequest(request: VerificationRequest): Promise<VerificationRequest> {
    try {
      const docRef = doc(db, Collections.VERIFICATION_REQUESTS, request.id).withConverter(createConverter<VerificationRequest>());
      await setDoc(docRef, request, { merge: true });
      return request;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  subscribeRequests(callback: (requests: VerificationRequest[]) => void): () => void {
    const colRef = collection(db, Collections.VERIFICATION_REQUESTS).withConverter(createConverter<VerificationRequest>());
    return onSnapshot(colRef, (snap) => {
      callback(snap.docs.map((d) => d.data()));
    });
  },
};

export default verificationRepositoryFirebase;
