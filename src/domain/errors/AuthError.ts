/**
 * Auth Error Types
 * Domain-specific error classes for authentication operations
 */

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "AuthError";
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class AuthInitializationError extends AuthError {
  constructor(message: string = "Firebase Auth is not initialized") {
    super(message, "AUTH_NOT_INITIALIZED");
    this.name = "AuthInitializationError";
    Object.setPrototypeOf(this, AuthInitializationError.prototype);
  }
}

export class AuthConfigurationError extends AuthError {
  constructor(message: string = "Invalid auth configuration") {
    super(message, "AUTH_CONFIG_ERROR");
    this.name = "AuthConfigurationError";
    Object.setPrototypeOf(this, AuthConfigurationError.prototype);
  }
}

export class AuthValidationError extends AuthError {
  constructor(message: string, public field?: string) {
    super(message, "AUTH_VALIDATION_ERROR");
    this.name = "AuthValidationError";
    Object.setPrototypeOf(this, AuthValidationError.prototype);
  }
}

export class AuthNetworkError extends AuthError {
  constructor(message: string = "Network error during authentication") {
    super(message, "AUTH_NETWORK_ERROR");
    this.name = "AuthNetworkError";
    Object.setPrototypeOf(this, AuthNetworkError.prototype);
  }
}

export class AuthUserNotFoundError extends AuthError {
  constructor(message: string = "User not found") {
    super(message, "AUTH_USER_NOT_FOUND");
    this.name = "AuthUserNotFoundError";
    Object.setPrototypeOf(this, AuthUserNotFoundError.prototype);
  }
}

export class AuthWrongPasswordError extends AuthError {
  constructor(message: string = "Wrong password") {
    super(message, "AUTH_WRONG_PASSWORD");
    this.name = "AuthWrongPasswordError";
    Object.setPrototypeOf(this, AuthWrongPasswordError.prototype);
  }
}

export class AuthEmailAlreadyInUseError extends AuthError {
  constructor(message: string = "Email already in use") {
    super(message, "AUTH_EMAIL_ALREADY_IN_USE");
    this.name = "AuthEmailAlreadyInUseError";
    Object.setPrototypeOf(this, AuthEmailAlreadyInUseError.prototype);
  }
}

export class AuthWeakPasswordError extends AuthError {
  constructor(message: string = "Password is too weak") {
    super(message, "AUTH_WEAK_PASSWORD");
    this.name = "AuthWeakPasswordError";
    Object.setPrototypeOf(this, AuthWeakPasswordError.prototype);
  }
}

export class AuthInvalidEmailError extends AuthError {
  constructor(message: string = "Invalid email address") {
    super(message, "AUTH_INVALID_EMAIL");
    this.name = "AuthInvalidEmailError";
    Object.setPrototypeOf(this, AuthInvalidEmailError.prototype);
  }
}

