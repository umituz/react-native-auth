# @umituz/react-native-auth

> Authentication service for React Native apps - Secure, type-safe, and production-ready. Provider-agnostic design with dependency injection, configurable validation, and comprehensive error handling.

[![npm version](https://badge.fury.io/js/%40umituz%2Freact-native-auth.svg)](https://www.npmjs.com/package/@umituz/react-native-auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔐 **Multiple Auth Methods** - Email/Password, Google, Apple, Anonymous
- 🎯 **Type-Safe** - Written in TypeScript with full type definitions
- 🏗️ **DDD Architecture** - Domain-Driven Design with clean separation of concerns
- 🔌 **Provider Agnostic** - Easy to swap auth providers (Firebase, custom backend, etc.)
- ⚡ **React Hooks** - Simple and intuitive React hooks for auth operations
- 🎨 **UI Components** - Pre-built authentication screens and components
- 📱 **React Native Ready** - Optimized for iOS and Android
- 🔒 **Secure** - Built-in validation and error handling

## Installation

```bash
npm install @umituz/react-native-auth
# or
yarn add @umituz/react-native-auth
```

## Peer Dependencies

```json
{
  "firebase": ">=11.0.0",
  "react": ">=18.2.0",
  "react-native": ">=0.74.0",
  "@tanstack/react-query": ">=5.0.0",
  "zustand": ">=4.0.0"
}
```

## Quick Start

### 1. Initialize Auth

Wrap your app with `AuthProvider` and initialize auth:

```typescript
import React, { useEffect } from 'react';
import { AuthProvider, initializeAuth } from '@umituz/react-native-auth';
import { getAuth } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Initialize auth (call once in app root)
initializeAuth({
  onAuthStateChanged: (user) => {
    console.log('Auth state changed:', user);
  },
});

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
```

### 2. Use Auth Hook

```typescript
import { useAuth } from '@umituz/react-native-auth';
import { View, Text, Button } from 'react-native';

function LoginScreen() {
  const { signIn, loading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn('user@example.com', 'password123');
      // Navigate to home
    } catch (err) {
      // Error is automatically set in error state
    }
  };

  return (
    <View>
      <Button onPress={handleLogin} disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
      {error && <Text>{error}</Text>}
    </View>
  );
}
```

### 3. Protect Routes

```typescript
import { useAuthRequired } from '@umituz/react-native-auth';

function ProtectedComponent() {
  const { isAllowed, checkAndRequireAuth } = useAuthRequired();

  const handleAction = () => {
    if (checkAndRequireAuth()) {
      // User is authenticated, proceed with action
      console.log('Action performed');
    }
    // If not authenticated, auth modal is shown automatically
  };

  return (
    <Button onPress={handleAction}>
      {isAllowed ? 'Perform Action' : 'Sign In to Continue'}
    </Button>
  );
}
```

## Social Login

### Google Sign-In

```typescript
import { useGoogleAuth } from '@umituz/react-native-auth';

function GoogleLoginButton() {
  const { signInWithGoogle, googleLoading } = useGoogleAuth({
    iosClientId: 'your-ios-client-id.apps.googleusercontent.com',
    webClientId: 'your-web-client-id.apps.googleusercontent.com',
  });

  return (
    <Button onPress={signInWithGoogle} disabled={googleLoading}>
      Sign in with Google
    </Button>
  );
}
```

### Apple Sign-In

```typescript
import { useAppleAuth } from '@umituz/react-native-auth';

function AppleLoginButton() {
  const { signInWithApple, appleLoading, appleAvailable } = useAppleAuth();

  if (!appleAvailable) return null;

  return (
    <Button onPress={signInWithApple} disabled={appleLoading}>
      Sign in with Apple
    </Button>
  );
}
```

## Pre-built Screens

Use pre-built authentication screens:

```typescript
import { LoginScreen, RegisterScreen, AccountScreen } from '@umituz/react-native-auth';

<Stack.Screen
  name="Login"
  component={LoginScreen}
  options={{ headerShown: false }}
/>
```

## User Profile

### Display Profile

```typescript
import { useUserProfile } from '@umituz/react-native-auth';

function ProfileHeader() {
  const profile = useUserProfile({
    accountRoute: '/account',
  });

  if (!profile) return <LoadingSpinner />;

  return (
    <View>
      <Avatar source={{ uri: profile.avatarUrl }} />
      <Text>{profile.displayName}</Text>
      {profile.isAnonymous && <Badge>Guest</Badge>}
    </View>
  );
}
```

### Update Profile

```typescript
import { useProfileUpdate } from '@umituz/react-native-auth';

function EditProfileScreen() {
  const { updateProfile, isUpdating } = useProfileUpdate();

  const handleSave = async (data) => {
    try {
      await updateProfile({
        displayName: data.name,
        photoURL: data.avatarUrl,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return <ProfileForm onSave={handleSave} loading={isUpdating} />;
}
```

## Account Management

### Delete Account

```typescript
import { useAccountManagement } from '@umituz/react-native-auth';

function AccountSettings() {
  const { deleteAccount, logout } = useAccountManagement({
    onReauthRequired: async () => {
      // Show re-authentication UI
      const result = await showReauthDialog();
      return result.success;
    },
  });

  return (
    <View>
      <Button onPress={logout}>Sign Out</Button>
      <Button onPress={deleteAccount}>Delete Account</Button>
    </View>
  );
}
```

## Validation

### Password Validation

```typescript
import {
  validatePasswordForRegister,
  validatePasswordConfirmation,
} from '@umituz/react-native-auth';

// Validate password
const result = validatePasswordForRegister('MyPass123!');

if (result.isValid) {
  console.log('Password is strong');
} else {
  console.log('Requirements:', result.requirements);
  // {
  //   hasMinLength: true,
  //   hasUppercase: true,
  //   hasLowercase: true,
  //   hasNumber: true,
  //   hasSpecialChar: true
  // }
}

// Validate password confirmation
const matchResult = validatePasswordConfirmation('pass123', 'pass123');
// { isValid: true, matches: true }
```

### Email Validation

```typescript
import { validateEmail } from '@umituz/react-native-auth';

const result = validateEmail('user@example.com');
// { isValid: true }
```

## Configuration

### Auth Config

```typescript
import { DEFAULT_AUTH_CONFIG } from '@umituz/react-native-auth';

const customConfig: AuthConfig = {
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
      iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    },
    apple: {
      enabled: Platform.OS === 'ios',
    },
  },
};
```

## Architecture

This package follows **Domain-Driven Design (DDD)** principles with clean architecture:

```
src/
├── domain/           # Business logic and entities
│   ├── entities/     # AuthUser, UserProfile
│   ├── value-objects/# AuthConfig, PasswordConfig
│   ├── errors/       # AuthError classes
│   └── utils/        # Domain utilities
├── application/      # Interfaces and ports
│   └── ports/        # IAuthService, IAuthProvider
├── infrastructure/   # External integrations
│   ├── providers/    # Firebase implementation
│   ├── services/     # AuthService, UserDocumentService
│   └── utils/        # Validation, storage adapters
└── presentation/     # UI layer
    ├── hooks/        # React hooks
    ├── components/   # React components
    ├── screens/      # Full screens
    ├── stores/       # State management (Zustand)
    └── navigation/   # Navigation setup
```

## API Reference

### Hooks

| Hook | Description |
|------|-------------|
| `useAuth` | Main auth state and operations |
| `useAuthRequired` | Check auth requirements |
| `useRequireAuth` | Get userId or throw |
| `useUserProfile` | Fetch user profile |
| `useProfileUpdate` | Update profile |
| `useProfileEdit` | Profile editing form state |
| `useAccountManagement` | Account operations |
| `useSocialLogin` | Social login management |
| `useGoogleAuth` | Google authentication |
| `useAppleAuth` | Apple authentication |
| `useAuthBottomSheet` | Auth bottom sheet management |

### Components

| Component | Description |
|-----------|-------------|
| `LoginForm` | Login form |
| `RegisterForm` | Registration form |
| `SocialLoginButtons` | Social login buttons |
| `PasswordStrengthIndicator` | Password strength visualizer |
| `PasswordMatchIndicator` | Password match indicator |
| `ProfileSection` | User profile display |
| `AccountActions` | Account action buttons |

### Services

| Service | Description |
|---------|-------------|
| `AuthService` | Main auth service |
| `initializeAuth` | Auth initialization |
| `UserDocumentService` | Firestore user documents |
| `AnonymousModeService` | Anonymous authentication |

## Documentation

- [Domain Layer](./src/domain/README.md) - Business logic and entities
- [Application Layer](./src/application/README.md) - Interfaces and ports
- [Infrastructure Layer](./src/infrastructure/README.md) - External integrations
- [Presentation Layer](./src/presentation/README.md) - UI components and hooks
- [Hooks Documentation](./src/presentation/hooks/README.md) - All hooks
- [Components Documentation](./src/presentation/components/README.md) - All components
- [Screens Documentation](./src/presentation/screens/README.md) - Pre-built screens
- [Services Documentation](./src/infrastructure/services/README.md) - Core services

## Examples

Check out the [examples](./examples) directory for complete implementations:

- [Basic Auth](./examples/basic-auth) - Simple email/password auth
- [Social Auth](./examples/social-auth) - Google and Apple sign-in
- [Protected Routes](./examples/protected-routes) - Route protection
- [Profile Management](./examples/profile-management) - User profile operations

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT © [Ümit UZ](https://github.com/umituz)

## Support

- 📧 Email: umit@umituz.com
- 🐦 Twitter: [@umituz](https://twitter.com/umituz)
- 💻 GitHub: [umituz/react-native-auth](https://github.com/umituz/react-native-auth)

## Related Packages

- [@umituz/react-native-firebase](https://github.com/umituz/react-native-firebase) - Firebase integration
- [@umituz/react-native-localization](https://github.com/umituz/react-native-localization) - Localization
- [@umituz/react-native-storage](https://github.com/umituz/react-native-storage) - Storage abstraction
- [@umituz/react-native-tanstack](https://github.com/umituz/react-native-tanstack) - TanStack Query integration

---

Made with ❤️ by [Ümit UZ](https://umituz.com)
