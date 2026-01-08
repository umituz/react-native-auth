# useAccountManagement

Hook for account management operations (logout, delete account).

---

## Strategy

**Purpose**: Provides safe account management operations including sign out and account deletion with proper confirmations and reauthentication.

**When to Use**:
- Account settings screens
- Logout functionality
- Account deletion flows
- Need user account operations

**Import Path**:
```typescript
import { useAccountManagement } from '@umituz/react-native-auth';
```

**Hook Location**: `src/presentation/hooks/useAccountManagement.ts`

---

## Core Operations

### logout

**Purpose**: Sign out user and clear authentication state.

**Rules**:
- MUST confirm with user before signing out
- MUST handle loading state during operation
- MUST clear local user data after sign out
- MUST navigate to login screen after sign out
- MUST handle errors gracefully

**MUST NOT**:
- Sign out without user confirmation
- Clear user data before sign out complete
- Block app functionality on error
- Lose navigation context

**Constraints**:
- Clears Firebase Auth session
- Resets auth store state
- Anonymous users: Loses all data
- Authenticated users: Can sign back in
- No server-side data deletion

---

### deleteAccount

**Purpose**: Permanently delete user account and all associated data.

**Rules**:
- MUST require double confirmation
- MUST show clear warning about irreversibility
- MUST require recent authentication
- MUST handle reauthentication if needed
- MUST provide error messages on failure
- MUST hide option for anonymous users

**MUST NOT**:
- Delete account without confirmation
- Delete without recent authentication
- Show to anonymous users
- Expose technical error details
- Allow account recovery

**Constraints**:
- Firebase requirement: Recent authentication (< 5 minutes)
- Double confirmation: Warning + Confirm
- Permanent deletion: Cannot undo
- Reauthentication: May be required
- Anonymous accounts: Cannot be deleted

---

## Reauthentication

### Strategy

**Purpose**: Handle Firebase requirement for recent authentication before sensitive operations.

**Rules**:
- MUST provide reauthentication callbacks
- MUST support both password and social auth reauth
- MUST show reauthentication UI when required
- MUST block operation until reauth complete
- MUST handle reauth failure gracefully

**MUST NOT**:
- Skip reauthentication requirement
- Allow operation without recent auth
- Hide reauthentication prompt from user
- Confuse reauth with initial login

### Constraints

**REAUTHENTICATION TRIGGERS**:
- Account deletion
- Password change (if implementing)
- Sensitive account operations
- Firebase-determined requirement

**CALLBACK TYPES**:

**onReauthRequired**
- Used for: Google/Apple social auth users
- Purpose: Re-sign in with social provider
- Must return: `boolean` (success status)
- Called when: Social auth needs reauth

**onPasswordRequired**
- Used for: Email/password users
- Purpose: Get current password
- Must return: `string | null` (password or cancel)
- Called when: Email auth needs reauth

**REAUTH FLOW**:
1. User initiates sensitive operation
2. Firebase requires recent authentication
3. Hook calls appropriate callback
4. App shows reauthentication UI
5. User reauthenticates
6. Operation proceeds if successful

---

## Loading States

### Strategy

**Purpose**: Proper UX during account management operations.

**Rules**:
- MUST show loading indicator during operations
- MUST disable buttons during operation
- MUST prevent concurrent operations
- MUST re-enable after completion

**MUST NOT**:
- Allow multiple simultaneous operations
- Leave loading state indefinitely
- Block UI without indication
- Allow operation during loading

### Constraints

**LOADING STATES**:
- `isLoading: boolean` - General loading state
- `isDeletingAccount: boolean` - Specific to deletion

**OPERATION DURATION**:
- Sign out: < 2 seconds
- Account deletion: 5-10 seconds
- Reauthentication: Variable (user-controlled)

**DISABLED STATES**:
- Disable all account actions during operation
- Disable navigation during operation
- Show progress indication
- Maintain interactivity for cancel

---

## Anonymous User Handling

