# useAuthRequired & useRequireAuth

Hooks for authentication requirements in components.

---

## useAuthRequired

Check auth requirements and trigger auth modal if needed.

### Strategy

**Purpose**: Provides functionality to check authentication status and automatically show auth modal when user is not authenticated. Ideal for protecting specific actions.

**When to Use**:
- Protecting specific actions (like, comment, save)
- Need to show auth modal on demand
- Want to defer auth requirement until action
- Conditional auth based on user interaction

**Import Path**:
```typescript
import { useAuthRequired } from '@umituz/react-native-auth';
```

**Hook Location**: `src/presentation/hooks/useAuthRequired.ts`

**Modal Store**: `src/presentation/stores/authModalStore.ts`

### Rules

**MUST**:
- Call `checkAndRequireAuth()` before protected action
- Handle `isLoading` state appropriately
- Check `isAllowed` before granting access
- Provide clear indication that auth is required
- Respect user cancellation of auth modal

**MUST NOT**:
- Perform protected action without auth check
- Show auth modal unnecessarily
- Block user actions indefinitely
- Ignore auth check results

### Constraints

**RETURN VALUES**:
- `isAllowed: boolean` - Whether user can proceed
- `isLoading: boolean` - Auth check in progress
- `requireAuth: () => void` - Show auth modal
- `checkAndRequireAuth: () => boolean` - Check and show modal if needed

**AUTH MODAL BEHAVIOR**:
- Automatically shown when `checkAndRequireAuth()` called for unauthenticated user
- User can cancel modal
- Returns `false` if user cancels
- Returns `true` if user authenticates
- Modal managed by `authModalStore`

**PLATFORM SUPPORT**:
- iOS: ✅ Fully supported
- Android: ✅ Fully supported
- Web: ✅ Fully supported

---

## useRequireAuth

Hook-based pattern for conditional rendering and auth checks.

### Strategy

**Purpose**: Provides authentication status for conditional rendering and inline auth checks. More flexible than modal-based approach.

**When to Use**:
- Need conditional rendering based on auth state
- Want to check auth without showing modal
- Prefer hook-based API over modal
- Need fine-grained control over auth flow

**Import Path**:
```typescript
import { useRequireAuth } from '@umituz/react-native-auth';
```

**Hook Location**: `src/presentation/hooks/useAuthRequired.ts`

### Rules

**MUST**:
- Check `isAuthReady` before making decisions
- Handle `isLoading` state appropriately
- Use return values for conditional logic
- Provide clear UI feedback for auth requirements
- Not render protected content before auth ready

**MUST NOT**:
- Assume authentication without checking
- Show protected content during loading
- Create confusing mixed auth states
- Ignore `isAuthReady` state

### Constraints

**RETURN VALUES**:
- `isAuthenticated: boolean` - Auth status
- `isAuthReady: boolean` - Initial check complete
- `isLoading: boolean` - Currently checking auth
- `user: User | null` - User object if authenticated

**USAGE PATTERNS**:
- Early return if not authenticated
- Conditional rendering based on auth state
- Show loading during initial check
- Navigate or show modal if needed

**PERFORMANCE**:
- Single auth check per component mount
- Memoized return values
- No unnecessary re-renders
- Efficient state updates

---

## Comparison: useAuthRequired vs useRequireAuth

### Strategy

**Purpose**: Choose the right hook for your use case.

**Selection Guide**:

**useAuthRequired** - Use when:
- Want automatic modal on auth failure
- Protecting button clicks or actions
- Need simple auth check + modal flow
- Don't need custom auth handling

**useRequireAuth** - Use when:
- Need conditional rendering
- Want to check auth without modal
- Require custom auth handling
- Need more control over auth flow

**KEY DIFFERENCES**:
- `useAuthRequired`: Shows modal automatically
- `useRequireAuth`: Returns status for custom handling
- Can be used together if needed
- Choose based on desired UX pattern

---

## Loading States

### Strategy

**Purpose**: Proper UX during authentication state checks.

**Rules**:
- MUST handle `isLoading = true` appropriately
- MUST show loading indication for slow checks
- MUST NOT block entire UI during loading
- MUST disable protected actions during loading

**MUST NOT**:
- Ignore loading state
- Allow actions during auth check
- Show blank screens indefinitely
- Skip loading indicators

### Constraints

**LOADING SOURCES**:
- Initial auth state check
- Auth modal display
- Authentication operation
- State updates

