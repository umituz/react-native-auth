# Domain Layer

Core business logic, domain entities, value objects, and domain rules.

---

## Strategy

**Purpose**: Contains business rules and domain models independent of external dependencies. Represents the core authentication logic.

**When to Use**:
- Understanding business rules
- Working with domain entities
- Implementing validation
- Learning about data structures

**Location**: `src/domain/`

---

## Structure

### Entities

**entities/AuthUser.ts** - Provider-agnostic user entity
**entities/UserProfile.ts** - User profile for Firestore

### Value Objects

**value-objects/AuthConfig.ts** - Authentication configuration

### Errors

**errors/AuthError.ts** - Domain-specific error hierarchy

### Utils

**utils/anonymousNameGenerator.ts** - Anonymous name generation
**utils/migration.ts** - Data migration utilities

---

## Domain Entities

### AuthUser

**PURPOSE**: Provider-agnostic user entity for authentication

**IMPORT PATH**:
```typescript
import type { AuthUser } from '@umituz/react-native-auth';
```

**PROPERTIES**:
- `uid: string` - Unique user identifier
- `email: string | null` - Email address
- `displayName: string | null` - Display name
- `photoURL: string | null` - Profile photo URL
- `isAnonymous: boolean` - Anonymous flag
- `emailVerified: boolean` - Email verification status
- `provider: AuthProviderType` - Auth provider type

**Rules**:
- MUST have unique uid
- MUST NOT have empty uid
- Anonymous users have null email
- Provider indicates auth method
- Email can be null for social auth

**MUST NOT**:
- Allow empty uid
- Change uid after creation
- Have anonymous user with email
- Use invalid provider type

**Documentation**: `entities/AuthUser.md`

---

### UserProfile

**PURPOSE**: User profile entity for Firestore document storage

**IMPORT PATH**:
```typescript
import type { UserProfile } from '@umituz/react-native-auth';
```

**PROPERTIES**:
- `uid: string` - User ID
- `email: string | null` - Email address
- `displayName: string | null` - Display name
- `photoURL: string | null` - Profile photo URL
- `isAnonymous: boolean` - Anonymous flag
- `createdAt: Date | null` - Account creation date
- `lastLoginAt: Date | null` - Last login timestamp

**Rules**:
- MUST create on user registration
- MUST include uid
- MUST set initial timestamps
- MUST validate updates
- MUST handle partial updates

**MUST NOT**:
- Delete existing profiles
- Skip validation
- Use client timestamps
- Overwrite without checking

**Documentation**: `entities/UserProfile.md`

---

## Value Objects

### AuthConfig

**PURPOSE**: Authentication configuration value object

**IMPORT PATH**:
```typescript
import type { AuthConfig } from '@umituz/react-native-auth';
```

**COMPONENTS**:
- `password: PasswordConfig` - Password requirements
- `social?: SocialAuthConfig` - Social provider config

**PasswordConfig**:
- `minLength: number` - Minimum password length
- `requireUppercase: boolean` - Require uppercase
- `requireLowercase: boolean` - Require lowercase
- `requireNumber: boolean` - Require number
- `requireSpecialChar: boolean` - Require special character

**Rules**:
- MUST set minLength between 4-128
- MUST validate password against config
- MUST provide password config
- MAY provide social config

**MUST NOT**:
- Set minLength < 4
- Set minLength > 128
- Skip validation

**Documentation**: `ConfigAndErrors.md`

---

## Domain Errors

### AuthError Hierarchy

**PURPOSE**: Type-safe error handling with clear error types

**IMPORT PATH**:
```typescript
import {
  AuthError,
  AuthUserNotFoundError,
  AuthWrongPasswordError,
  AuthEmailAlreadyInUseError,
  AuthWeakPasswordError,
  AuthInvalidEmailError,
  AuthNetworkError
} from '@umituz/react-native-auth';
```

**ERROR TYPES**:
- `AuthUserNotFoundError` - User not found
- `AuthWrongPasswordError` - Incorrect password
- `AuthEmailAlreadyInUseError` - Email already registered
- `AuthWeakPasswordError` - Password too weak
- `AuthInvalidEmailError` - Invalid email format
- `AuthNetworkError` - Network connection failure

**Rules**:
- MUST use domain errors (not Firebase)
- MUST map Firebase errors to domain
- MUST preserve error context
- MUST show user-friendly messages
- MUST not expose system details

**MUST NOT**:
- Throw Firebase errors directly
- Expose error codes
- Show stack traces
- Reveal sensitive information

**Documentation**: `ConfigAndErrors.md`

---

## Domain Utilities

### Anonymous Name Generator

**PURPOSE**: Generate random names for anonymous users

