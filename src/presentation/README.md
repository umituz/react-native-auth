# Presentation Layer

React components, hooks, providers, stores, and navigation for authentication UI.

---

## Strategy

**Purpose**: Provides all UI components and React hooks for authentication features in React Native applications.

**When to Use**:
- Building authentication UI
- Need auth hooks and components
- Integrating auth into navigation
- Managing auth state in UI

**Location**: `src/presentation/`

---

## Structure

### Providers
**providers/AuthProvider.tsx** - Root auth context provider

### Hooks
**hooks/useAuth.ts** - Main auth hook
**hooks/useAuthRequired.ts** - Auth requirement checking
**hooks/useUserProfile.ts** - Profile data fetching
**hooks/useProfileUpdate.ts** - Profile updates
**hooks/useAccountManagement.ts** - Account operations
**hooks/useSocialLogin.ts** - Social auth management
**hooks/useAuthBottomSheet.ts** - Modal management

### Components
**components/** - Pre-built UI components
- Form components (LoginForm, RegisterForm)
- Password indicators
- Social login buttons
- Profile components
- Layout components

### Screens
**screens/** - Complete authentication screens
- LoginScreen
- RegisterScreen
- AccountScreen
- EditProfileScreen

### Stores
**stores/authStore.ts** - Auth state (Zustand)
**stores/authModalStore.ts** - Modal state

---

## Providers

### AuthProvider

**PURPOSE**: Root provider that wraps app and provides authentication context

**IMPORT PATH**:
```typescript
import { AuthProvider } from '@umituz/react-native-auth';
```

**Rules**:
- MUST wrap app root
- MUST initialize before using hooks
- MUST be ancestor of all auth hooks
- MUST not nest multiple providers
- MUST configure properly

**MUST NOT**:
- Skip provider initialization
- Use hooks without provider
- Create multiple instances
- Nest AuthProvider inside itself

---

## Hooks

### Core Hooks

#### useAuth

**PURPOSE**: Main authentication hook for auth state and operations

**IMPORT PATH**:
```typescript
import { useAuth } from '@umituz/react-native-auth';
```

**RETURNS**:
- `user: AuthUser | null` - Current user
- `userId: string | null` - User ID
- `loading: boolean` - Loading state
- `isAuthReady: boolean` - Auth initialized
- `isAuthenticated: boolean` - Authenticated status
- `isAnonymous: boolean` - Anonymous user
- `signIn()` - Sign in function
- `signUp()` - Sign up function
- `signOut()` - Sign out function
- `setError()` - Set error state

**Rules**:
- MUST use within AuthProvider
- MUST handle loading state
- MUST check auth readiness
- MUST handle errors appropriately
- MUST not call operations during loading

**MUST NOT**:
- Use outside AuthProvider
- Skip loading checks
- Ignore error handling
- Call operations prematurely

**Documentation**: `hooks/useAuth.md`

---

#### useAuthRequired

**PURPOSE**: Check auth requirements and show modal if needed

**IMPORT PATH**:
```typescript
import { useAuthRequired } from '@umituz/react-native-auth';
```

**RETURNS**:
- `isAllowed: boolean` - Operation allowed
- `checkAndRequireAuth()` - Check and show modal

**Rules**:
- MUST use before protected operations
- MUST show modal for anonymous users
- MUST execute callback after auth
- MUST handle modal state

**MUST NOT**:
- Skip auth check
- Show modal for authenticated users
- Execute operation without auth
- Ignore modal state

**Documentation**: `hooks/useAuthRequired.md`

---

#### useRequireAuth

**PURPOSE**: Get userId or throw if not authenticated

**IMPORT PATH**:
```typescript
import { useRequireAuth } from '@umituz/react-native-auth';
```

**RETURNS**:
- `userId: string` - Guaranteed user ID

**Rules**:
- MUST only use in protected components
- MUST handle thrown error
- MUST guarantee parent auth check
- MUST not use in optional auth contexts

**MUST NOT**:
- Use in public components
- Skip error handling
- Assume auth without check
- Use for optional features

---

### User Profile Hooks

#### useUserProfile

**PURPOSE**: Fetch user profile data for display

**IMPORT PATH**:
```typescript
import { useUserProfile } from '@umituz/react-native-auth';
```

**PARAMETERS**:
- `accountRoute` - Account screen route
- `anonymousDisplayName` - Guest display name

**RETURNS**:
- Profile object or null
- Loading state
- Error state

**Rules**:
- MUST handle loading state
- MUST provide anonymous fallback
- MUST handle errors gracefully
- MUST not mutate profile data

**MUST NOT**:
- Skip loading check
- Return undefined for anonymous
- Throw on errors
- Modify returned profile

**Documentation**: `hooks/useUserProfile.md`

---

#### useProfileUpdate

**PURPOSE**: Profile update operations

**IMPORT PATH**:
```typescript
import { useProfileUpdate } from '@umituz/react-native-auth';
```

**RETURNS**:
- `updateProfile()` - Update function
- `isUpdating` - Loading state
- `error` - Error state

**Rules**:
- MUST validate before update
- MUST handle loading state
- MUST show success/error feedback
- MUST not update during loading

**MUST NOT**:
- Skip validation
- Update while loading
- Ignore errors
- Update without user action

**Documentation**: `hooks/useProfileUpdate.md`

---

### Account Management Hooks

#### useAccountManagement

**PURPOSE**: Account operations (logout, delete)

**IMPORT PATH**:
```typescript
import { useAccountManagement } from '@umituz/react-native-auth';
```

**PARAMETERS**:
- `onReauthRequired` - Reauth callback
- `onPasswordRequired` - Password prompt callback

**RETURNS**:
- `logout()` - Sign out function
- `deleteAccount()` - Delete account function
- `isLoading` - Loading state
- `isDeletingAccount` - Delete loading state

**Rules**:
- MUST confirm before logout
- MUST double-confirm deletion
- MUST require reauthentication for deletion
- MUST handle reauth callbacks
- MUST not show for anonymous users

**MUST NOT**:
- Skip confirmation dialogs
- Delete without reauth
- Allow anonymous deletion
- Ignore callback requirements

**Documentation**: `hooks/useAccountManagement.md`

---

### Social Login Hooks

#### useSocialLogin

**PURPOSE**: Social login management

**IMPORT PATH**:
```typescript
import { useSocialLogin } from '@umituz/react-native-auth';
```

**PARAMETERS**:
- Social provider configuration

**RETURNS**:
- `signInWithGoogle()` - Google sign in
- `signInWithApple()` - Apple sign in
- `googleLoading` - Google loading state
- `appleLoading` - Apple loading state
- `googleConfigured` - Google available
- `appleAvailable` - Apple available

**Rules**:
- MUST configure providers
- MUST check availability
- MUST handle platform differences
- MUST check loading states
- MUST handle errors

**MUST NOT**:
- Skip provider configuration
- Show unavailable providers
- Ignore platform constraints
- Call while loading

**Documentation**: `hooks/useSocialLogin.md`

---

#### useGoogleAuth

**PURPOSE**: Google OAuth flow

**IMPORT PATH**:
```typescript
import { useGoogleAuth } from '@umituz/react-native-auth';
```

**PARAMETERS**:
- `iosClientId` - iOS client ID
- `androidClientId` - Android client ID
- `webClientId` - Web client ID

**RETURNS**:
- `signInWithGoogle()` - Sign in function
- `googleLoading` - Loading state
- `googleConfigured` - Configured status

**Rules**:
- MUST provide at least one client ID
- MUST check configuration
- MUST use expo-auth-session
- MUST handle errors properly

**MUST NOT**:
- Skip client IDs
- Use without configuration
- Ignore loading state
- Skip error handling

---

#### useAppleAuth

**PURPOSE**: Apple Sign-In functionality

**IMPORT PATH**:
```typescript
import { useAppleAuth } from '@umituz/react-native-auth';
```

**RETURNS**:
- `signInWithApple()` - Sign in function
- `appleLoading` - Loading state
- `appleAvailable` - Available on iOS

**Rules**:
- MUST check platform availability
- MUST only use on iOS
- MUST respect Apple guidelines
- MUST handle private relay emails

**MUST NOT**:
- Use on Android
- Use on Web
- Require as only auth method
- Skip availability check

---

### UI Hooks

#### useAuthBottomSheet

**PURPOSE**: Authentication bottom sheet management

**IMPORT PATH**:
```typescript
import { useAuthBottomSheet } from '@umituz/react-native-auth';
```

**PARAMETERS**:
- Social provider configuration
- Default callbacks

**RETURNS**:
- `modalRef` - Modal reference
- `mode` - Current mode (login/register)
- `handleDismiss()` - Dismiss handler
- `handleGoogleSignIn()` - Google handler
- `handleAppleSignIn()` - Apple handler
- Loading states

**Rules**:
- MUST configure social providers
- MUST auto-close on success
- MUST execute pending callbacks
- MUST handle modal state properly

**MUST NOT**:
- Skip auto-close
- Leave modal open after auth
- Ignore pending callbacks
- Lose callback references

**Documentation**: `hooks/useAuthBottomSheet.md`

---

## Components

### Layout Components

#### AuthContainer

**PURPOSE**: Main auth layout container

**IMPORT PATH**:
```typescript
import { AuthContainer } from '@umituz/react-native-auth';
```

**Rules**:
- MUST wrap auth screen content
- MUST provide consistent layout
- MUST handle keyboard avoidance
- MUST support design system

**MUST NOT**:
- Use without content
- Override layout styles
- Break responsive design
- Skip keyboard handling

---

#### AuthHeader

**PURPOSE**: Header component for auth screens

**IMPORT PATH**:
```typescript
import { AuthHeader } from '@umituz/react-native-auth';
```

**PROPS**:
- `title` - Screen title
- `subtitle` - Screen subtitle (optional)

**Rules**:
- MUST provide clear title
- MUST use proper typography
- MUST support design system
- MUST be optional

**MUST NOT**:
- Skip title
- Use unclear text
- Override styles improperly

---

### Form Components

#### LoginForm & RegisterForm

**PURPOSE**: Pre-built authentication forms

**IMPORT PATH**:
```typescript
import { LoginForm, RegisterForm } from '@umituz/react-native-auth';
```

**REQUIRED PROPS** (LoginForm):
- `onNavigateToRegister` - Navigation callback

**REQUIRED PROPS** (RegisterForm):
- `onNavigateToLogin` - Navigation callback
- `termsUrl` or `onTermsPress` - Terms link
- `privacyUrl` or `onPrivacyPress` - Privacy link

**Rules**:
- MUST provide all required props
- MUST handle navigation callbacks
- MUST validate before submission
- MUST not override internal validation

**MUST NOT**:
- Skip required props
- Override validation logic
- Bypass internal state
- Modify form behavior

**Documentation**: `components/LoginForm.md`

---

### Password Indicators

#### PasswordStrengthIndicator

**PURPOSE**: Visual password requirements display

**IMPORT PATH**:
```typescript
import { PasswordStrengthIndicator } from '@umituz/react-native-auth';
```

**PROPS**:
- `requirements` - PasswordRequirements object

**Rules**:
- MUST calculate requirements object
- MUST update on password change
- MUST show before user types
- MUST not hide requirements

**MUST NOT**:
- Show without requirements
- Hide after first input
- Skip validation
- Use ambiguous colors

**Documentation**: `components/PasswordIndicators.md`

---

#### PasswordMatchIndicator

**PURPOSE**: Password confirmation feedback

**IMPORT PATH**:
```typescript
import { PasswordMatchIndicator } from '@umituz/react-native-auth';
```

**PROPS**:
- `isMatch` - Match status boolean

**Rules**:
- MUST only show when confirm field has input
- MUST update in real-time
- MUST use clear visual feedback
- MUST not use ambiguous colors

**MUST NOT**:
- Show before confirm input
- Use ambiguous colors
- Skip real-time updates
- Hide feedback

**Documentation**: `components/PasswordIndicators.md`

---

### Social Login Components

#### SocialLoginButtons

**PURPOSE**: Social authentication buttons

**IMPORT PATH**:
```typescript
import { SocialLoginButtons } from '@umituz/react-native-auth';
```

**REQUIRED PROPS**:
- `enabledProviders` - Provider array
- `onGooglePress` - Google handler
- `onApplePress` - Apple handler

**OPTIONAL PROPS**:
- `googleLoading` - Loading state
- `appleLoading` - Loading state
- `disabled` - Disable all

**Rules**:
- MUST check provider availability
- MUST handle platform differences
- MUST respect Apple guidelines
- MUST not show unavailable providers

**Platform Behavior**:
- iOS: Google + Apple
- Android: Google only
- Web: Google only

**MUST NOT**:
- Show unavailable providers
- Ignore platform constraints
- Skip loading states
- Override platform behavior

**Documentation**: `components/SocialLoginButtons.md`

---

### Profile Components

#### ProfileSection

**PURPOSE**: User profile display

**IMPORT PATH**:
```typescript
import { ProfileSection } from '@umituz/react-native-auth';
```

**REQUIRED PROPS**:
- `profile` - ProfileSectionConfig object

**OPTIONAL PROPS**:
- `onPress` - Press handler (authenticated)
- `onSignIn` - Sign-in handler (anonymous)

**Rules**:
- MUST handle authenticated vs anonymous
- MUST show avatar fallback
- MUST indicate anonymous status
- MUST not expose sensitive info

**MUST NOT**:
- Show sensitive data publicly
- Skip anonymous handling
- Break avatar fallback
- Expose internal IDs

**Documentation**: `components/ProfileComponents.md`

---

#### AccountActions

**PURPOSE**: Account management buttons

**IMPORT PATH**:
```typescript
import { AccountActions } from '@umituz/react-native-auth';
```

**REQUIRED PROPS**:
- `config` - AccountActionsConfig object

**Rules**:
- MUST confirm before sign out
- MUST double-confirm deletion
- MUST require re-authentication for deletion
- MUST hide for anonymous users

**MUST NOT**:
- Skip confirmations
- Allow anonymous deletion
- Delete without reauth
- Show for anonymous users

**Documentation**: `components/ProfileComponents.md`

---

## Screens

### Pre-built Screens

**LoginScreen** - Complete login screen
**RegisterScreen** - Registration screen
**AccountScreen** - Account settings screen
**EditProfileScreen** - Profile editing screen

**IMPORT PATH**:
```typescript
import {
  LoginScreen,
  RegisterScreen,
  AccountScreen,
  EditProfileScreen,
} from '@umituz/react-native-auth';
```

**Rules**:
- MUST configure navigation properly
- MUST integrate with app navigation
- MUST handle callbacks appropriately
- MUST not bypass AuthProvider

**MUST NOT**:
- Use without navigation setup
- Skip AuthProvider
- Ignore navigation callbacks
- Modify internal screen logic

**Documentation**: `screens/README.md`

---

## Stores

### authStore

**PURPOSE**: Main authentication state (Zustand)

**IMPORT PATH**:
```typescript
import {
  useAuthStore,
  selectIsAuthenticated,
  selectUserId
} from '@umituz/react-native-auth';
```

**STATE**:
- `user` - Current user
- `loading` - Loading state
- `isAuthReady` - Ready state
- `error` - Error state

**RULES**:
- MUST use hooks (not direct store access)
- MUST use selectors for specific values
- MUST not mutate state directly
- MUST rely on useAuth hook instead

**MUST NOT**:
- Access store directly in components
- Mutate state externally
- Skip selector usage
- Bypass useAuth hook

---

### authModalStore

**PURPOSE**: Auth modal state management

**IMPORT PATH**:
```typescript
import { useAuthModalStore } from '@umituz/react-native-auth';
```

**STATE**:
- `isVisible` - Modal visibility
- `mode` - Login/register mode
- `pendingCallback` - Callback after auth

**RULES**:
- MUST use useAuthRequired hook instead
- MUST not manage manually
- MUST let hooks handle state
- MUST not access directly

**MUST NOT**:
- Access store directly
- Manage modal manually
- Skip hook usage
- Mutate state externally

---

## Best Practices

### Hook Usage

**MUST**:
- Use useAuth for primary operations
- Check loading states
- Handle errors appropriately
- Use specific hooks for specific tasks
- Follow hook rules

**MUST NOT**:
- Access store directly
- Skip loading checks
- Use hooks without provider
- Ignore error handling
- Break hook rules

---

### Component Usage

**MUST**:
- Follow design system integration
- Provide required props
- Handle callbacks appropriately
- Validate before submission
- Support accessibility

**MUST NOT**:
- Skip required props
- Override internal logic
- Break validation
- Ignore accessibility
- Modify component behavior

---

### State Management

**MUST**:
- Use hooks over store access
- Use selectors for optimization
- Let hooks manage state
- Follow React best practices
- Handle loading states

**MUST NOT**:
- Access store directly
- Mutate state externally
- Skip loading states
- Ignore React rules
- Bypass hook abstraction

---

## Related Modules

- **Domain** (`../domain/README.md`) - AuthUser entity, errors
- **Application** (`../application/README.md`) - Service interfaces
- **Infrastructure** (`../infrastructure/README.md`) - Service implementations

---

## Subdirectories

- **Hooks**: `hooks/README.md`
- **Components**: `components/README.md`
- **Screens**: `screens/README.md`
