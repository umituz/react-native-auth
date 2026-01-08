# Profile Components

Components for displaying user profile information and managing account actions.

---

## ProfileSection

Displays user profile information including avatar, name, and authentication status.

### Strategy

**Purpose**: Show user profile information with different layouts for authenticated vs anonymous users.

**When to Use**:
- Settings screens showing user info
- Profile headers in navigation
- Account management sections
- User identification in UI

**Import Path**:
```typescript
import { ProfileSection } from '@umituz/react-native-auth';
```

**Component Location**: `src/presentation/components/ProfileSection.tsx`

**Data Hook**: `src/presentation/hooks/useUserProfile.ts`

### Rules

**MUST**:
- Pass profile object with required fields
- Provide different handlers for authenticated vs anonymous users
- Show avatar fallback if no photo available
- Display authentication status clearly
- Handle navigation to profile editing

**MUST NOT**:
- Show sensitive information (user ID, email publicly)
- Allow anonymous users to access profile editing
- Display generic avatar for authenticated users without photo
- Hardcode profile data (use useUserProfile hook)

### Constraints

**AUTHENTICATED USER DISPLAY**:
- Show display name or email
- Show avatar if available
- Show "Edit Profile" or settings access
- Hide authentication prompts

**ANONYMOUS USER DISPLAY**:
- Show "Guest" or anonymous label
- Show generic placeholder avatar
- Show "Sign In" or "Create Account" prompt
- Hide profile editing options

**REQUIRED PROPERTIES**:
```typescript
{
  displayName?: string;
  isAnonymous: boolean;
  avatarUrl?: string;
  accountSettingsRoute?: string;
}
```

**PLATFORM SUPPORT**:
- iOS: ✅ Fully supported
- Android: ✅ Fully supported
- Web: ✅ Fully supported

---

## AccountActions

Provides buttons for account management operations like sign out and account deletion.

### Strategy

**Purpose**: Safe account management with proper confirmations and error handling.

**When to Use**:
- Account settings screens
- Logout functionality
- Account deletion flows
- Password change access

**Import Path**:
```typescript
import { AccountActions } from '@umituz/react-native-auth';
```

**Component Location**: `src/presentation/components/AccountActions.tsx`

**Management Hook**: `src/presentation/hooks/useAccountManagement.ts`

### Rules

**MUST**:
- Require confirmation before sign out
- Require confirmation before account deletion
- Show clear warnings for account deletion
- Provide error messages for failures
- Handle loading states during operations
- Hide deletion option for anonymous users

**MUST NOT**:
- Allow account deletion without confirmation
- Delete account without recent authentication
- Show account actions to anonymous users
- Allow immediate destructive actions
- Expose internal error messages

### Constraints

**SIGN OUT REQUIREMENTS**:
- Confirmation dialog required
- Clear sign-out message
- Cancel option must be available
- Non-destructive (can sign back in)

**ACCOUNT DELETION REQUIREMENTS**:
- Double confirmation required (warning + confirm)
- Clear warning about irreversibility
- Recent authentication required (Firebase requirement)
- Error handling for re-authentication failures
- Cannot delete anonymous accounts

**PASSWORD CHANGE**:
- Optional feature (configurable)
- Only for email/password users
- Requires current password
- Not available for social auth users

**OPERATION SAFETY**:
- Disable buttons during operation
- Show loading indicators
- Prevent concurrent operations
- Allow retry on failure
- Log security events

---

## Anonymous User Handling

### Strategy

**Purpose**: Differentiate experience between authenticated and anonymous users appropriately.

### Rules

**MUST**:
- Hide account deletion for anonymous users
- Show "Create Account" prompt instead of sign out
- Indicate guest status clearly
- Guide anonymous users toward registration

**MUST NOT**:
- Show account deletion to anonymous users
- Allow sign out of anonymous session (unless upgrading)
- Treat anonymous users as authenticated
- Hide anonymous status from user

### Constraints

**ANONYMOUS USER LIMITATIONS**:
- Cannot delete anonymous account
- Cannot change password (no password set)
- Cannot access profile editing
- Limited account settings access

**UPGRADE PATH**:
- Anonymous → Registered: Link credentials
- Preserves anonymous account data
- Requires email/password or social auth
- Seamless transition for user

---

## Security & Privacy

### Strategy

**Purpose**: Protect user information and prevent unauthorized account access.

