import { AdminRepository } from "./interfaces/admin.repository";
import { db, createConverter } from "@/lib/firebase/firestore";
import { VerificationRequest } from "@/types";
import { doc, getDocs, collection, setDoc } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

export const adminRepositoryFirebase: AdminRepository = {
  async getVerificationRequests(): Promise<VerificationRequest[]> {
    try {
      const colRef = collection(db, "verification_requests").withConverter(createConverter<VerificationRequest>());
      const snap = await getDocs(colRef);
      return snap.docs.map((d) => d.data());
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async updateVerificationRequest(request: VerificationRequest): Promise<VerificationRequest> {
    try {
      const docRef = doc(db, "verification_requests", request.id).withConverter(createConverter<VerificationRequest>());
      await setDoc(docRef, request, { merge: true });
      return request;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },
};

export default adminRepositoryFirebase;
