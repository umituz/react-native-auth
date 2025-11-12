# @umituz/react-native-auth

Firebase Authentication wrapper for React Native apps - Secure, type-safe, and production-ready.

Built with **SOLID**, **DRY**, and **KISS** principles.

## Installation

```bash
npm install @umituz/react-native-auth
```

## Peer Dependencies

- `firebase` >= 11.0.0
- `react` >= 18.2.0
- `react-native` >= 0.74.0
- `@umituz/react-native-firebase-auth` >= 1.0.0 (for Firebase Auth initialization)

## Features

- ✅ Domain-Driven Design (DDD) architecture
- ✅ SOLID principles (Single Responsibility, Open/Closed, etc.)
- ✅ DRY (Don't Repeat Yourself)
- ✅ KISS (Keep It Simple, Stupid)
- ✅ **Security**: Password validation, email validation, error handling
- ✅ Type-safe operations
- ✅ Guest mode support
- ✅ React hooks for easy integration
- ✅ Works with Expo and React Native CLI

## Important: Security First

**This package prioritizes security:**

- Password strength validation
- Email format validation
- Secure error handling (no sensitive data exposure)
- Firebase Auth best practices
- Guest mode support for offline-first apps

## Usage

### 1. Initialize Auth Service

Initialize the service early in your app (e.g., in `App.tsx`):

```typescript
import { initializeAuthService } from '@umituz/react-native-auth';
import { getFirebaseAuth } from '@umituz/react-native-firebase-auth';

// Initialize Firebase App first (using @umituz/react-native-firebase)
// Then initialize Firebase Auth (using @umituz/react-native-firebase-auth)
const auth = getFirebaseAuth();

// Initialize auth service
initializeAuthService(auth, {
  minPasswordLength: 6,
  requireUppercase: false,
  requireLowercase: false,
  requireNumbers: false,
  requireSpecialChars: false,
  onUserCreated: async (user) => {
    // Optional: Create user profile in your database
    console.log('User created:', user.uid);
  },
  onSignOut: async () => {
    // Optional: Cleanup on sign out
    console.log('User signed out');
  },
});
```

### 2. Use Auth Hook in Components

```typescript
import { useAuth } from '@umituz/react-native-auth';

function LoginScreen() {
  const { user, isAuthenticated, isGuest, loading, signIn, signUp, signOut, continueAsGuest } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <HomeScreen user={user} />;
  }

  if (isGuest) {
    return <GuestHomeScreen />;
  }

  return <LoginForm onSignIn={signIn} onSignUp={signUp} onContinueAsGuest={continueAsGuest} />;
}
```

### 3. Sign Up

```typescript
import { getAuthService } from '@umituz/react-native-auth';

const authService = getAuthService();

try {
  const user = await authService.signUp({
    email: 'user@example.com',
    password: 'securepassword123',
    displayName: 'John Doe',
  });
  console.log('User signed up:', user.uid);
} catch (error) {
  if (error instanceof AuthEmailAlreadyInUseError) {
    console.error('Email already in use');
  } else if (error instanceof AuthWeakPasswordError) {
    console.error('Password is too weak');
  } else {
    console.error('Sign up failed:', error.message);
  }
}
```

### 4. Sign In

```typescript
try {
  const user = await authService.signIn({
    email: 'user@example.com',
    password: 'securepassword123',
  });
  console.log('User signed in:', user.uid);
} catch (error) {
  if (error instanceof AuthWrongPasswordError) {
    console.error('Wrong password');
  } else if (error instanceof AuthUserNotFoundError) {
    console.error('User not found');
  } else {
    console.error('Sign in failed:', error.message);
  }
}
```

### 5. Sign Out

```typescript
await authService.signOut();
```

### 6. Guest Mode

```typescript
await authService.setGuestMode();
```

## API

### Functions

- `initializeAuthService(auth, config?)`: Initialize auth service with Firebase Auth instance
- `getAuthService()`: Get auth service instance (throws if not initialized)
- `resetAuthService()`: Reset service instance (useful for testing)

### Hook

- `useAuth()`: React hook for authentication state management

### Types

- `AuthConfig`: Configuration interface
- `SignUpParams`: Sign up parameters
- `SignInParams`: Sign in parameters
- `UseAuthResult`: Hook return type

### Errors

- `AuthError`: Base error class
- `AuthInitializationError`: Initialization errors
- `AuthConfigurationError`: Configuration errors
- `AuthValidationError`: Validation errors
- `AuthNetworkError`: Network errors
- `AuthUserNotFoundError`: User not found
- `AuthWrongPasswordError`: Wrong password
- `AuthEmailAlreadyInUseError`: Email already in use
- `AuthWeakPasswordError`: Weak password
- `AuthInvalidEmailError`: Invalid email

## Security Best Practices

1. **Password Validation**: Configure password requirements based on your app's security needs
2. **Error Handling**: Always handle errors gracefully without exposing sensitive information
3. **Guest Mode**: Use guest mode for offline-first apps that don't require authentication
4. **User Callbacks**: Use `onUserCreated` and `onSignOut` callbacks for app-specific logic

## Integration with Firebase Packages

This package works seamlessly with Firebase initialization packages:

```typescript
import { initializeFirebase } from '@umituz/react-native-firebase';
import { initializeFirebaseAuth, getFirebaseAuth } from '@umituz/react-native-firebase-auth';
import { initializeAuthService } from '@umituz/react-native-auth';

// 1. Initialize Firebase App
const config = {
  apiKey: 'your-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
};
initializeFirebase(config);

// 2. Initialize Firebase Auth
initializeFirebaseAuth();

// 3. Initialize Auth Service (business logic)
const auth = getFirebaseAuth();
initializeAuthService(auth, {
  minPasswordLength: 6,
  // ... other config
});
```

**Note:** This package is provider-agnostic. While it currently uses Firebase Auth, it can be easily adapted to work with Supabase or other authentication providers in the future.

## License

MIT