**LOADING DURATION**:
- Typically < 500ms for state check
- Modal display: User-controlled
- Auth operation: Variable (network dependent)
- Timeout after 10 seconds

**UI PATTERNS**:
- Disable button during loading
- Show spinner or skeleton
- Prevent duplicate actions
- Clear completion feedback

---

## Auth Modal Integration

### Strategy

**Purpose**: Seamless integration with auth modal for user authentication.

**Rules**:
- MUST use `authModalStore` for modal management
- MUST handle modal dismiss events
- MUST respect user cancellation
- MUST update auth state after successful auth

**MUST NOT**:
- Show multiple modals simultaneously
- Block modal dismissal
- Ignore auth results
- Trap user in modal

### Constraints

**MODAL STORE**:
- Managed by Zustand store
- Single modal instance
- Global state across app
- Accessible from any component

**MODAL BEHAVIOR**:
- Shows on `checkAndRequireAuth()` call
- Covers entire screen
- Dismissible by user
- Contains login/register forms
- Auto-closes on successful auth

**INTEGRATION POINTS**:
- `useAuthRequired` triggers modal
- `authModalStore` manages state
- `AuthBottomSheet` renders modal
- `useAuth` provides auth state

---

## Error Handling

### Strategy

**Purpose**: Graceful handling of auth check failures.

**Rules**:
- MUST handle auth check errors gracefully
- MUST show user-friendly error messages
- MUST allow retry after failures
- MUST not crash on auth failures

**MUST NOT**:
- Show raw error messages
- Block app functionality
- Crash on auth errors
- Expose sensitive error details

### Constraints

**ERROR SCENARIOS**:
- Network error during auth check
- Auth service unavailable
- Corrupted auth state
- Modal display failure

**RECOVERY OPTIONS**:
- Retry auth check automatically
- Show error with retry option
- Allow guest access (if applicable)
- Graceful degradation

**ERROR DISPLAY**:
- Inline message for minor issues
- Modal for critical errors
- Toast for transient issues
- Console logging for debugging

---

## Security Considerations

### Strategy

**Purpose**: Ensure auth requirement enforcement is secure.

**Rules**:
- MUST enforce auth requirement at component level
- MUST validate auth state before protected actions
- MUST not rely solely on UI protection
- MUST implement backend auth validation

**MUST NOT**:
- Rely only on client-side checks
- Assume UI protection is sufficient
- Skip backend validation
- Expose protected data without auth

### Constraints

**DEFENSE IN DEPTH**:
- Client-side: These hooks enforce UI protection
- API-level: Token validation on requests
- Data-level: Firebase security rules
- Backend: Server-side auth checks

**LIMITATIONS**:
- Client-side checks can be bypassed
- Not a replacement for backend security
- UI protection only, not data protection
- Must complement with server-side validation

**BEST PRACTICES**:
- Use hooks for UX, not security
- Validate on backend always
- Implement proper API auth
- Use Firebase security rules

---

## Performance Optimization

### Strategy

**Purpose**: Efficient auth state management for smooth UX.

**Rules**:
- MUST minimize unnecessary auth checks
- MUST memoize expensive computations
- MUST avoid redundant re-renders
- MUST optimize auth state subscriptions

**MUST NOT**:
- Check auth on every render
- Create multiple auth listeners
- Cause cascading re-renders
- Block main thread with auth checks

### Constraints

**OPTIMIZATION TECHNIQUES**:
- Single auth state store
- Memoized selectors
- Efficient state updates
- Batched state changes
- Lazy modal rendering

**PERFORMANCE METRICS**:
- Auth check: < 50ms after initial load
- Re-render impact: Minimal
- Memory usage: Constant
- Modal display: Smooth animation

---

## Related Hooks

- **`useAuth`** (`src/presentation/hooks/useAuth.ts`) - Core authentication state
- **`useUserProfile`** (`src/presentation/hooks/useUserProfile.ts`) - Profile data access
- **`useAuthBottomSheet`** (`src/presentation/hooks/useAuthBottomSheet.md`) - Modal management

## Related Stores

- **`authModalStore`** (`src/presentation/stores/authModalStore.ts`) - Auth modal state
- **`authStore`** (`src/presentation/stores/authStore.ts`) - Auth state management

## Related Components

- **`AuthBottomSheet`** (`src/presentation/components/AuthBottomSheet.tsx`) - Auth modal UI
