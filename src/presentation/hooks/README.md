# Presentation Hooks

React hooks for authentication state and operations.

---

## Strategy

**Purpose**: Provides React hooks for managing authentication state and operations in components. Single source of truth for auth state.

**When to Use**:
- Need authentication state in component
- Performing auth operations
- Checking user permissions
- Managing user profiles

**Location**: `src/presentation/hooks/`

---

## Core Hooks

### useAuth

**PRIMARY AUTH HOOK**

**Purpose**: Core authentication state and operations

**When to Use**:
- Need auth state anywhere in app
- Performing sign in/up/out
- Checking authentication status
- Getting user information

**Import Path**:
```typescript
import { useAuth } from '@umituz/react-native-auth';
```

**File**: `useAuth.ts`

**Rules**:
- MUST initialize AuthProvider before use
- MUST handle loading state
- MUST check auth readiness before operations
- MUST handle errors appropriately

**MUST NOT**:
- Use without AuthProvider
- Ignore loading states
- Assume user is authenticated

**State Properties**:
- `user` - Firebase user object
- `userId` - User UID
- `userType` - User type enum
- `loading` - Initial auth check loading
- `isAuthReady` - Auth check complete
- `isAuthenticated` - User logged in
- `isAnonymous` - Anonymous user
- `error` - Error message

**Methods**:
- `signIn(email, password)` - Email/password login
- `signUp(email, password, displayName)` - Create account
- `signOut()` - Sign out
- `continueAnonymously()` - Anonymous session

**Documentation**: `useAuth.md`

---

### useAuthRequired & useRequireAuth

**Purpose**: Require authentication for components or actions

**When to Use**:
- Protecting components/routes
- Checking auth before actions
- Conditional rendering based on auth
- Showing auth modal

**Import Path**:
```typescript
import {
  useAuthRequired,
  useRequireAuth
} from '@umituz/react-native-auth';
```

**File**: `useAuthRequired.ts`

**Rules**:
- MUST handle loading state
- MUST provide fallback for unauthenticated
- MUST check auth readiness
- MUST respect user cancellation

**Documentation**: `useAuthRequired.md`

---

### useUserProfile

**Purpose**: Fetch and display user profile data

**When to Use**:
- Displaying user information
- Profile headers
- Account settings
- User identification

**Import Path**:
```typescript
import { useUserProfile } from '@umituz/react-native-auth';
```

**File**: `useUserProfile.ts`

**Rules**:
- MUST handle undefined return
- MUST check isAnonymous before actions
- MUST provide fallback for missing data
- MUST handle anonymous users appropriately

**Documentation**: `useUserProfile.md`

---

### useProfileUpdate & useProfileEdit

**Purpose**: Profile update operations and form management

**When to Use**:
- Profile editing screens
- Settings screens
- Form state management
- Profile modifications

**Import Path**:
```typescript
import {
  useProfileUpdate,
  useProfileEdit
} from '@umituz/react-native-auth';
```

**File**: `useProfileUpdate.ts`

**Rules**:
- MUST validate before update
- MUST handle loading state
- MUST show errors to user
- MUST not allow anonymous updates

**Documentation**: `useProfileUpdate.md`

---

### useAccountManagement

**Purpose**: Account operations (logout, delete)

**When to Use**:
- Account settings screens
- Logout functionality
- Account deletion
- Password changes

**Import Path**:
```typescript
import { useAccountManagement } from '@umituz/react-native-auth';
```

**File**: `useAccountManagement.ts`

**Rules**:
- MUST confirm before destructive actions
- MUST handle reauthentication
- MUST show clear warnings
- MUST hide for anonymous users

**Documentation**: `useAccountManagement.md`

---

### useSocialLogin

**Purpose**: Google and Apple authentication

**When to Use**:
- Social authentication needed
- Want Google sign-in
- Want Apple sign-in (iOS)
- Unified social auth interface

**Import Path**:
```typescript
import {
  useSocialLogin,
  useGoogleAuth,
  useAppleAuth
} from '@umituz/react-native-auth';
```

**File**: `useSocialLogin.ts`

**Rules**:
- MUST configure providers before use
- MUST check provider availability
- MUST handle loading states
- MUST handle platform differences

**Documentation**: `useSocialLogin.md`

---

### useAuthBottomSheet

**Purpose**: Auth modal management

**When to Use**:
- Modal-based authentication
- Login/register modal
- Social auth in modal
- Pending callback execution

**Import Path**:
```typescript
import { useAuthBottomSheet } from '@umituz/react-native-auth';
```

**File**: `useAuthBottomSheet.ts`

**Rules**:
- MUST use with BottomSheetModal component
- MUST handle modal lifecycle
- MUST execute pending callbacks
- MUST reset state properly

**Documentation**: `useAuthBottomSheet.md`

---

## Hook Usage Patterns

### Initialization

**RULES**:
- MUST wrap app with AuthProvider
- MUST initialize Firebase before AuthProvider
- MUST handle initialization errors
- MUST not use hooks outside provider

**ORDER**:
1. Initialize Firebase
2. Wrap with AuthProvider
3. Use hooks in components

---

### Error Handling

**RULES**:
- MUST wrap hook calls in try-catch
- MUST display error messages
- MUST allow user retry
- MUST not expose sensitive errors

---

### Performance

**RULES**:
- MUST not call hooks conditionally
- MUST use hook dependencies correctly
- MUST not create multiple auth listeners
- MUST memoize expensive computations

---

## Related Documentation

- **Components**: `../components/README.md`
- **Screens**: `../screens/README.md`
- **Stores**: `../stores/README.md`
