# AuthConfig & AuthError

Configuration value objects and domain error classes.

---

## AuthConfig

Authentication configuration value object.

### Strategy

**Purpose**: Centralized configuration for password requirements and social auth providers.

**When to Use**:
- Configuring auth behavior
- Setting password policies
- Enabling social providers
- Environment-specific config

**Location**: `src/domain/valueObjects/AuthConfig.ts`

---

## Configuration Types

### PasswordConfig

**PURPOSE**: Password validation requirements

**PROPERTIES**:
- `minLength: number` - Minimum password length
- `requireUppercase: boolean` - Require uppercase letter
- `requireLowercase: boolean` - Require lowercase letter
- `requireNumber: boolean` - Require number
- `requireSpecialChar: boolean` - Require special character

**DEFAULT VALUES**:
- minLength: 6
- All requirements: false (lenient)

**Rules**:
- MUST set minLength between 4-128
- SHOULD enable requirements in production
- MUST validate password against config
- MUST NOT allow minLength < 4

**MUST NOT**:
- Set minLength < 4 (too weak)
- Set minLength > 128 (too long)
- Enable all requirements without UX consideration

---

### GoogleAuthConfig

**PURPOSE**: Google OAuth configuration

**PROPERTIES**:
- `enabled?: boolean` - Enable Google auth
- `webClientId?: string` - Web client ID
- `iosClientId?: string` - iOS client ID
- `androidClientId?: string` - Android client ID

**RULES**:
- MUST provide at least one client ID if enabled
- MUST use valid OAuth client IDs
- MUST match Firebase console
- MUST test before production

**MUST NOT**:
- Enable without client ID
- Use production keys in development
- Share client IDs across environments

---

### AppleAuthConfig

**PURPOSE**: Apple Sign-In configuration

**PROPERTIES**:
- `enabled?: boolean` - Enable Apple auth

**RULES**:
- MUST only enable on iOS
- MUST have Apple Developer account
- MUST configure in Firebase
- MUST follow Apple guidelines

**MUST NOT**:
- Enable on Android
- Enable on Web
- Require as only auth method (Apple rule)

---

### SocialAuthConfig

**PURPOSE**: Social auth provider configuration

**PROPERTIES**:
- `google?: GoogleAuthConfig` - Google settings
- `apple?: AppleAuthConfig` - Apple settings

**RULES**:
- MUST check platform availability
- MUST configure each provider separately
- MUST handle provider errors
- MUST respect platform constraints

**PLATFORM CONSTRAINTS**:
- Google: All platforms
- Apple: iOS only

---

### AuthConfig

**COMPLETE CONFIGURATION**:
```typescript
{
  password: PasswordConfig;
  social?: SocialAuthConfig;
}
```

**RULES**:
- MUST provide password config
- MAY provide social config
- MUST validate configuration
- MUST handle missing providers

---

## Configuration Strategy

### Environment-Based Config

**DEVELOPMENT**:
- Lenient password requirements
- May disable social auth
- Faster iterations

**PRODUCTION**:
- Strict password requirements
- Social auth enabled
- Security-focused

**Rules**:
- MUST use stricter config in production
- MUST test with production config
- MUST not use dev config in production
- MUST validate config on startup

---

### Config Validation

**VALIDATION RULES**:
- MUST check password config validity
- MUST verify social provider IDs
- MUST ensure platform compatibility
- MUST throw on invalid config

**ERRORS**:
- Invalid password config
- Missing required client IDs
- Platform incompatibility

---

## AuthError

Domain-specific error classes for authentication.

### Strategy

**Purpose**: Type-safe error handling with clear error types and user-friendly messages.

**When to Use**:
- Authentication failures
- Validation errors
- Network issues
- Configuration problems

**Location**: `src/domain/errors/AuthError.ts`

---

## Error Hierarchy

```
AuthError (base)
├── AuthInitializationError
├── AuthConfigurationError
├── AuthValidationError
├── AuthNetworkError
├── AuthUserNotFoundError
├── AuthWrongPasswordError
├── AuthEmailAlreadyInUseError
├── AuthWeakPasswordError
�── AuthInvalidEmailError
```

---

