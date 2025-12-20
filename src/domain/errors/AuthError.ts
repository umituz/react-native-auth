/**
 * Auth Error Classes
 * Domain-specific error types for authentication
 */

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string = "AUTH_ERROR",
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class AuthInitializationError extends AuthError {
  constructor(message: string = "Auth service not initialized") {
    super(message, "AUTH_INITIALIZATION_ERROR");
    this.name = "AuthInitializationError";
  }
}

export class AuthConfigurationError extends AuthError {
  constructor(message: string = "Invalid auth configuration") {
    super(message, "AUTH_CONFIGURATION_ERROR");
    this.name = "AuthConfigurationError";
  }
}

export class AuthValidationError extends AuthError {
  constructor(
    message: string = "Validation failed",
    public readonly field?: string,
  ) {
    super(message, "AUTH_VALIDATION_ERROR");
    this.name = "AuthValidationError";
  }
}

export class AuthNetworkError extends AuthError {
  constructor(message: string = "Network error") {
    super(message, "AUTH_NETWORK_ERROR");
    this.name = "AuthNetworkError";
  }
}

export class AuthUserNotFoundError extends AuthError {
  constructor(message: string = "User not found") {
    super(message, "AUTH_USER_NOT_FOUND");
    this.name = "AuthUserNotFoundError";
  }
}

export class AuthWrongPasswordError extends AuthError {
  constructor(message: string = "Wrong password") {
    super(message, "AUTH_WRONG_PASSWORD");
    this.name = "AuthWrongPasswordError";
  }
}

export class AuthEmailAlreadyInUseError extends AuthError {
  constructor(message: string = "Email already in use") {
    super(message, "AUTH_EMAIL_ALREADY_IN_USE");
    this.name = "AuthEmailAlreadyInUseError";
  }
}

export class AuthWeakPasswordError extends AuthError {
  constructor(message: string = "Password is too weak") {
    super(message, "AUTH_WEAK_PASSWORD");
    this.name = "AuthWeakPasswordError";
  }
}

export class AuthInvalidEmailError extends AuthError {
  constructor(message: string = "Invalid email address") {
    super(message, "AUTH_INVALID_EMAIL");
    this.name = "AuthInvalidEmailError";
  }
}
