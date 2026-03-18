---
name: setup-react-native-auth
description: Sets up @umituz/react-native-auth in React Native or Expo apps with automated installation, configuration, and authentication setup. Triggers on: Setup auth, initialize auth, authentication setup, install auth, auth configuration, login setup, AuthProvider, useAuth, Firebase auth, social auth, Apple authentication, Google Sign-In.
---

# Setup React Native Auth

Comprehensive automated setup for `@umituz/react-native-auth` package with complete authentication integration.

## Overview

This skill handles everything needed to integrate authentication into your React Native or Expo app:
- Package installation and updates
- Peer dependency management
- AuthProvider configuration
- Firebase authentication integration
- Social auth setup (Apple, Google)
- Navigation integration
- Native setup for bare React Native

## Quick Start

Just say: **"Setup authentication in my app"** and this skill will handle everything.

**Features Included:**
- Email/password authentication
- Anonymous authentication
- Apple Sign-In (iOS)
- Google Sign-In (iOS/Android)
- Authentication state management (Zustand)
- Protected routes and auth guards

## When to Use

Invoke this skill when you need to:
- Install @umituz/react-native-auth in a new project
- Update existing installation to latest version
- Set up authentication providers
- Configure social auth (Apple, Google)
- Add auth guards to protected screens
- Integrate authentication with navigation

## Step 1: Analyze the Project

Before installing, understand the project structure:

### Check package.json

Analyze project's `package.json` to determine current state:

```bash
# Check if package is already installed
cat package.json | grep "@umituz/react-native-auth"

# Check current version if installed
npm list @umituz/react-native-auth
```

### Detect Project Type

Determine if this is Expo or bare React Native:

```bash
# Check for Expo
cat app.json | grep -q "expo" && echo "Expo project" || echo "Bare React Native"

# Check for native folders (bare React Native)
ls -d ios android 2>/dev/null && echo "Has native folders"
```

### Find App Entry Point

Look for these files in order of priority:
1. `app/_layout.tsx` (Expo Router)
2. `app/_layout.ts`
3. `App.tsx` (standard entry)
4. `App.js`
5. `index.tsx`
6. `index.js`

This is where AuthProvider will be added.

## Step 2: Install Package

### Install or Update

```bash
# If not installed, install latest
npm install @umituz/react-native-auth@latest

# If already installed but outdated
npm install @umituz/react-native-auth@latest
```

### Install Core Peer Dependencies

Always install these required dependencies:

```bash
# Required Firebase package
npm install @umituz/react-native-firebase

# Design system
npm install @umituz/react-native-design-system

# State management
npm install @tanstack/react-query zustand

# Firebase SDK
npm install firebase
```

### Install Expo Auth Dependencies

For Expo projects, install these Expo modules:

```bash
npx expo install expo-apple-authentication expo-auth-session expo-web-browser expo-crypto
```

### Install Navigation Dependencies

If using React Navigation:

```bash
npm install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
```

## Step 3: Configure AuthProvider

### For Expo Router (app/_layout.tsx)

Wrap your app with AuthProvider:

```typescript
import { AuthProvider } from '@umituz/react-native-auth';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Your fonts here
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack>
        {/* your screens */}
      </Stack>
    </AuthProvider>
  );
}
```

### For Standard App.tsx

```typescript
import { AuthProvider } from '@umituz/react-native-auth';

export default function App() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
```

### Check If Already Configured

Before adding, verify AuthProvider doesn't exist:

```bash
grep -r "AuthProvider" app/ App.tsx 2>/dev/null
```

If found, skip this step.

## Step 4: Initialize Firebase Auth

**Important:** Firebase must be initialized before auth can work. If you haven't set up Firebase yet:

```bash
# Use the Firebase setup skill first
npx skills add /path/to/react-native-firebase/skills/SKILL.md
```

Or manually initialize Firebase:

```typescript
import { autoInitializeFirebase } from '@umituz/react-native-firebase';

useEffect(() => {
  autoInitializeFirebase();
}, []);
```

The AuthProvider will automatically connect to Firebase once it's initialized.

## Step 5: Set Up Authentication Screens

### Create Login Screen

```typescript
import { useLoginForm } from '@umituz/react-native-auth';
import { TextInput, Button, View, Text } from 'react-native';

export function LoginScreen() {
  const { email, setEmail, password, setPassword, isLoading, handleLogin, error } = useLoginForm();

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <Button
        title={isLoading ? "Loading..." : "Sign In"}
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
}
```

### Create Register Screen

```typescript
import { useRegisterForm } from '@umituz/react-native-auth';

export function RegisterScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    handleRegister,
    error
  } = useRegisterForm();

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <Button
        title={isLoading ? "Creating account..." : "Create Account"}
        onPress={handleRegister}
        disabled={isLoading}
      />
    </View>
  );
}
```

## Step 6: Add Social Authentication (Optional)

### Apple Sign-In Setup

For iOS, add Apple Sign-In capability:

