const isDev = process.env.NODE_ENV === "development";

export const logger = {
  log(...args: unknown[]): void {
    if (isDev) {
      console.log("[MedBids]", ...args);
    }
  },
  warn(...args: unknown[]): void {
    if (isDev) {
      console.warn("[MedBids Warning]", ...args);
    }
  },
  error(...args: unknown[]): void {
    console.error("[MedBids Error]", ...args);
  },
};

export default logger;
