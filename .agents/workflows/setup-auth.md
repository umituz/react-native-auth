---
description: Sets up or updates the @umituz/react-native-auth package in a React Native app.
---

# Auth Module Setup Skill

When this workflow/skill is invoked, follow these explicit instructions to configure `@umituz/react-native-auth`.

## Step 1: Check and Update `package.json`
- Locate the project's `package.json`.
- Check if `@umituz/react-native-auth` is installed.
  - If missing: Install with `npm install @umituz/react-native-auth`.
  - If outdated: Update it to the latest version.

## Step 2: Ensure Peer Dependencies
This module strictly requires the Firebase package and other navigation/UI primitives. Check and install missing peer dependencies (use `npx expo install` for Expo):
- `@umituz/react-native-firebase`
- `@umituz/react-native-design-system`
- `@tanstack/react-query` & `zustand`
- `firebase`
- `expo-apple-authentication`, `expo-auth-session`, `expo-web-browser`, `expo-crypto`
- `@react-navigation/native` & `@react-navigation/stack`

// turbo
## Step 3: Run Pod Install (If bare React Native)
If targeting iOS and `ios/` folder is present, run:
```bash
cd ios && pod install
```

## Step 4: Inject Global Auth Provider
- Locate the main entry file (`App.tsx`, `app/_layout.tsx`, etc.).
- Import `AuthProvider` and `initializeAuth` (or `createAuthInitModule`) from `@umituz/react-native-auth`.
- Ensure the app component tree is wrapped in `<AuthProvider>`.
- Make sure that Firebase has been initialized first or initialized simultaneously, and then `initializeAuth` is called to bind the auth store to the Firebase driver.
  ```tsx
  import { AuthProvider } from '@umituz/react-native-auth';

  export default function App() {
    return (
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
    );
  }
  ```

## Step 5: Summary
Summarize the action: list which packages were upgraded/installed and the entry files modified to inject the `<AuthProvider>`.
