import { UserRepository } from "./interfaces/user.repository";
import { db, createConverter } from "@/lib/firebase/firestore";
import { Collections } from "@/constants/firestore";
import { User } from "@/types";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { mapFirebaseError } from "@/lib/firebase/errors";

export const userRepositoryFirebase: UserRepository = {
  async getProfile(uid: string): Promise<User | null> {
    try {
      const docRef = doc(db, Collections.USERS, uid).withConverter(createConverter<User>());
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async createProfile(profile: User): Promise<User> {
    try {
      const docRef = doc(db, Collections.USERS, profile.id).withConverter(createConverter<User>());
      await setDoc(docRef, profile);
      return profile;
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async updateProfile(uid: string, profile: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, Collections.USERS, uid).withConverter(createConverter<User>());
      await updateDoc(docRef, profile as Record<string, unknown>);
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async deleteProfile(uid: string): Promise<void> {
    try {
      const docRef = doc(db, Collections.USERS, uid);
      await deleteDoc(docRef);
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },

  async profileExists(uid: string): Promise<boolean> {
    try {
      const docRef = doc(db, Collections.USERS, uid);
      const snap = await getDoc(docRef);
      return snap.exists();
    } catch (err) {
      throw mapFirebaseError(err);
    }
  },
};

export default userRepositoryFirebase;
