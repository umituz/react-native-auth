# AuthConfig & AuthError

Authentication configuration value objects and domain-specific error classes.

---

# AuthConfig

Authentication configuration value object containing password and social auth settings.

## Type Definitions

```typescript
import type {
  AuthConfig,
  PasswordConfig,
  SocialAuthConfig,
  GoogleAuthConfig,
  AppleAuthConfig,
  SocialAuthProvider,
  DEFAULT_AUTH_CONFIG,
  DEFAULT_PASSWORD_CONFIG,
  DEFAULT_SOCIAL_CONFIG,
} from '@umituz/react-native-auth';

interface PasswordConfig {
  minLength: number;          // Minimum password length
  requireUppercase: boolean;  // Require uppercase letter
  requireLowercase: boolean;  // Require lowercase letter
  requireNumber: boolean;     // Require number
  requireSpecialChar: boolean; // Require special character
}

interface GoogleAuthConfig {
  enabled?: boolean;          // Is enabled
  webClientId?: string;       // Web client ID
  iosClientId?: string;       // iOS client ID
  androidClientId?: string;   // Android client ID
}

interface AppleAuthConfig {
  enabled?: boolean;          // Is enabled (iOS only)
}

interface SocialAuthConfig {
  google?: GoogleAuthConfig;
  apple?: AppleAuthConfig;
}

interface AuthConfig {
  password: PasswordConfig;
  social?: SocialAuthConfig;
}

type SocialAuthProvider = 'google' | 'apple';
```

## Default Values

```typescript
import {
  DEFAULT_PASSWORD_CONFIG,
  DEFAULT_SOCIAL_CONFIG,
  DEFAULT_AUTH_CONFIG,
} from '@umituz/react-native-auth';

// Default password configuration
DEFAULT_PASSWORD_CONFIG;
// {
//   minLength: 6,
//   requireUppercase: false,
//   requireLowercase: false,
//   requireNumber: false,
//   requireSpecialChar: false,
// }

// Default social configuration
DEFAULT_SOCIAL_CONFIG;
// {
//   google: { enabled: false },
//   apple: { enabled: false },
// }

// Default auth configuration
DEFAULT_AUTH_CONFIG;
// {
//   password: DEFAULT_PASSWORD_CONFIG,
//   social: DEFAULT_SOCIAL_CONFIG,
// }
```

## Usage

### Custom Password Config

```typescript
const strictPasswordConfig: PasswordConfig = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

const authConfig: AuthConfig = {
  password: strictPasswordConfig,
};
```

### Social Auth Config

```typescript
const socialAuthConfig: SocialAuthConfig = {
  google: {
    enabled: true,
    webClientId: 'your-web-client-id.apps.googleusercontent.com',
    iosClientId: 'your-ios-client-id.apps.googleusercontent.com',
    androidClientId: 'your-android-client-id.apps.googleusercontent.com',
  },
  apple: {
    enabled: Platform.OS === 'ios',
  },
};

const authConfig: AuthConfig = {
  password: DEFAULT_PASSWORD_CONFIG,
  social: socialAuthConfig,
};
```

### Complete Configuration

```typescript
const productionAuthConfig: AuthConfig = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
  },
  social: {
    google: {
      enabled: true,
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
      iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
      androidClientId: Config.GOOGLE_ANDROID_CLIENT_ID,
    },
    apple: {
      enabled: Platform.OS === 'ios',
    },
  },
};
```

### Environment-Based Config

```typescript
import { DEFAULT_AUTH_CONFIG } from '@umituz/react-native-auth';

function getAuthConfig(): AuthConfig {
  if (__DEV__) {
    // Development: Weak password requirements
    return {
      password: {
        minLength: 6,
        requireUppercase: false,
        requireLowercase: false,
        requireNumber: false,
        requireSpecialChar: false,
      },
    };
  }

  // Production: Strict password requirements
  return {
    password: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecialChar: true,
    },
    social: {
      google: {
        enabled: true,
        webClientId: Config.GOOGLE_WEB_CLIENT_ID,
      },
    },
  };
}
```

### Config Validation

```typescript
function validatePasswordConfig(config: PasswordConfig): boolean {
  if (config.minLength < 4) {
    console.error('Minimum length must be at least 4');
    return false;
  }

  if (config.minLength > 128) {
    console.error('Minimum length must be at most 128');
    return false;
  }

  return true;
}

function validateAuthConfig(config: AuthConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!validatePasswordConfig(config.password)) {
    errors.push('Invalid password config');
  }

  if (config.social?.google?.enabled) {
    if (!config.social.google.webClientId) {
      errors.push('Google webClientId is required when enabled');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

---

# AuthError

Domain-specific error classes for authentication.

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
└── AuthInvalidEmailError
```

## Error Classes

### AuthError (Base)

```typescript
import { AuthError } from '@umituz/react-native-auth';

throw new AuthError('Authentication failed');
// { name: 'AuthError', message: 'Authentication failed', code: 'AUTH_ERROR' }
```

### AuthInitializationError

When auth service is not initialized:

```typescript
import { AuthInitializationError } from '@umituz/react-native-auth';

if (!authService) {
  throw new AuthInitializationError('Auth service not initialized');
}
```

### AuthConfigurationError

Invalid configuration:

```typescript
import { AuthConfigurationError } from '@umituz/react-native-auth';

if (!config.google.webClientId) {
  throw new AuthConfigurationError('Google webClientId is required');
}
```

### AuthValidationError

Validation error:

```typescript
import { AuthValidationError } from '@umituz/react-native-auth';

if (!email) {
  throw new AuthValidationError('Email is required', 'email');
}

if (password.length < 8) {
  throw new AuthValidationError('Password too short', 'password');
}
```

### AuthNetworkError

Network error:

```typescript
import { AuthNetworkError } from '@umituz/react-native-auth';

try {
  await signIn({ email, password });
} catch (error) {
  if (error.code === 'auth/network-request-failed') {
    throw new AuthNetworkError('No internet connection');
  }
}
```

### AuthUserNotFoundError

User not found:

```typescript
import { AuthUserNotFoundError } from '@umituz/react-native-auth';

try {
  await signIn({ email, password });
} catch (error) {
  if (error.code === 'auth/user-not-found') {
    throw new AuthUserNotFoundError('No user found with this email');
  }
}
```

### AuthWrongPasswordError

Wrong password:

```typescript
import { AuthWrongPasswordError } from '@umituz/react-native-auth';

try {
  await signIn({ email, password });
} catch (error) {
  if (error.code === 'auth/wrong-password') {
    throw new AuthWrongPasswordError('Incorrect password');
  }
}
```

### AuthEmailAlreadyInUseError

Email already in use:

```typescript
import { AuthEmailAlreadyInUseError } from '@umituz/react-native-auth';

try {
  await signUp({ email, password });
} catch (error) {
  if (error.code === 'auth/email-already-in-use') {
    throw new AuthEmailAlreadyInUseError('Email already registered');
  }
}
```

### AuthWeakPasswordError

Weak password:

```typescript
import { AuthWeakPasswordError } from '@umituz/react-native-auth';

try {
  await signUp({ email, password });
} catch (error) {
  if (error.code === 'auth/weak-password') {
    throw new AuthWeakPasswordError('Password is too weak');
  }
}
```

### AuthInvalidEmailError

Invalid email:

```typescript
import { AuthInvalidEmailError } from '@umituz/react-native-auth';

try {
  await signUp({ email, password });
} catch (error) {
  if (error.code === 'auth/invalid-email') {
    throw new AuthInvalidEmailError('Invalid email format');
  }
}
```

## Firebase Error Mapping

```typescript
import {
  AuthError,
  AuthUserNotFoundError,
  AuthWrongPasswordError,
  AuthEmailAlreadyInUseError,
  AuthWeakPasswordError,
  AuthInvalidEmailError,
  AuthNetworkError,
} from '@umituz/react-native-auth';

function mapFirebaseError(error: any): AuthError {
  const code = error.code;

  switch (code) {
    case 'auth/user-not-found':
      return new AuthUserNotFoundError('User not found');

    case 'auth/wrong-password':
      return new AuthWrongPasswordError('Incorrect password');

    case 'auth/email-already-in-use':
      return new AuthEmailAlreadyInUseError('Email already registered');

    case 'auth/weak-password':
      return new AuthWeakPasswordError('Password is too weak');

    case 'auth/invalid-email':
      return new AuthInvalidEmailError('Invalid email format');

    case 'auth/network-request-failed':
      return new AuthNetworkError('Network error');

    default:
      return new AuthError(error.message || 'Authentication failed');
  }
}

// Usage
try {
  await signInWithEmailAndPassword(auth, email, password);
} catch (error) {
  const authError = mapFirebaseError(error);
  throw authError;
}
```

## Error Handling Pattern

```typescript
async function handleSignIn(email: string, password: string) {
  try {
    await signIn({ email, password });
  } catch (error) {
    if (error instanceof AuthUserNotFoundError) {
      Alert.alert('Error', 'No user found with this email');
    } else if (error instanceof AuthWrongPasswordError) {
      Alert.alert('Error', 'Incorrect password');
    } else if (error instanceof AuthNetworkError) {
      Alert.alert('Error', 'Check your internet connection');
    } else if (error instanceof AuthError) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  }
}
```

## Error Type Guards

```typescript
function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

function isValidationError(error: unknown): error is AuthValidationError {
  return error instanceof AuthValidationError;
}

// Usage
try {
  await signUp({ email, password });
} catch (error) {
  if (isValidationError(error)) {
    console.log('Field:', error.field);
    console.log('Message:', error.message);
  }
}
```

## Error Localization

```typescript
import { getAuthErrorLocalizationKey } from '@umituz/react-native-auth';

function getErrorMessage(error: AuthError): string {
  const key = getAuthErrorLocalizationKey(error);
  return t(key); // Translate with i18n
}

// Usage
try {
  await signIn({ email, password });
} catch (error) {
  if (error instanceof AuthError) {
    const message = getErrorMessage(error);
    Alert.alert('Error', message);
  }
}
```

## Custom Errors

```typescript
import { AuthError } from '@umituz/react-native-auth';

class AuthTooManyAttemptsError extends AuthError {
  constructor(message = 'Too many failed attempts') {
    super(message, 'AUTH_TOO_MANY_ATTEMPTS');
    this.name = 'AuthTooManyAttemptsError';
  }
}

class AuthAccountLockedError extends AuthError {
  constructor(message = 'Account is locked') {
    super(message, 'AUTH_ACCOUNT_LOCKED');
    this.name = 'AuthAccountLockedError';
  }
}

// Usage
if (failedAttempts >= 5) {
  throw new AuthTooManyAttemptsError('Too many failed attempts. Please try again in 5 minutes.');
}
```

## Related Modules

- **[Domain](../README.md)** - Domain layer
- **[Infrastructure](../../infrastructure/README.md)** - Infrastructure implementation
- **[Validation Utils](../../infrastructure/utils/AuthValidation.ts)** - Validation utilities
