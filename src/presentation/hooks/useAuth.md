# useAuth

Primary authentication hook for managing authentication state and operations.

---

## Strategy

**Purpose**: Centralized authentication state management using Zustand with Firebase integration. Single source of truth for all authentication-related state and operations.

**When to Use**:
- Need to check if user is authenticated
- Require user information in components
- Need to perform sign in/sign up operations
- Want to handle anonymous users
- Need authentication state across app

**Import Path**:
```typescript
import { useAuth } from '@umituz/react-native-auth';
```

**Hook Location**: `src/presentation/hooks/useAuth.ts`

**Store Location**: `src/presentation/stores/authStore.ts`

---

## State Properties

### Authentication State

**AVAILABLE PROPERTIES**:
- `user` - Full Firebase user object or null
- `userId` - User UID string or undefined
- `userType` - User type enum ('anonymous' | 'email' | 'social')
- `loading` - Boolean for initial auth check
- `isAuthReady` - Boolean indicating initial check complete
- `isAnonymous` - Boolean for anonymous user
- `isAuthenticated` - Boolean for authenticated user
- `error` - Error string or null

**STATE RULES**:
- MUST check `isAuthReady` before using auth state
- MUST handle `loading` state appropriately
- MUST NOT assume user is authenticated without checking
- MUST handle `null` user values

**STATE CONSTRAINTS**:
- `loading` is `true` only during initial auth check
- `isAuthReady` becomes `true` after first auth check
- `user` is `null` for unauthenticated users
- `userId` is `undefined` for anonymous users
- `error` is auto-cleared after successful operations

---

## Authentication Methods

### signIn

**Purpose**: Authenticate user with email and password.

**Parameters**:
- `email: string` - User email address
- `password: string` - User password

**Rules**:
- MUST validate email format before calling
- MUST validate password is not empty
- MUST handle loading state during call
- MUST display error messages on failure
- MUST NOT expose password in logs/errors

**Constraints**:
- Requires Firebase project configured
- Email must exist in Firebase Auth
- Password must match Firebase record
- Throws on network errors
- Auto-updates auth state on success

---

### signUp

**Purpose**: Create new user account with email, password, and display name.

**Parameters**:
- `email: string` - User email address
- `password: string` - User password
- `displayName: string` - User display name

**Rules**:
- MUST validate email format before calling
- MUST validate password meets requirements
- MUST validate display name not empty
- MUST handle loading state during call
- MUST display error messages on failure
- MUST NOT proceed if email already exists

**Constraints**:
- Email must be unique in Firebase Auth
- Password must meet complexity requirements
- Creates Firebase Auth user
- Creates user document in Firestore
- Auto-signs in after successful creation
- Sends email verification (if enabled)

---

### signOut

**Purpose**: Sign out current user and clear auth state.

**Parameters**: None

**Rules**:
- MUST confirm with user before signing out
- MUST handle loading state during call
- MUST clear local user data after sign out
- MUST navigate to login screen after sign out
- MUST handle errors gracefully

**Constraints**:
- Clears Firebase Auth session
- Resets auth store state
- Anonymous users: Loses all data
- Authenticated users: Can sign back in
- No server-side data deletion

---

### continueAnonymously

**Purpose**: Create anonymous user session without credentials.

**Parameters**: None

**Rules**:
- MUST inform user about anonymous limitations
- MUST offer upgrade path to full account
- MUST handle loading state during call
- MUST display error messages on failure
- MUST NOT expose this as primary auth method

**Constraints**:
- Creates temporary Firebase Auth user
- No email/password required
- User ID persists until sign out
- Can be upgraded to full account
- Data lost if user signs out
- Limited functionality compared to registered users

---

## Error Handling

### setError

**Purpose**: Manually set or clear auth error state.

**Parameters**:
- `error: string | null` - Error message or null to clear

**Rules**:
- MUST use user-friendly error messages
- MUST clear errors after successful operations
- MUST NOT expose technical error details
- MUST localize error messages

**Constraints**:
- Auto-cleared by auth operations
- Displays in UI components
- Overwrites previous error
- null clears current error

---

## Loading States

### Strategy

**Purpose**: Proper loading state management for better UX.

**Rules**:
- MUST show loading indicator during `loading = true`
- MUST NOT block UI for authentication operations
- MUST disable buttons during operations
- MUST handle loading errors gracefully

**Constraints**:
- `loading` = true only during initial auth check
- Individual operations handle their own loading
- `isAuthReady` ensures initial check complete
- Operation loading is method-specific

---

## Anonymous Users

### Strategy

**Purpose**: Support anonymous users who can upgrade to registered accounts.

**Rules**:
- MUST clearly indicate anonymous status
- MUST offer upgrade path
- MUST explain limitations
- MUST preserve data during upgrade

**Constraints**:
- Cannot access all features
- Data lost if sign out occurs
- Must upgrade to keep data
- Limited account settings
- No password recovery possible

**UPGRADE PROCESS**:
- User initiates account creation
- Link credentials to anonymous account
- Preserve existing user ID
- Migrate any existing data
- Seamless transition for user

---

## Security Requirements

### Strategy

**Purpose**: Ensure secure authentication handling.

**Rules**:
- MUST NEVER log passwords or tokens
- MUST handle errors without exposing details
- MUST use secure storage for tokens
- MUST implement proper error handling
- MUST validate all inputs

**MUST NOT**:
- Store passwords in AsyncStorage
- Log auth responses with sensitive data
- Expose tokens in error messages
- Bypass Firebase security rules
- Disable Firebase security features

**Constraints**:
- Firebase manages token refresh
- Tokens stored securely by Firebase SDK
- App cannot access refresh tokens
- ID tokens available for API calls
- Session managed automatically

---

## Platform Support

### Strategy

**Purpose**: Ensure consistent behavior across platforms.

**Constraints**:
- iOS: ✅ Fully supported
- Android: ✅ Fully supported
- Web: ✅ Fully supported

**PLATFORM-SPECIFIC**:
- Web: Requires proper Firebase config
- iOS: Requires Info.plist configuration
- Android: Requires google-services.json

---

## Integration Points

### Firebase Integration

**Requirements**:
- Firebase Auth must be initialized
- Firestore must be initialized (for user documents)
- Firebase config must be provided
- Auth persistence enabled by default

**Firebase Dependencies**:
- `@react-native-firebase/app`
- `@react-native-firebase/auth`
- `@react-native-firebase/firestore`

---

## Related Hooks

- **`useUserProfile`** (`src/presentation/hooks/useUserProfile.ts`) - Display profile data
- **`useAuthRequired`** (`src/presentation/hooks/useAuthRequired.ts`) - Require auth for components
- **`useAccountManagement`** (`src/presentation/hooks/useAccountManagement.ts`) - Account operations

## Related Stores

- **`authStore`** (`src/presentation/stores/authStore.ts`) - Auth state management
