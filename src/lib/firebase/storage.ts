import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL as getFbDownloadUrl,
  deleteObject,
  connectStorageEmulator,
} from "firebase/storage";
import { app } from "./client";
import { StorageFolders } from "@/constants/storage";

const storage = getStorage(app);

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
  const host = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_HOST || "localhost";
  const port = parseInt(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_EMULATOR_PORT || "9199", 10);
  connectStorageEmulator(storage, host, port);
}

export const storageHelper = {
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getFbDownloadUrl(storageRef);
  },

  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },

  async getDownloadURL(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return getFbDownloadUrl(storageRef);
  },

  generateStoragePath(folder: StorageFolders | "prescriptions" | "licenses" | "avatars", fileName: string): string {
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.]/g, "_");
    return `${folder}/${timestamp}_${cleanFileName}`;
  },
};

export { storage };
export default storage;