**IMPORT PATH**:
```typescript
import {
  generateAnonymousName,
  getAnonymousDisplayName
} from '@umituz/react-native-auth';
```

**FUNCTIONS**:
- `generateAnonymousName(uid, config?)` - Generate anonymous name
- `getAnonymousDisplayName(uid)` - Get display name only

**CONFIGURATION**:
- `prefix` - Name prefix (default: 'User')
- `adjectiveCount` - Number of adjectives (default: 2)
- `nounCount` - Number of nouns (default: 1)
- `showNumbers` - Include numbers (default: true)

**Rules**:
- MUST be deterministic for same uid
- MUST generate unique names
- MUST be human-readable
- MUST not contain offensive words
- MUST support custom configuration

**MUST NOT**:
- Generate duplicate names
- Use offensive language
- Be non-deterministic
- Ignore configuration

---

### Migration Utilities

**PURPOSE**: Migrate user data between collections

**IMPORT PATH**:
```typescript
import {
  migrateUserData,
  configureMigration
} from '@umituz/react-native-auth';
```

**FUNCTIONS**:
- `configureMigration(config)` - Configure migration
- `migrateUserData(userId)` - Run migration

**CONFIGURATION**:
- `from` - Source collection name
- `to` - Target collection name
- `transform` - Data transformation function
- `verify` - Verification function (optional)

**Rules**:
- MUST configure before migrating
- MUST transform data correctly
- MUST handle migration errors
- MUST verify migration success
- MUST not delete source automatically

**MUST NOT**:
- Skip configuration
- Lose data during migration
- Assume identical schemas
- Delete source without verification

---

## Type Guards

### User Type Guards

**PURPOSE**: Type-safe user checking

**IMPORT PATH**:
```typescript
import {
  isAuthenticatedUser,
  isAnonymousUser,
  hasEmail
} from '@umituz/react-native-auth';
```

**GUARDS**:
- `isAuthenticatedUser(user)` - Check if authenticated user
- `isAnonymousUser(user)` - Check if anonymous user
- `hasEmail(user)` - Check if has email

**Rules**:
- MUST use for type narrowing
- MUST validate before operations
- MUST check null cases
- MUST return boolean

**MUST NOT**:
- Skip type guards
- Assume user type
- Skip null checks
- Return non-boolean

---

## Domain Rules

### AuthUser Rules

**MUST**:
- Have unique uid
- Validate uid not empty
- Validate email format if provided
- Check provider is valid
- Verify required fields

**MUST NOT**:
- Allow empty uid
- Accept invalid email
- Use wrong provider type
- Have anonymous user with email

**Constraints**:
- uid required
- Email format validated
- Provider must be known type
- Anonymous users have null email

---

### UserProfile Rules

**MUST**:
- Validate display name 2-50 characters
- Validate photo URL format
- Use server timestamps
- Handle partial updates
- Preserve existing data

**MUST NOT**:
- Allow display name < 2 chars
- Accept invalid URLs
- Use client timestamps
- Overwrite existing data

**Constraints**:
- Display name min 2, max 100 chars
- Cannot be only whitespace
- Valid URL required for photoURL
- One profile per uid

---

### Password Rules

**MUST**:
- Enforce minimum length
- Check uppercase if required
- Check lowercase if required
- Check number if required
- Check special char if required

**MUST NOT**:
- Allow weak passwords
- Skip validation checks
- Accept passwords below minimum

**Constraints**:
- Minimum length: 4-128 chars
- Requirements configurable
- All requirements optional
- Default min length: 6 (lenient)

---

## Best Practices

### Entity Usage

**MUST**:
- Use type guards for type narrowing
- Validate before operations
- Handle null values appropriately
- Follow domain rules
- Use proper error types

**MUST NOT**:
- Skip validation
- Assume required fields present
- Ignore null cases
- Use generic error types
- Break domain rules

---

### Error Handling

**MUST**:
- Use domain error types
- Map provider errors to domain
- Provide context
- Show user-friendly messages
- Preserve error information

**MUST NOT**:
- Throw provider errors
- Expose technical details
- Lose error context
- Show stack traces
- Reveal sensitive data

---

### Configuration

**MUST**:
- Validate configuration
- Use appropriate defaults
- Test with production config
- Not use dev config in production

**MUST NOT**:
- Skip validation
- Use invalid config
- Ignore environment differences
- Hardcode production values

---

## Related Modules

- **Application** (`../application/README.md`) - Ports and interfaces
- **Infrastructure** (`../infrastructure/README.md`) - Implementations
- **Presentation** (`../presentation/README.md`) - UI components

---

## Entity Documentation

### Detailed Entity Docs

**AuthUser**: `entities/AuthUser.md`
**UserProfile**: `entities/UserProfile.md`
**AuthConfig & AuthError**: `ConfigAndErrors.md`