1. In Xcode: Enable "Sign in with Apple"
2. In Firebase Console: Enable Apple Sign-In provider

```typescript
import { useSocialAuth } from '@umituz/react-native-auth';

export function LoginScreen() {
  const { signInWithApple } = useSocialAuth();

  return (
    <Button
      title="Sign in with Apple"
      onPress={signInWithApple}
    />
  );
}
```

### Google Sign-In Setup

For Android and iOS:

```typescript
import { useSocialAuth } from '@umituz/react-native-auth';

export function LoginScreen() {
  const { signInWithGoogle } = useSocialAuth();

  return (
    <Button
      title="Sign in with Google"
      onPress={signInWithGoogle}
    />
  );
}
```

## Step 7: Add Auth Guards (Optional)

### Protect Routes

```typescript
import { useAuth } from '@umituz/react-native-auth';
import { useRouter } from 'expo-router';

export function ProtectedScreen() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <View>
      <Text>Welcome, {user.email}</Text>
    </View>
  );
}
```

### Create Auth Hook

```typescript
import { useAuth } from '@umituz/react-native-auth';

export function useAuthRequired() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    throw new Promise(() => {}); // Suspend while loading
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  return { user };
}
```

## Step 8: Native Setup (Bare React Native Only)

### iOS Setup

```bash
cd ios && pod install && cd ..
```

**Important:** Enable "Sign in with Apple" in Xcode:
1. Open `ios/YourProject.xcworkspace`
2. Select target → Signing & Capabilities
3. Click "+ Capability" → Add "Sign in with Apple"

### Android Setup

No additional setup needed for basic auth.

For Google Sign-In, add SHA-1 fingerprint to Firebase Console:

```bash
# Debug key
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Release key (if you have one)
keytool -list -v -keystore path/to/release.keystore
```

## Step 9: Verify Setup

### Run the App

```bash
# For Expo
npx expo start

# For bare React Native
npx react-native run-ios
# or
npx react-native run-android
```

### Verification Checklist

- ✅ AuthProvider wraps the app
- ✅ Firebase is initialized
- ✅ Login screen works
- ✅ Register screen works
- ✅ User can sign in with email/password
- ✅ User can sign out
- ✅ Auth state persists across app restarts
- ✅ Social auth works (if configured)

### Expected Behavior

1. User opens app → Not authenticated → Redirected to login
2. User registers → Account created → Logged in automatically
3. User logs in → Auth state updates → Redirected to home
4. User closes and reopens app → Still logged in
5. User logs out → Auth state cleared → Redirected to login

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Forgetting peer dependencies | Always install `@umituz/react-native-firebase`, `@umituz/react-native-design-system`, `zustand`, `@tanstack/react-query` |
| Not wrapping with AuthProvider | AuthProvider must wrap the entire app |
| Firebase not initialized | Call `autoInitializeFirebase()` before or during app start |
| Missing Apple Sign-In capability | Enable "Sign in with Apple" in Xcode capabilities |
| Auth state not persisting | Check Firebase auth persistence is enabled (default) |
| Navigation outside AuthProvider | Move navigation inside AuthProvider wrapper |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"AuthProvider not found"** | Ensure `@umituz/react-native-auth` is installed and imported correctly |
| **"Firebase not initialized"** | Call `autoInitializeFirebase()` before AuthProvider mounts |
| **"Sign in with Apple fails"** | Enable capability in Xcode and Firebase Console |
| **"Auth state not persisting"** | Check Firebase auth persistence settings (should be enabled by default) |
| **"User not authenticated after login"** | Check that AuthProvider wraps the navigation component |
| **"Social auth not working"** | Verify provider is enabled in Firebase Console |

## Authentication Features

### Included Hooks

- `useAuth()` - Access auth state and methods
- `useLoginForm()` - Login form state and handler
- `useRegisterForm()` - Register form state and handler
- `useSocialAuth()` - Social auth methods (Apple, Google)
- `useAuthRequired()` - Guard hook for protected screens

### Auth State

```typescript
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Usage
const { user, isLoading, isAuthenticated } = useAuth();
```

### Available Methods

- `signIn(email, password)` - Sign in with email/password
- `register(email, password)` - Create new account
- `signInAnonymously()` - Anonymous authentication
- `signInWithApple()` - Apple Sign-In
- `signInWithGoogle()` - Google Sign-In
- `signOut()` - Sign out user
- `deleteAccount()` - Delete user account
- `reloadUser()` - Reload user data

## Summary

After setup, provide:

1. ✅ Package version installed
2. ✅ Dependencies added (core + auth + navigation)
3. ✅ AuthProvider location
4. ✅ Firebase initialization status
5. ✅ Authentication screens created
6. ✅ Social auth configured (if applicable)
7. ✅ Verification status (all checks passing)

---

**Compatible with:** @umituz/react-native-auth@latest
**Platforms:** React Native (Expo & Bare)
**Dependencies:** Requires @umituz/react-native-firebase and Firebase configured
