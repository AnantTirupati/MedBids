import { getAuth, connectAuthEmulator, PhoneAuthProvider, GoogleAuthProvider, RecaptchaVerifier } from "firebase/auth";
import { app } from "./client";

const auth = getAuth(app);

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
  const authUrl = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL || "http://localhost:9099";
  connectAuthEmulator(auth, authUrl, { disableWarnings: true });
}

export { auth, PhoneAuthProvider, GoogleAuthProvider, RecaptchaVerifier };
export default auth;
