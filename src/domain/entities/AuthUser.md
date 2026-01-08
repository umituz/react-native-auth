# AuthUser Entity

Provider-agnostic user entity for authentication.

---

## Strategy

**Purpose**: Represents authenticated user with provider-agnostic design. Compatible with Firebase User but works with any auth provider.

**When to Use**:
- Type-safe user representation
- User identity management
- Authentication operations
- User profile display

**Location**: `src/domain/entities/AuthUser.ts`

---

## Type Definition

### AuthUser Interface

**PROPERTIES**:
- `uid: string` - Unique user identifier
- `email: string | null` - Email address
- `displayName: string | null` - Display name
- `isAnonymous: boolean` - Anonymous user flag
- `emailVerified: boolean` - Email verification status
- `photoURL: string | null` - Profile photo URL
- `provider: AuthProviderType` - Auth provider type

### AuthProviderType

**VALUES**:
- `"google.com"` - Google authentication
- `"apple.com"` - Apple authentication
- `"password"` - Email/password authentication
- `"anonymous"` - Anonymous user
- `"unknown"` - Unknown provider

**Rules**:
- MUST have unique uid
- MUST NOT have empty uid
- Anonymous users have null email
- Provider indicates auth method

**Constraints**:
- Immutable after creation
- uid cannot be changed
- Provider determined by auth method

---

## User State Management

### Authenticated User

**CHARACTERISTICS**:
- Has valid uid
- Has email or social auth
- Not anonymous
- May have email verified flag

**Rules**:
- MUST have uid set
- MUST NOT be anonymous
- SHOULD have email if password provider

**Constraints**:
- Email can be null for social auth
- DisplayName optional
- photoURL optional

---

### Anonymous User

**CHARACTERISTICS**:
- Has valid uid
- No email
- isAnonymous = true
- provider = "anonymous"

**Rules**:
- MUST have isAnonymous = true
- MUST have null email
- provider MUST be "anonymous"

**Constraints**:
- Limited functionality
- Data lost on sign out
- Can be upgraded to registered account

---

## Provider Types

### Google User

**PROPERTIES**:
- provider: "google.com"
- emailVerified: true (typically)
- Has Google account data

**Rules**:
- MUST use Google provider
- MUST have verified email
- Auto-verifies email

---

### Apple User

**PROPERTIES**:
- provider: "apple.com"
- Email may be hidden (user choice)
- iOS only

**Rules**:
- MUST use Apple provider
- iOS platform only
- Respect user privacy choices

**Constraints**:
- Email may be private relay
- Not available on Android/Web

---

### Email/Password User

**PROPERTIES**:
- provider: "password"
- emailVerified may be false initially
- Standard auth flow

**Rules**:
- MUST have email
- Email may require verification
- Can change password

**Constraints**:
- Email required
- Password managed by user

---

## User Display

### Display Name Priority

**RULES**:
1. Use displayName if available
2. Fall back to email username
3. Fall back to "User" for anonymous
4. MUST NOT expose sensitive data

**CONSTRAINTS**:
- Display name: User-controlled
- Email: Only first part before @
- Anonymous: Generated or "Guest"

---

### Profile Photo

**RULES**:
- MUST provide fallback if null
- MUST handle loading state
- MUST not break if missing

**FALLBACK OPTIONS**:
- Default avatar generator
- User initials
- Placeholder icon
- Null (no avatar)

---

## Type Guards

### User Type Checks

**isAuthenticatedUser(user)**
- Checks if user exists and not anonymous
- Type guard for TypeScript

**isAnonymousUser(user)**
- Checks if anonymous user
- Type guard for TypeScript

**hasEmail(user)**
- Checks if has email
- Type guard for TypeScript

**Rules**:
- MUST use for type narrowing
- MUST validate before operations
- MUST check null cases

---

## Validation

### User Validation Rules

**MUST**:
- Validate uid is not empty
- Validate email format if provided
- Check provider is valid
- Verify required fields

**MUST NOT**:
- Allow empty uid
- Accept invalid email format
- Use wrong provider type

**Constraints**:
- uid required
- Email format validated
- Provider must be known type

---

## Related Entities

- **UserProfile** (`./UserProfile.md`) - User profile entity
- **AuthConfig** (`./ConfigAndErrors.md`) - Configuration
- **AuthError** (`./ConfigAndErrors.md`) - Error handling

## Related Infrastructure

- **AuthService** (`../../infrastructure/services/AuthService.ts`) - Auth operations
- **Firebase Auth** - Firebase integration
