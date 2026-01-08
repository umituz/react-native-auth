# useAuthBottomSheet

Hook for authentication bottom sheet modal management.

---

## Strategy

**Purpose**: Manages authentication modal (bottom sheet) with login/register forms, social authentication, and auto-close behavior. Integrates with auth modal store for global state management.

**When to Use**:
- Need modal-based authentication flow
- Want to show login/register on demand
- Need social auth in modal
- Want auto-close after successful auth
- Require pending callback execution

**Import Path**:
```typescript
import { useAuthBottomSheet } from '@umituz/react-native-auth';
```

**Hook Location**: `src/presentation/hooks/useAuthBottomSheet.ts`

**Modal Store**: `src/presentation/stores/authModalStore.ts`

**Modal Component**: `@umituz/react-native-design-system`'s `BottomSheetModal`

---

## Core Functionality

### Modal Reference

**Purpose**: Ref object for controlling bottom sheet modal.

**PROPERTIES**:
- Type: `RefObject<BottomSheetModalRef>`
- Used to: Open, close, and control modal

**Rules**:
- MUST pass to BottomSheetModal component
- MUST use for programmatic control
- MUST not create multiple refs

**Constraints**:
- Single modal instance
- Managed by authModalStore
- Ref persists across renders

---

### Mode Management

**Purpose**: Tracks current modal mode (login or register).

**VALUES**:
- `'login'` - Show login form
- `'register'` - Show registration form

**Rules**:
- MUST display appropriate form based on mode
- MUST switch forms when mode changes
- MUST preserve mode during modal open
- MUST reset to default on close

**Constraints**:
- Controlled by authModalStore
- Default mode: `'login'`
- Switchable via navigation handlers
- Auto-reset on modal close

---

### Provider Detection

**Purpose**: Automatically determines which social providers are available.

**VALUES**:
- Type: `SocialAuthProvider[]`
- Possible: `['google']`, `['apple']`, `['google', 'apple']`, `[]`

**Rules**:
- MUST check provider availability
- MUST respect platform limitations
- MUST filter based on configuration
- MUST update on config changes

**Constraints**:
- Platform-dependent:
  - iOS: Google + Apple (if configured)
  - Android: Google only
  - Web: Google only
- Configuration-dependent
- Auto-calculated from config

---

## Navigation Handlers

### handleNavigateToRegister

**Purpose**: Switch modal from login to register mode.

**Rules**:
- MUST change mode to `'register'`
- MUST keep modal open
- MUST update form display

**Constraints**:
- No modal close/open cycle
- Smooth form transition
- Preserves any input data (if applicable)

---

### handleNavigateToLogin

**Purpose**: Switch modal from register to login mode.

**Rules**:
- MUST change mode to `'login'`
- MUST keep modal open
- MUST update form display

**Constraints**:
- No modal close/open cycle
- Smooth form transition
- Clears register form data

---

### handleDismiss

**Purpose**: Handle modal dismiss event (user swipes down or taps backdrop).

**Rules**:
- MUST reset modal state
- MUST clear mode to default
- MUST clear any pending callbacks
- MUST handle cleanup

**Constraints**:
- Called by BottomSheetModal onDismiss
- Auto-executed on user action
- Cleanup required

---

### handleClose

**Purpose**: Programmatically close modal and cleanup.

**Rules**:
- MUST close modal
- MUST reset modal state
- MUST clear pending callbacks
- MUST execute cleanup

**Constraints**:
- Programmatic close
- Same cleanup as dismiss
- Safe to call multiple times

---

## Social Authentication

### handleGoogleSignIn

**Purpose**: Initiate Google OAuth flow from modal.

**Rules**:
- MUST call Google auth function
- MUST handle loading state
- MUST display errors to user
- MUST auto-close modal on success

**MUST NOT**:
- Call if provider not configured
- Leave loading state indefinitely
- Ignore auth results

**Constraints**:
- Uses configured Google client IDs
- Auto-closes on successful auth
- Stays open on failure (for retry)
- Loading state managed automatically

---

### handleAppleSignIn

**Purpose**: Initiate Apple Sign-In flow from modal.

**Rules**:
- MUST call Apple auth function
- MUST handle loading state
- MUST display errors to user
- MUST auto-close modal on success

**MUST NOT**:
- Call if provider not available
- Call on non-iOS platforms
- Leave loading state indefinitely

**Constraints**:
- iOS only (hidden on other platforms)
- Requires Apple Developer account
- Auto-closes on successful auth
- Stays open on failure (for retry)

---

## Auto-Close Behavior

### Strategy

**Purpose**: Automatically close modal after successful authentication.

**Rules**:
- MUST close modal on successful auth
- MUST execute pending callback after close
- MUST not close on auth failure
- MUST not close if user cancels

**MUST NOT**:
- Stay open after successful auth
- Close prematurely during auth flow
- Execute callback before auth complete

### Constraints

