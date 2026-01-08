# Password Indicators

Visual components for password validation and user feedback during registration.

---

## PasswordStrengthIndicator

Displays password requirements visually and shows which requirements are met as user types.

### Strategy

**Purpose**: Provides real-time visual feedback on password strength to guide users toward creating secure passwords.

**When to Use**:
- Registration screens requiring password input
- Password change screens
- Anywhere users create/update passwords
- Need to show password security requirements

**Import Path**:
```typescript
import { PasswordStrengthIndicator } from '@umituz/react-native-auth';
```

**Component Location**: `src/presentation/components/PasswordIndicators.tsx`

**Validation Utility**: `src/infrastructure/utils/AuthValidation.ts`

### Rules

**MUST**:
- Pass `requirements` object with boolean values for each requirement
- Show indicator before user starts typing for guidance
- Update in real-time as password changes
- Use clear visual distinction (color/icons) for met vs unmet requirements
- Support both labeled and compact (dots only) modes

**MUST NOT**:
- Hide requirements until after user fails validation
- Use color alone to convey requirement status (add icons/text)
- Allow password submission when requirements not met
- Modify validation logic (use provided utilities)

### Constraints

**REQUIREMENT TYPES** (Fixed):
```typescript
interface PasswordRequirements {
  hasMinLength: boolean;      // Default: 8 characters
  hasUppercase: boolean;      // A-Z
  hasLowercase: boolean;      // a-z
  hasNumber: boolean;         // 0-9
  hasSpecialChar: boolean;    // Special characters
}
```

**DISPLAY MODES**:
- Full mode: Labels with each requirement
- Compact mode: Dots only (5 dots = 5 requirements)

**VISUAL FEEDBACK**:
- Met requirement: Green color with checkmark
- Unmet requirement: Gray color with dot
- Partially met: Yellow/orange color (optional enhancement)

**CUSTOMIZATION LIMITS**:
- Cannot add/remove requirements
- Cannot change requirement order
- Colors follow design system tokens

**PLATFORM SUPPORT**:
- iOS: ✅ Fully supported
- Android: ✅ Fully supported
- Web: ✅ Fully supported

**REQUIREMENTS**:
- Parent component must calculate requirements object
- Must recalculate on every password change
- Localization keys for requirement labels

---

## PasswordMatchIndicator

Shows whether two password fields match in real-time.

### Strategy

**Purpose**: Provides immediate feedback when confirming password to prevent typos and ensure user entered intended password.

**When to Use**:
- Registration forms with password confirmation
- Password change forms
- Anywhere password needs to be re-entered for confirmation

**Import Path**:
```typescript
import { PasswordMatchIndicator } from '@umituz/react-native-auth';
```

**Component Location**: `src/presentation/components/PasswordIndicators.tsx`

### Rules

**MUST**:
- Only show when confirm password field has input
- Update in real-time as user types
- Show clear visual feedback (green = match, red = no match)
- Display before form submission
- Check for exact string match (case-sensitive)

**MUST NOT**:
- Show indicator before user types in confirm field
- Allow submission if passwords don't match
- Use ambiguous colors (red/green only, no yellow)
- Hide indicator after initial display

### Constraints

**DISPLAY TRIGGERS**:
- Show only when: `confirmPassword.length > 0`
- Hide when: Confirm field cleared
- Update on: Every keystroke in confirm field

**MATCH CRITERIA**:
- Exact string match required
- Case-sensitive
- Whitespace-sensitive
- No fuzzy matching allowed

**VISUAL STATES**:
- Match: Green color, checkmark icon, positive text
- No Match: Red color, X icon, negative text
- Empty: Hidden (no indicator)

**TIMING CONSTRAINTS**:
- No debounce (immediate feedback)
- No animation delay
- Instant update on keystroke

**PLATFORM SUPPORT**:
- iOS: ✅ Fully supported
- Android: ✅ Fully supported
- Web: ✅ Fully supported

---

## Combined Usage Strategy

### Strategy

**Purpose**: Use both indicators together for complete password validation feedback during registration.

**When to Use**:
- User registration flow
- Password creation with confirmation
- Need both strength requirements and match confirmation

### Rules

**MUST**:
- Show PasswordStrengthIndicator below password field
- Show PasswordMatchIndicator below confirm password field
- Calculate strength requirements on password field changes
- Calculate match status on confirm field changes
- Disable submit button until both: all requirements met AND passwords match

**MUST NOT**:
- Show match indicator before strength indicator
- Allow submission with unmet requirements even if passwords match
- Hide strength indicator after user moves to confirm field

### Constraints

**FORM FLOW**:
1. User types password → Show strength indicator
2. User types confirm password → Show match indicator
3. Both valid → Enable submit button
4. Either invalid → Disable submit button

**VALIDATION DEPENDENCIES**:
- Strength validation: Password field only
- Match validation: Both password fields
- Submit enabled: Both validations pass

---

## Accessibility Requirements

### Strategy

**Purpose**: Ensure password validation is accessible to all users including screen reader users.

### Rules

**MUST**:
- Announce requirement status changes to screen readers
- Provide text alternatives to color indicators
- Use semantic HTML (if web)
- Maintain high contrast for visibility
- Support keyboard navigation

**MUST NOT**:
- Rely on color alone to convey status
- Use placeholder text for requirements
- Hide requirements from screen readers

### Constraints

**SCREEN READER**:
- Announce "Password requirement met: 3 of 5"
- Announce match status: "Passwords match" or "Passwords don't match"
- Use ARIA live regions for dynamic updates

**VISUAL ACCESSIBILITY**:
- Minimum contrast ratio: 4.5:1 for text
- Color + icon for requirement status (not color alone)
- Touch target size: 44x44px minimum (mobile)

---

## Design System Integration

### Strategy

**Purpose**: Consistent styling with application design system.

### Rules

**MUST**:
- Use design system color tokens for valid/invalid states
- Follow design system spacing guidelines
- Use design system typography
- Match design system border radius

**MUST NOT**:
- Hardcode colors or sizes
- Use custom icons outside design system
- Override design system animations

### Constraints

**TOKEN DEPENDENCIES**:
- `tokens.colors.success` - Met requirement
- `tokens.colors.error` - Unmet requirement
- `tokens.spacing.md` - Indicator spacing
- `tokens.radius.sm` - Icon border radius

---

## Related Components

- **`RegisterForm`** (`src/presentation/components/RegisterForm.tsx`) - Uses both indicators automatically
- **`LoginForm`** (`src/presentation/components/LoginForm.tsx`) - May use strength indicator for password changes

## Related Utilities

- **`validatePasswordForRegister`** (`src/infrastructure/utils/AuthValidation.ts`) - Password validation logic
- **`DEFAULT_VAL_CONFIG`** (`src/infrastructure/utils/AuthValidation.ts`) - Configuration for requirements
