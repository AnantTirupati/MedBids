import { User } from "@/types";

export interface UserRepository {
  getProfile(uid: string): Promise<User | null>;
  createProfile(profile: User): Promise<User>;
  updateProfile(uid: string, profile: Partial<User>): Promise<void>;
  deleteProfile(uid: string): Promise<void>;
  profileExists(uid: string): Promise<boolean>;
}
