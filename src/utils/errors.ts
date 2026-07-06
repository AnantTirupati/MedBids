export class AppError extends Error {
  public code: string;
  public statusCode: number;

  constructor(message: string, code = "APP_ERROR", statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(message = "Network connection failed. Please try again.") {
    super(message, "NETWORK_ERROR", 503);
  }
}

export class UploadFailedError extends AppError {
  constructor(message = "Failed to upload prescription document.") {
    super(message, "UPLOAD_FAILED", 422);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Requested resource not found.") {
    super(message, "NOT_FOUND", 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "You are not authorized to access this resource.") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid parameters provided.") {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class AuctionClosedError extends AppError {
  constructor(message = "This auction is closed and no longer accepting bids.") {
    super(message, "AUCTION_CLOSED", 410);
  }
}
