# useUserProfile

Hook for fetching and displaying user profile data.

---

## Strategy

**Purpose**: Provides formatted user profile data for display in UI components. Handles authenticated vs anonymous user differences automatically.

**When to Use**:
- Displaying user profile information
- Need user display name and avatar
- Showing account settings links
- Differentiating authenticated vs anonymous users
- Profile headers or user identification

**Import Path**:
```typescript
import { useUserProfile } from '@umituz/react-native-auth';
```

**Hook Location**: `src/presentation/hooks/useUserProfile.ts`

---

## Return Value

### UserProfileData Structure

**PROPERTIES**:
- `displayName: string` - User's display name or generated name
- `userId: string` - User ID (undefined for anonymous)
- `isAnonymous: boolean` - Anonymous user status
- `avatarUrl: string | undefined` - Profile photo URL
- `accountSettingsRoute: string | undefined` - Navigation route for settings

**RETURNS**: `UserProfileData | undefined`
- `undefined` if no user exists
- Object with above properties if user exists

**Rules**:
- MUST handle `undefined` return value
- MUST check `isAnonymous` before showing account actions
- MUST provide fallback for missing avatar
- MUST NOT assume all properties exist

**Constraints**:
- Memoized for performance
- Auto-updates on auth state changes
- Generates names for anonymous users
- Uses `useAuth` hook internally

---

## Parameters

### Configuration Options

**anonymousDisplayName** (optional)
- Type: `string`
- Default: `undefined`
- Purpose: Fallback name for anonymous users
- Used when: Anonymous user has no custom name

**accountRoute** (optional)
- Type: `string`
- Default: `undefined`
- Purpose: Navigation route for account settings
- Used when: Need to navigate to settings

**anonymousNameConfig** (optional)
- Type: `AnonymousNameConfig`
- Default: `undefined`
- Purpose: Customize anonymous name generation
- Used when: Want custom anonymous naming

**Rules**:
- SHOULD provide `accountRoute` for profile editing
- MAY provide `anonymousDisplayName` for better UX
- MAY customize `anonymousNameConfig` for branding

**Constraints**:
- All parameters optional
- Configuration affects return values
- Changes trigger re-calculation

---

## Anonymous User Handling

### Strategy

**Purpose**: Automatically generate appropriate names for anonymous users.

**Rules**:
- MUST generate random name for anonymous users
- MUST indicate anonymous status clearly
- SHOULD encourage account creation
- MUST NOT hide anonymous nature

**MUST NOT**:
- Show anonymous users as authenticated
- Use misleading names for anonymous users
- Hide anonymous limitations

### Constraints

**NAME GENERATION**:
- Default format: "User_Witty_Badger_1234"
- Components: Prefix + Adjectives + Noun + ID
- Ensures uniqueness with user ID
- Memoized per anonymous user

**CUSTOMIZATION**:
```typescript
anonymousNameConfig = {
  prefix: string;         // Default: "User"
  adjectiveCount: number; // Default: 2
  nounCount: number;      // Default: 1
}
```

**DISPLAY STRATEGY**:
- Always show generated name
- Indicate guest status
- Offer upgrade path
- Preserve name across sessions

---

## Performance Optimization

### Strategy

**Purpose**: Efficient profile data computation and updates.

**Rules**:
- MUST memoize computed profile data
- MUST minimize re-computations
- MUST use dependency arrays correctly
- MUST avoid unnecessary recalculations

**Constraints**:
- Uses `useMemo` internally
- Only recalculates when dependencies change
- Dependencies: user object, config params
- No unnecessary re-renders

**OPTIMIZATION TECHNIQUES**:
- Memoized anonymous name generation
- Cached avatar URL processing
- Efficient auth state subscription
- Minimal prop drilling

---

## Avatar Handling

### Strategy

**Purpose**: Proper display of user profile photos with fallbacks.

**Rules**:
- MUST handle missing/invalid avatar URLs
- MUST provide fallback avatar
- MUST NOT break on missing photos
- SHOULD show placeholder or initials

**MUST NOT**:
- Show broken image icons
- Crash on invalid URLs
- Leave avatar space empty

### Constraints

**AVATAR URLS**:
- From Firebase user.photoURL
- May be `null` or `undefined`
- May be invalid URL
- Should be validated before display

**FALLBACK OPTIONS**:
- Show user initials
- Show generic avatar icon
- Use placeholder image
- Generate colored placeholder with initials

**DISPLAY RULES**:
- Use `avatarUrl` if valid and present
- Fallback to initials placeholder
- Default to generic icon
- Consistent sizing across app

---

## Navigation Integration

### Strategy

**Purpose**: Provide navigation paths for profile-related actions.

**Rules**:
- SHOULD provide `accountRoute` parameter
- MUST handle navigation in parent component
- MUST NOT hardcode navigation paths
- MUST support different navigation patterns

**Constraints**:

**ROUTE HANDLING**:
- `accountRoute` passed through to return value
- Parent component uses route for navigation
- Supports string routes or navigation objects
- Compatible with React Navigation

**INTEGRATION PATTERNS**:
- Navigate to account settings on press
- Pass route to navigation component
- Handle deep linking if needed
- Support custom navigation handlers

---

## Security & Privacy

### Strategy

**Purpose**: Protect user information while displaying profile.

**Rules**:
- MUST NOT display full user ID in UI
- MUST NOT expose sensitive tokens
- MUST handle email display appropriately
- MUST respect user privacy settings

**MUST NOT**:
- Show internal user identifiers
- Display raw email publicly
- Expose authentication tokens
- Log profile data with sensitive info

### Constraints

**SAFE TO DISPLAY**:
- Display name: ✅ Safe
- Avatar: ✅ Safe
- Anonymous status: ✅ Safe
- Email: ⚠️ Only to account owner

**NEVER DISPLAY**:
- User ID (UID)
- Authentication tokens
- Session identifiers
- Internal metadata

**PRIVACY CONSIDERATIONS**:
- User-controlled display name
- Optional profile photo
- Anonymous users have more privacy
- GDPR/CCPA compliant

---

## Platform Support

### Strategy

**Purpose**: Consistent behavior across all platforms.

**Constraints**:
- iOS: ✅ Fully supported
- Android: ✅ Fully supported
- Web: ✅ Fully supported

**PLATFORM-SPECIFIC**:
- Avatar display: Platform-appropriate components
- Name formatting: Consistent across platforms
- Navigation: Platform-specific patterns
- Fallbacks: Platform-appropriate defaults

---

## Related Hooks

- **`useAuth`** (`src/presentation/hooks/useAuth.ts`) - Core authentication state
- **`useProfileUpdate`** (`src/presentation/hooks/useProfileUpdate.md`) - Profile editing
- **`useAccountManagement`** (`src/presentation/hooks/useAccountManagement.md`) - Account operations

## Related Components

- **`ProfileSection`** (`src/presentation/components/ProfileComponents.md`) - Profile display component
- **`AccountActions`** (`src/presentation/components/ProfileComponents.md`) - Account management UI

## Related Utilities

- **`generateAnonymousName`** (`src/presentation/hooks/useUserProfile.ts`) - Anonymous name generation
