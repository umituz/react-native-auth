# useProfileUpdate & useProfileEdit

Hooks for profile update operations and profile editing form management.

---

## useProfileUpdate

Hook for updating user profile information (display name, photo URL).

### Strategy

**Purpose**: Provides functionality to update user profile data in Firebase Auth and Firestore. Implementation provided by app using Firebase SDK.

**When to Use**:
- User profile editing screens
- Settings screens with profile updates
- Need to update display name or photo
- Profile modification operations

**Import Path**:
```typescript
import { useProfileUpdate } from '@umituz/react-native-auth';
```

**Hook Location**: `src/presentation/hooks/useProfileUpdate.ts`

### Rules

**MUST**:
- Validate user is authenticated before updating
- Validate input data before calling update
- Handle loading state during update
- Display error messages on failure
- Update both Firebase Auth and Firestore
- Handle anonymous users appropriately

**MUST NOT**:
- Allow anonymous users to update profile
- Update profile without validation
- Expose sensitive error details
- Allow partial updates (all-or-nothing)

### Constraints

**PARAMETERS**:
- `displayName?: string` - New display name
- `photoURL?: string` - New profile photo URL

**OPERATION RULES**:
- Updates Firebase Auth user profile
- Updates Firestore user document
- Transactional (both or none)
- Auto-updates auth state
- Triggers profile listeners

**LIMITATIONS**:
- Cannot update email (use separate method)
- Cannot update password (use separate method)
- Anonymous users cannot update
- Requires authentication

**ERROR HANDLING**:
- Validation errors before API call
- Network errors during update
- Permission errors (user not authenticated)
- Firebase errors

---

## useProfileEdit

Hook for managing profile editing form state and validation.

### Strategy

**Purpose**: Provides form state management for profile editing with validation and change tracking.

**When to Use**:
- Profile editing forms
- Settings screens with profile edits
- Need form validation for profile data
- Want to track form modifications

**Import Path**:
```typescript
import { useProfileEdit } from '@umituz/react-native-auth';
```

**Hook Location**: `src/presentation/hooks/useProfileUpdate.ts`

### Rules

**MUST**:
- Validate form before submission
- Show validation errors to user
- Track form modifications
- Handle email field as read-only
- Provide clear error messages
- Reset form after successful submission

**MUST NOT**:
- Allow invalid form submission
- Allow email modification (read-only)
- Submit unchanged data
- Clear form without confirmation if modified

### Constraints

**FORM FIELDS**:
- `displayName: string` - Editable
- `email: string` - Read-only
- `photoURL: string | null` - Editable
- `isModified: boolean` - Auto-calculated

**VALIDATION RULES**:
- Display name: Cannot be empty
- Email: Valid format (if provided)
- Photo URL: Valid URL format (if provided)

**RETURNED FUNCTIONS**:
- `setDisplayName: (value: string) => void`
- `setEmail: (value: string) => void`
- `setPhotoURL: (value: string | null) => void`
- `resetForm: (initial: Partial<ProfileEditFormState>) => void`
- `validateForm: () => { isValid: boolean; errors: string[] }`

**CHANGE TRACKING**:
- `isModified` automatically calculated
- Compares current vs initial values
- Triggers re-calculation on any change
- Used to enable/disable save button

---

## Validation Strategy

### Strategy

**Purpose**: Ensure profile data meets requirements before submission.

**Rules**:
- MUST validate all fields before submission
- MUST show clear error messages
- MUST prevent invalid submissions
- MUST provide real-time validation feedback

**MUST NOT**:
- Allow empty display names
- Accept invalid email formats
- Submit with validation errors
- Hide validation errors

### Constraints

**DISPLAY NAME VALIDATION**:
- Required field
- Minimum length: 1 character
- Maximum length: 100 characters
- No special character restrictions

**EMAIL VALIDATION**:
- Valid email format required
- Read-only field (cannot change)
- Must match Firebase user email
- Used for display only

**PHOTO URL VALIDATION**:
- Optional field
- Must be valid URL if provided
- Supports HTTP, HTTPS URLs
- Can be cleared (set to null)

**VALIDATION TIMING**:
- Real-time validation on input
- Final validation on submit
- Clear errors on correction
- Error messages localized

---

## Anonymous User Handling

### Strategy

**Purpose**: Prevent profile updates from anonymous users.

**Rules**:
- MUST check user is not anonymous
- MUST hide profile edit for anonymous users
- MUST show upgrade prompt instead
- MUST NOT allow anonymous profile updates

**Constraints**:
- Anonymous users cannot update profile
- Show "Create account" prompt
- Guide to registration
- Preserve anonymous data during upgrade

---

## Error Handling

### Strategy

**Purpose**: Graceful handling of profile update failures.

**Rules**:
- MUST catch all errors during update
- MUST show user-friendly error messages
- MUST allow retry after failures
- MUST not lose form data on error

**MUST NOT**:
- Show raw error messages
- Crash on update failures
- Lose user input on errors
- Block retry attempts

### Constraints

**ERROR TYPES**:
- Validation errors: Before API call
- Network errors: During update
- Permission errors: Not authenticated
- Firebase errors: From service

**ERROR RECOVERY**:
- Keep form data on error
- Allow user to retry
- Clear errors on new input
- Show retry button

---

## Performance Optimization

### Strategy

**Purpose**: Efficient form state management and updates.

**Rules**:
- MUST minimize unnecessary re-renders
- MUST debounce validation if expensive
- MUST optimize form state updates
- MUST prevent excessive recalculations

**Constraints**:
- Form state in local component
- Efficient validation checks
- Minimal prop drilling
- Optimized re-render triggers

---

## Security Considerations

### Strategy

**Purpose**: Secure profile data updates.

**Rules**:
- MUST validate user owns profile
- MUST sanitize input data
- MUST use secure upload for photos
- MUST not expose sensitive data

**MUST NOT**:
- Allow cross-user profile updates
- Accept unvalidated photo URLs
- Expose user IDs in errors
- Log profile data with sensitive info

### Constraints

**PERMISSION CHECKS**:
- User can only update own profile
- Firebase security rules enforce
- Server-side validation required
- Token-based authentication

**DATA SANITIZATION**:
- Trim whitespace from names
- Validate URL formats
- Escape special characters
- Prevent XSS attacks

---

## Related Hooks

- **`useAuth`** (`src/presentation/hooks/useAuth.ts`) - Authentication state
- **`useUserProfile`** (`src/presentation/hooks/useUserProfile.ts`) - Profile display data
- **`useAccountManagement`** (`src/presentation/hooks/useAccountManagement.md`) - Account operations

## Related Components

- **`ProfileSection`** (`src/presentation/components/ProfileComponents.md`) - Profile display
- **`EditProfileForm`** (`src/presentation/components/ProfileComponents.md`) - Profile editing UI
