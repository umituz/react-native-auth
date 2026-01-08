# LoginForm & RegisterForm

Pre-built authentication form components for email/password login and registration.

---

## LoginForm

Email and password login form component with built-in validation.

### Strategy

**Purpose**: Provides a complete login form with email/password validation, error handling, and loading states without needing to build from scratch.

**When to Use**:
- Standard email/password authentication flow
- Need quick login screen implementation
- Want built-in validation and error handling

**Import Path**:
```typescript
import { LoginForm } from '@umituz/react-native-auth';
```

**Component Location**: `src/presentation/components/LoginForm.tsx`

### Rules

**MUST**:
- Provide `onNavigateToRegister` callback for navigation to registration screen
- Use within an auth container or proper layout wrapper
- Handle loading states during authentication
- Display error messages from validation

**MUST NOT**:
- Modify internal form validation logic
- Override keyboard navigation behavior
- Bypass built-in error handling

### Constraints

**LIMITATIONS**:
- Only supports email/password authentication (use social login components separately)
- Validation rules are fixed (email format, password required)
- Error messages follow localization keys
- Form layout is predefined

**PLATFORM SUPPORT**:
- iOS: ✅ Fully supported
- Android: ✅ Fully supported
- Web: ✅ Fully supported

**REQUIREMENTS**:
- Parent component must handle navigation
- Authentication context/provider must be configured
- Localization keys must be defined

---

## RegisterForm

User registration form with display name, email, password, and confirm password fields.

### Strategy

**Purpose**: Provides complete registration flow with password strength indicator, validation, and terms acceptance.

**When to Use**:
- Standard user registration flow
- Need password strength requirements
- Require terms/privacy acceptance

**Import Path**:
```typescript
import { RegisterForm } from '@umituz/react-native-auth';
```

**Component Location**: `src/presentation/components/RegisterForm.tsx`

### Rules

**MUST**:
- Provide `onNavigateToLogin` callback for navigation back to login
- Provide terms/privacy URLs or handlers
- Display password strength indicator to users
- Handle terms acceptance before submission

**MUST NOT**:
- Allow registration without terms acceptance
- Disable password validation
- Bypass email verification flow (if enabled)

### Constraints

**LIMITATIONS**:
- Password requirements are fixed (8+ chars, uppercase, lowercase, number, special char)
- Terms/privacy links must be provided
- Form fields are predefined (display name, email, password, confirm password)
- Cannot add custom validation rules

**VALIDATION REQUIREMENTS**:
- Display name: Required, cannot be empty
- Email: Required, must be valid format
- Password: Required, must meet complexity requirements
- Confirm Password: Required, must match password

**PLATFORM SUPPORT**:
- iOS: ✅ Fully supported
- Android: ✅ Fully supported
- Web: ✅ Fully supported

---

## Form Validation

### Strategy

**Purpose**: Built-in validation ensures user input meets security requirements before submission.

**Validation Utility Location**: `src/infrastructure/utils/AuthValidation.ts`

### Rules

**MUST**:
- Use `validateEmail` for email format validation
- Use `validatePasswordForRegister` for password requirements
- Display validation errors to users
- Prevent submission with invalid data

**MUST NOT**:
- Allow empty required fields
- Bypass password complexity requirements
- Submit with mismatched passwords

### Constraints

**PASSWORD REQUIREMENTS** (Default):
- Minimum length: 8 characters
- Must contain: Uppercase letter
- Must contain: Lowercase letter
- Must contain: Number
- Must contain: Special character

**EMAIL REQUIREMENTS**:
- Valid email format (user@domain.com)
- Cannot be empty

**CONFIGURABLE SETTINGS**:
See `DEFAULT_VAL_CONFIG` in `AuthValidation.ts`

---

## Error Handling

### Strategy

**Purpose**: Clear user feedback for validation and authentication errors.

### Rules

**MUST**:
- Display field-level validation errors
- Show authentication errors (wrong password, user not found, etc.)
- Provide clear error messages in user's language
- Allow retry after error

**MUST NOT**:
- Show raw error codes to users
- Expose sensitive information in errors
- Block user indefinitely after errors

### Constraints

**ERROR TYPES**:
- Validation errors: Red text below input field
- Network errors: Alert or banner message
- Authentication errors: Clear message with retry option

**LOCALIZATION**:
All error messages must use localization keys from i18n configuration.

---

## Accessibility

### Strategy

**Purpose**: Ensure forms are accessible to all users including screen reader users.

### Rules

**MUST**:
- Provide labels for all input fields
- Announce errors to screen readers
- Support keyboard navigation
- Maintain proper focus order

**MUST NOT**:
- Rely on color alone for error indication
- Use placeholder text as labels
- Disrupt screen reader navigation

### Constraints

**WCAG COMPLIANCE**:
- Minimum contrast ratios for text
- Touch target size: 44x44px minimum
- Focus indicators on all interactive elements
- Screen reader announcements for state changes

---

## Related Components

- **`PasswordStrengthIndicator`** (`src/presentation/components/PasswordIndicators.tsx`) - Visual password requirements display
- **`PasswordMatchIndicator`** (`src/presentation/components/PasswordIndicators.tsx`) - Password confirmation feedback
- **`SocialLoginButtons`** (`src/presentation/components/SocialLoginButtons.tsx`) - Social authentication integration

## Related Hooks

- **`useAuth`** (`src/presentation/hooks/useAuth.ts`) - Main authentication state management
- **`useSocialLogin`** (`src/presentation/hooks/useSocialLogin.ts`) - Social authentication handlers
