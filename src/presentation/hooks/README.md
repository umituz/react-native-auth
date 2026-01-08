# Auth Hooks

Collection of custom React hooks for the React Native Auth package. These hooks manage authentication operations and state.

## Available Hooks

### Core Hooks
- **[`useAuth`](./useAuth.md)** - Main authentication state and operations
- **[`useAuthRequired`](./useAuthRequired.md)** - For components requiring auth
- **[`useRequireAuth`](./useRequireAuth.md)** - Alternative hook for route protection

### User Profile Hooks
- **[`useUserProfile`](./useUserProfile.md)** - Fetch user profile data
- **[`useProfileUpdate`](./useProfileUpdate.md)** - Profile update operations
- **[`useProfileEdit`](./useProfileEdit.md)** - Profile editing form state

### Account Management Hooks
- **[`useAccountManagement`](./useAccountManagement.md)** - Account deletion, logout, etc.

### Social Login Hooks
- **[`useSocialLogin`](./useSocialLogin.md)** - General social login management
- **[`useGoogleAuth`](./useSocialLogin.md#usegoogleauth)** - Google sign-in
- **[`useAppleAuth`](./useSocialLogin.md#useappleauth)** - Apple sign-in

### Form Hooks
- **[`useLoginForm`](./useLoginForm.md)** - Login form state management
- **[`useRegisterForm`](./useRegisterForm.md)** - Registration form state management

### UI Hooks
- **[`useAuthBottomSheet`](./useAuthBottomSheet.md)** - Auth bottom sheet management

### Mutation Hooks
- **[`useAuthMutations`](./mutations/useAuthMutations.md)** - Auth mutation operations

## Usage

```typescript
import {
  useAuth,
  useUserProfile,
  useSocialLogin
} from '@umituz/react-native-auth';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();
  const { profile, isLoading } = useUserProfile();
  const { signInWithGoogle } = useSocialLogin();

  // ...
}
```

## Hooks Documentation

See each hook's documentation for detailed usage information and examples.

## Quick Reference

| Hook | Purpose | Returns |
|------|---------|---------|
| `useAuth` | Main auth state | `UseAuthResult` |
| `useAuthRequired` | Check auth + show modal | `UseAuthRequiredResult` |
| `useRequireAuth` | Get userId or throw | `string` |
| `useUserProfile` | Fetch profile data | `UserProfileData \| undefined` |
| `useProfileUpdate` | Update profile | `UseProfileUpdateReturn` |
| `useProfileEdit` | Edit profile form | `UseProfileEditReturn` |
| `useAccountManagement` | Account operations | `UseAccountManagementReturn` |
| `useSocialLogin` | Social login | `UseSocialLoginResult` |
| `useGoogleAuth` | Google auth | `UseGoogleAuthResult` |
| `useAppleAuth` | Apple auth | `UseAppleAuthResult` |
| `useAuthBottomSheet` | Bottom sheet | Modal ref + handlers |

## Best Practices

### 1. Use Appropriate Hooks

```typescript
// ✅ Good - Use useAuth for general auth
function Component() {
  const { user, signIn } = useAuth();
}

// ❌ Bad - Using useRequireAuth when you don't need userId
function Component() {
  const userId = useRequireAuth(); // Throws if not auth
}
```

### 2. Handle Loading States

```typescript
// ✅ Good
function Component() {
  const { loading, isAuthReady, user } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthReady) return <InitializingScreen />;
  if (!user) return <LoginScreen />;

  return <HomeScreen />;
}
```

### 3. Use Selectors for Performance

```typescript
// ✅ Good - Selectors prevent unnecessary re-renders
function Component() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
}

// ❌ Bad - Re-renders on any state change
function Component() {
  const { isAuthenticated } = useAuth();
}
```

## Related Documentation

- **[Components](../components/README.md)** - UI components
- **[Services](../../infrastructure/services/README.md)** - Core services
- **[Domain](../../domain/README.md)** - Domain entities