## Error Types

### AuthError (Base)

**PURPOSE**: Base authentication error

**RULES**:
- MUST extend for specific errors
- MUST include error message
- MUST have error code
- MUST be catchable

**PROPERTIES**:
- `message: string` - Error message
- `code: string` - Error code
- `name: string` - Error name

---

### AuthUserNotFoundError

**PURPOSE**: User not found error

**WHEN THROWN**: Email not found during sign in

**Rules**:
- MUST indicate user not found
- MUST not reveal if email exists
- MUST suggest registration

**USER MESSAGE**: "No user found with this email"

---

### AuthWrongPasswordError

**PURPOSE**: Incorrect password error

**WHEN THROWN**: Wrong password during sign in

**Rules**:
- MUST indicate wrong password
- MUST not reveal password
- MUST allow retry

**USER MESSAGE**: "Incorrect password"

---

### AuthEmailAlreadyInUseError

**PURPOSE**: Email already registered

**WHEN THROWN**: Email exists during sign up

**Rules**:
- MUST indicate email taken
- MUST suggest sign in
- MUST offer password reset

**USER MESSAGE**: "Email already registered"

---

### AuthWeakPasswordError

**PURPOSE**: Password too weak

**WHEN THROWN**: Password doesn't meet requirements

**Rules**:
- MUST indicate weak password
- MUST show requirements
- MUST suggest stronger password

**USER MESSAGE**: "Password does not meet requirements"

---

### AuthInvalidEmailError

**PURPOSE**: Invalid email format

**WHEN THROWN**: Email validation fails

**Rules**:
- MUST indicate invalid email
- MUST suggest valid format
- MUST not accept malformed email

**USER MESSAGE**: "Invalid email format"

---

### AuthNetworkError

**PURPOSE**: Network connection failure

**WHEN THROWN**: Network request fails

**Rules**:
- MUST indicate network problem
- MUST suggest checking connection
- MUST allow retry

**USER MESSAGE**: "Network error. Please check your connection"

---

## Error Handling

### Error Mapping

**FIREBASE TO DOMAIN ERRORS**:
- `auth/user-not-found` → AuthUserNotFoundError
- `auth/wrong-password` → AuthWrongPasswordError
- `auth/email-already-in-use` → AuthEmailAlreadyInUseError
- `auth/weak-password` → AuthWeakPasswordError
- `auth/invalid-email` → AuthInvalidEmailError
- `auth/network-request-failed` → AuthNetworkError

**RULES**:
- MUST map Firebase errors to domain errors
- MUST preserve error context
- MUST throw domain errors (not Firebase)
- MUST handle unknown errors

---

### Error Type Guards

**PURPOSE**: Type-safe error checking

**FUNCTIONS**:
- `isAuthError(error)` - Check if AuthError
- `isValidationError(error)` - Check if validation error

**RULES**:
- MUST use for type narrowing
- MUST check before error handling
- MUST use in catch blocks

---

### User Messages

**STRATEGY**: User-friendly error messages

**RULES**:
- MUST be clear and simple
- MUST avoid technical jargon
- MUST suggest resolution
- MUST not expose system details

**MUST NOT**:
- Expose error codes
- Show stack traces
- Reveal sensitive information
- Use technical language

---

## Configuration Defaults

### Default Password Config

**MINIMAL SECURITY**:
- minLength: 6
- All requirements: false

**USE CASE**: Development/testing only

---

### Default Social Config

**DISABLED BY DEFAULT**:
- google: { enabled: false }
- apple: { enabled: false }

**USE CASE**: Explicit enable required

---

### Default Auth Config

**COMBINATION**:
- password: DEFAULT_PASSWORD_CONFIG
- social: DEFAULT_SOCIAL_CONFIG

**USE CASE**: Starting configuration

---

## Related Entities

- **AuthUser** (`./entities/AuthUser.md`) - User entity
- **UserProfile** (`./entities/UserProfile.md`) - Profile entity

## Related Infrastructure

- **AuthValidation** (`../../infrastructure/utils/AuthValidation.ts`) - Validation utilities
- **AuthService** (`../../infrastructure/services/AuthService.ts`) - Auth operations
