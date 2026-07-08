export function validateEnv() {
  if (typeof window !== "undefined") return; // Run server-side only

  const required = [
    "NEXT_PUBLIC_USE_FIREBASE",
  ];

  const firebaseRequired = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ];

  const missing: string[] = [];

  required.forEach((key) => {
    if (!process.env[key]) missing.push(key);
  });

  if (process.env.NEXT_PUBLIC_USE_FIREBASE === "firebase") {
    firebaseRequired.forEach((key) => {
      if (!process.env[key]) missing.push(key);
    });
  }

  if (missing.length > 0) {
    console.warn(`[EnvValidator] WARNING: Missing environment configuration keys: ${missing.join(", ")}`);
  } else {
    console.log("[EnvValidator] Environment configuration validated successfully.");
  }
}

export default validateEnv;
