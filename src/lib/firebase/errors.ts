export class ApplicationError extends Error {
  public code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
  }
}

export class AuthenticationError extends ApplicationError {}
export class PermissionDeniedError extends ApplicationError {}
export class NetworkError extends ApplicationError {}
export class UploadFailedError extends ApplicationError {}
export class DocumentNotFoundError extends ApplicationError {}
export class ValidationError extends ApplicationError {}

export function mapFirebaseError(error: unknown): Error {
  if (error instanceof ApplicationError) {
    return error;
  }

  const errObj = error as { message?: string; code?: string };
  const message = errObj?.message || "An unknown error occurred";
  const code = errObj?.code;

  switch (code) {
    case "auth/invalid-email":
    case "auth/user-disabled":
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return new AuthenticationError(message, code);
    case "permission-denied":
      return new PermissionDeniedError("You do not have permission to perform this action.", code);
    case "unavailable":
      return new NetworkError("The service is temporarily unavailable. Please check your internet connection.", code);
    case "not-found":
      return new DocumentNotFoundError("The requested document was not found.", code);
    default:
      if (message.toLowerCase().includes("upload") || message.toLowerCase().includes("storage")) {
        return new UploadFailedError(message, code);
      }
      return new ApplicationError(message, code);
  }
}