### Strategy

**Purpose**: Proper handling for anonymous users vs authenticated users.

**Rules**:
- MUST hide account deletion for anonymous users
- MUST show "Create Account" option instead
- MUST explain anonymous limitations
- MUST preserve data during upgrade

**MUST NOT**:
- Show account deletion to anonymous users
- Allow sign out without warning
- Treat anonymous users as authenticated
- Hide anonymous status

### Constraints

**ANONYMOUS LIMITATIONS**:
- Cannot delete anonymous account
- Cannot change password (no password)
- Sign out loses all data
- Limited account settings

**UPGRADE PATH**:
- Anonymous → Registered
- Link credentials to anonymous account
- Preserve existing user ID
- Migrate existing data
- Seamless transition

---

## Error Handling

### Strategy

**Purpose**: Graceful handling of account operation failures.

**Rules**:
- MUST handle operation errors gracefully
- MUST show user-friendly error messages
- MUST allow retry after failures
- MUST not crash on errors
- MUST distinguish error types

**MUST NOT**:
- Show raw error messages to users
- Block retry indefinitely
- Crash on operation failures
- Expose sensitive error details

### Constraints

**ERROR CATEGORIES**:
- Network errors: Connection issues
- Reauth errors: Authentication required
- Permission errors: Insufficient permissions
- Firebase errors: Service issues

**RECOVERY OPTIONS**:
- Retry operation automatically
- Show error with retry button
- Reauthenticate if required
- Support contact for persistent issues

**ERROR DISPLAY**:
- Alert/Modal for critical errors
- Inline text for non-critical
- Toast for success/cancellation
- Console logging for debugging

---

## Security Requirements

### Strategy

**Purpose**: Ensure account operations are secure.

**Rules**:
- MUST require recent authentication for deletion
- MUST validate permissions before operations
- MUST log security events
- MUST use secure token handling
- MUST implement proper error handling

**MUST NOT**:
- Allow deletion without reauthentication
- Skip permission checks
- Log sensitive data
- Expose tokens in errors
- Bypass Firebase security

### Constraints

**REAUTHENTICATION REQUIREMENTS**:
- Account deletion: Recent auth required
- Timeout: Typically 5 minutes
- Methods: Re-sign in with credentials
- Failure: Block destructive action

**SECURITY LOGGING**:
- Log: Account views, settings access
- Log: Sign out, deletion attempts
- Never log: Passwords, tokens, credentials
- Purpose: Security audit, debugging

**DATA HANDLING**:
- Tokens managed by Firebase SDK
- Secure storage for credentials
- No plaintext password storage
- Proper session cleanup

---

## Navigation Integration

### Strategy

**Purpose**: Proper navigation flow for account operations.

**Rules**:
- MUST navigate to login after sign out
- MUST navigate to welcome after deletion
- MUST handle back navigation properly
- MUST maintain navigation context

**MUST NOT**:
- Break navigation stack
- Leave modals open after operations
- Lose user context
- Create navigation loops

### Constraints

**SIGN OUT FLOW**:
1. User confirms sign out
2. Clear auth state
3. Navigate to login screen
4. Replace entire navigation stack
5. Clear any deep links

**DELETION FLOW**:
1. User confirms deletion (twice)
2. Reauthenticate if required
3. Delete account
4. Navigate to welcome/login
5. Replace entire navigation stack

**STACK MANAGEMENT**:
- Sign out: Replace stack with login
- Delete account: Replace stack with welcome
- No back navigation to authenticated screens

---

## Related Hooks

- **`useAuth`** (`src/presentation/hooks/useAuth.ts`) - Authentication state
- **`useUserProfile`** (`src/presentation/hooks/useUserProfile.ts`) - Profile data
- **`useProfileUpdate`** (`src/presentation/hooks/useProfileUpdate.md`) - Profile editing

## Related Components

- **`AccountActions`** (`src/presentation/components/ProfileComponents.md`) - Account management UI
