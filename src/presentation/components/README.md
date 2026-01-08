# Presentation Components

Pre-built UI components for authentication flows.

---

## Strategy

**Purpose**: Provides ready-to-use authentication components with built-in validation, error handling, and design system integration.

**When to Use**:
- Building authentication UI
- Need pre-built auth forms
- Want consistent auth experience
- Rapid development

**Location**: `src/presentation/components/`

---

## Form Components

### LoginForm

**Purpose**: Email and password login form

**When to Use**:
- Standard login screen
- Email/password authentication
- Need built-in validation

**Import Path**:
```typescript
import { LoginForm } from '@umituz/react-native-auth';
```

**File**: `LoginForm.tsx`

**Required Props**:
- `onNavigateToRegister` - Navigation callback

**Rules**:
- MUST provide navigation callback
- MUST handle errors
- MUST use in proper container
- MUST NOT override internal validation

**Documentation**: `LoginForm.md`

---

### RegisterForm

**Purpose**: User registration form

**When to Use**:
- User registration
- Account creation
- Password strength requirements

**Required Props**:
- `onNavigateToLogin` - Navigation callback
- `termsUrl` or `onTermsPress` - Terms link
- `privacyUrl` or `onPrivacyPress` - Privacy link

**Rules**:
- MUST provide all required props
- MUST handle terms acceptance
- MUST show password validation
- MUST NOT allow submission without acceptance

**Documentation**: `LoginForm.md` (same file)

---

## Validation Components

### PasswordStrengthIndicator

**Purpose**: Visual password requirements display

**When to Use**:
- Registration forms
- Password change forms
- Password creation

**Required Props**:
- `requirements` - PasswordRequirements object

**Rules**:
- MUST calculate requirements object
- MUST update on password change
- MUST show before user types
- MUST not hide requirements

**Documentation**: `PasswordIndicators.md`

---

### PasswordMatchIndicator

**Purpose**: Password confirmation feedback

**When to Use**:
- Registration forms
- Password change forms
- Confirmation required

**Required Props**:
- `isMatch` - Match status boolean

**Rules**:
- MUST only show when confirm field has input
- MUST update in real-time
- MUST use clear visual feedback
- MUST not use ambiguous colors

**Documentation**: `PasswordIndicators.md`

---

## Social Authentication

### SocialLoginButtons

**Purpose**: Google and Apple authentication buttons

**When to Use**:
- Adding social login
- Multiple provider support
- Consistent social UI

**Required Props**:
- `enabledProviders` - Provider array
- `onGooglePress` - Google handler
- `onApplePress` - Apple handler

**Optional Props**:
- `googleLoading` - Loading state
- `appleLoading` - Loading state
- `disabled` - Disable all buttons

**Rules**:
- MUST check provider availability
- MUST handle platform differences
- MUST respect Apple guidelines
- MUST not show unavailable providers

**Platform Behavior**:
- iOS: Google + Apple
- Android: Google only
- Web: Google only

**Documentation**: `SocialLoginButtons.md`

---

## Profile Components

### ProfileSection

**Purpose**: Display user profile information

**When to Use**:
- Settings screens
- Profile headers
- User identification
- Account management

**Required Props**:
- `profile` - ProfileSectionConfig object

**Optional Props**:
- `onPress` - Press handler (authenticated)
- `onSignIn` - Sign-in handler (anonymous)

**Rules**:
- MUST handle authenticated vs anonymous
- MUST show avatar fallback
- MUST indicate anonymous status
- MUST not expose sensitive info

**Documentation**: `ProfileComponents.md`

---

### AccountActions

**Purpose**: Account management buttons

**When to Use**:
- Account settings
- Logout functionality
- Account deletion
- Password changes

**Required Props**:
- `config` - AccountActionsConfig object

**Rules**:
- MUST confirm before sign out
- MUST double-confirm deletion
- MUST require re-authentication for deletion
- MUST hide for anonymous users

**Documentation**: `ProfileComponents.md`

---

## Component Guidelines

### Design System Integration

**RULES**:
- MUST use design system tokens
- MUST follow design system spacing
- MUST use design system typography
- MUST support design system dark mode

**MUST NOT**:
- Hardcode colors or sizes
- Use custom styles
- Override design system

---

### Accessibility

**RULES**:
- MUST provide accessibility labels
- MUST support screen readers
- MUST handle keyboard navigation
- MUST maintain proper focus order

**MUST NOT**:
- Rely on color alone
- Use placeholder as label
- Break accessibility

---

### Validation

**RULES**:
- MUST validate all inputs
- MUST show field-level errors
- MUST prevent invalid submissions
- MUST provide clear messages

**Constraints**:
- Email validation required
- Password complexity validation required
- Display name required for registration
- Password match required for confirmation

---

## Styling

### Design Tokens

**COMPONENTS USE**:
- `tokens.colors` - Color system
- `tokens.spacing` - Spacing scale
- `tokens.typography` - Fonts
- `tokens.radius` - Border radius

**RULES**:
- MUST reference tokens, not values
- MUST support light/dark modes
- MUST respect design system

---

## Related Documentation

- **Hooks**: `../hooks/README.md`
- **Screens**: `../screens/README.md`
- **Stores**: `../stores/authModalStore.ts`