### Rules

**MUST**:
- Never display full user ID in UI
- Never expose sensitive tokens
- Require recent auth for destructive actions
- Log account management events
- Validate permissions before actions

**MUST NOT**:
- Show user ID or internal identifiers
- Display raw email publicly
- Allow account deletion without re-auth
- Skip confirmation dialogs
- Log sensitive data

### Constraints

**INFORMATION DISPLAY**:
- Display name: OK
- Email: Only to account owner
- User ID: Never in UI
- Auth tokens: Never in logs

**RE-AUTHENTICATION**:
- Required for: Account deletion, password change
- Timeout: Usually 5 minutes in Firebase
- Methods: Re-sign in with existing credentials
- Failure: Block destructive action

**EVENT LOGGING**:
- Log: Account views, settings access
- Log: Sign out, deletion attempts
- Never log: Passwords, tokens, full emails
- Purpose: Security audit, debugging

---

## Navigation Integration

### Strategy

**Purpose**: Proper navigation flow for profile-related screens.

### Rules

**MUST**:
- Provide navigation callbacks for all actions
- Handle back navigation properly
- Pass profile data to edit screens
- Return to proper screen after actions

**MUST NOT**:
- Hardcode navigation paths
- Break back navigation stack
- Lose unsaved changes
- Leave modals open after actions

### Constraints

**NAVIGATION FLOWS**:
- Profile → Edit Profile → Back to Profile
- Profile → Account Settings → Back to Profile
- Sign Out → Login Screen (replace stack)
- Delete Account → Welcome/Login (replace stack)

**STACK MANAGEMENT**:
- Sign out: Replace entire stack
- Delete account: Replace entire stack
- Edit profile: Push onto stack
- Settings: Push onto stack

---

## Error Handling

### Strategy

**Purpose**: Clear user feedback for account action failures.

### Rules

**MUST**:
- Show user-friendly error messages
- Provide retry options after failures
- Distinguish error types clearly
- Guide users to resolution
- Log errors for debugging

**MUST NOT**:
- Show raw error codes to users
- Expose technical details
- Block retry indefinitely
- Crash on errors

### Constraints

**ERROR CATEGORIES**:
- Network errors: "Check your connection"
- Re-auth required: "Please sign in again"
- Permission denied: "You don't have permission"
- Rate limited: "Please try again later"

**RECOVERY OPTIONS**:
- Retry button for temporary failures
- Sign-in prompt for re-auth
- Support contact for persistent issues
- Graceful degradation

---

## Design System Integration

### Strategy

**Purpose**: Consistent styling with application design system.

### Rules

**MUST**:
- Use design system color tokens
- Follow design system spacing
- Use design system typography
- Match design system component styles
- Respect design system dark mode

**MUST NOT**:
- Hardcode colors or sizes
- Use custom styles outside system
- Break responsive layouts
- Ignore accessibility tokens

### Constraints

**STYLE TOKENS**:
- Colors: Primary, danger, background, text
- Spacing: Consistent gaps and padding
- Typography: System fonts and sizes
- Icons: Design system icon set
- Avatar sizes: Defined in system

**DARK MODE**:
- Automatically support dark mode
- Use system color tokens
- Test contrast in both modes
- No hardcoded colors

---

## Accessibility Requirements

### Strategy

**Purpose**: Ensure profile components are accessible to all users.

### Rules

**MUST**:
- Provide accessibility labels for buttons
- Announce state changes to screen readers
- Support keyboard navigation (web)
- Maintain proper focus order
- Use semantic HTML elements (web)

**MUST NOT**:
- Rely on color alone for meaning
- Hide important information from screen readers
- Break keyboard navigation
- Use low contrast colors

### Constraints

**SCREEN READER**:
- Announce user name and status
- Announce button actions clearly
- Provide hints for destructive actions
- Announce loading states

**VISUAL ACCESSIBILITY**:
- Minimum contrast: 4.5:1 for text
- Touch targets: 44x44px minimum
- Clear focus indicators
- Not color-dependent

---

## Related Hooks

- **`useUserProfile`** (`src/presentation/hooks/useUserProfile.ts`) - Profile data management
- **`useAccountManagement`** (`src/presentation/hooks/useAccountManagement.ts`) - Account operations
- **`useAuth`** (`src/presentation/hooks/useAuth.ts`) - Authentication state