**AUTO-CLOSE TRIGGERS**:
- Anonymous → Authenticated: Close modal
- Unauthenticated → Authenticated: Close modal
- Authenticated → Authenticated (reauth): No close needed

**PENDING CALLBACKS**:
- Stored in authModalStore
- Executed after successful auth
- Cleared after execution
- Can be action (navigate, API call, etc.)

**NO-CLOSE SCENARIOS**:
- Authentication failure
- User cancellation
- Network errors
- Validation errors

---

## Pending Callbacks

### Strategy

**Purpose**: Execute callback after successful authentication.

**Use Cases**:
- Retry protected action after auth
- Navigate to intended destination
- Trigger post-auth operations
- Restore user flow

**Rules**:
- MUST store callback before showing modal
- MUST execute after successful auth
- MUST clear after execution
- MUST handle callback errors

**MUST NOT**:
- Execute callback before auth
- Forget callback after auth
- Execute multiple times
- Lose callback context

### Constraints

**CALLBACK TYPES**:
- Navigation function
- Async operation
- State update
- Any void-returning function

**EXECUTION TIMING**:
- After successful authentication
- Before modal close
- Before UI updates
- Can be async

**ERROR HANDLING**:
- Catch callback errors
- Show error to user
- Don't block auth completion
- Log errors for debugging

---

## Configuration

### Social Authentication Config

**socialConfig** parameter structure:

**GOOGLE CONFIG**:
```typescript
google?: {
  iosClientId?: string;
  webClientId?: string;
  androidClientId?: string;
}
```
At least one client ID required

**APPLE CONFIG**:
```typescript
apple?: {
  enabled: boolean;
}
```

**Rules**:
- MUST provide client IDs for Google
- MUST enable Apple explicitly if needed
- MUST match Firebase console configuration

**Constraints**:
- Google: Requires at least one client ID
- Apple: Only works on iOS
- Both: Require Firebase setup

---

## Loading States

### Strategy

**Purpose**: Proper loading indication during authentication.

**Rules**:
- MUST show loading during auth operation
- MUST disable auth buttons during loading
- MUST re-enable after completion
- MUST handle concurrent operations

**MUST NOT**:
- Allow multiple concurrent auth operations
- Leave loading state indefinitely
- Allow button press during loading

### Constraints

**LOADING STATES**:
- `googleLoading: boolean` - Google auth in progress
- `appleLoading: boolean` - Apple auth in progress

**VISUAL FEEDBACK**:
- Disable buttons during loading
- Show spinner/indicator
- Prevent mode switch during loading
- Clear errors on new operation

---

## Error Handling

### Strategy

**Purpose**: Graceful error handling in modal context.

**Rules**:
- MUST display errors in modal
- MUST keep modal open on error
- MUST allow retry after error
- MUST clear errors on new operation

**MUST NOT**:
- Close modal on error
- Show raw error messages
- Block retry indefinitely
- Lose user context

### Constraints

**ERROR DISPLAY**:
- In-modal error message
- Clear retry option
- User-friendly text
- Localized messages

**ERROR RECOVERY**:
- User can retry same operation
- Can switch to different provider
- Can switch to login/register
- Manual dismiss if desired

---

## Modal Lifecycle

### Strategy

**Purpose**: Proper modal lifecycle management.

**OPENING**:
1. Trigger: `showAuthModal` called
2. Mode: Set to 'login' or 'register'
3. Callback: Stored if provided
4. Modal: Opens with animation

**DURING AUTH**:
1. User fills form or clicks social button
2. Loading state shown
3. Auth operation executed
4. Success or failure determined

**CLOSING**:
1. Success: Auto-close + callback execution
2. Failure: Stays open for retry
3. Dismiss: Cleanup + reset
4. Cancel: Cleanup + reset

**Rules**:
- MUST follow lifecycle sequence
- MUST cleanup on every close
- MUST reset state appropriately
- MUST not leak memory

---

## Integration Points

### Store Integration

**authModalStore** manages:
- Modal open/close state
- Current mode (login/register)
- Pending callback
- Social auth configuration

**Rules**:
- MUST use store for modal state
- MUST not duplicate state locally
- MUST subscribe to store updates
- MUST trigger store actions

---

## Related Hooks

- **`useAuth`** (`src/presentation/hooks/useAuth.ts`) - Authentication state
- **`useSocialLogin`** (`src/presentation/hooks/useSocialLogin.md`) - Social authentication
- **`useAuthRequired`** (`src/presentation/hooks/useAuthRequired.md`) - Auth requirement checks

## Related Components

- **`AuthBottomSheet`** (`src/presentation/components/AuthBottomSheet.tsx`) - Modal component
- **`LoginForm`** (`src/presentation/components/LoginForm.md`) - Login form
- **`RegisterForm`** (`src/presentation/components/LoginForm.md`) - Registration form
- **`SocialLoginButtons`** (`src/presentation/components/SocialLoginButtons.md`) - Social auth UI

## Related Stores

- **`authModalStore`** (`src/presentation/stores/authModalStore.ts`) - Modal state management
