# Infrastructure Services

Core authentication services and infrastructure implementations.

---

## Strategy

**Purpose**: Provides concrete implementations for authentication operations, user document management, event handling, and validation.

**When to Use**:
- Understanding service architecture
- Implementing custom services
- Debugging service issues
- Learning about Firebase integration

**Location**: `src/infrastructure/services/`

---

## Available Services

### AuthService

**PURPOSE**: Main authentication service orchestrating all auth operations

**IMPORT PATH**:
```typescript
import {
  AuthService,
  initializeAuthService,
  getAuthService,
  resetAuthService
} from '@umituz/react-native-auth';
```

**File**: `AuthService.ts`

**METHODS**:
- `signIn(params)` - Sign in with email/password
- `signUp(params)` - Create new account
- `signOut()` - Sign out current user
- `getCurrentUser()` - Get current user
- `sendPasswordResetEmail(email)` - Reset password

**FUNCTIONS**:
- `initializeAuthService(config)` - Initialize service
- `getAuthService()` - Get service instance
- `resetAuthService()` - Reset service (testing only)

**Rules**:
- MUST initialize before use
- MUST implement IAuthService interface
- MUST handle Firebase errors
- MUST create user documents on registration
- MUST not create multiple instances

**MUST NOT**:
- Skip initialization
- Use before initialization
- Expose Firebase types
- Create multiple service instances
- Skip error handling

---

### initializeAuth

**PURPOSE**: Initialize authentication system and Firebase Auth state listener

**IMPORT PATH**:
```typescript
import {
  initializeAuth,
  isAuthInitialized,
  resetAuthInitialization
} from '@umituz/react-native-auth';
```

**File**: `initializeAuth.ts`

**PARAMETERS**:
- `onAuthStateChanged` - Auth state callback (optional)
- `onAuthError` - Error callback (optional)

**FUNCTIONS**:
- `initializeAuth(options)` - Initialize auth system
- `isAuthInitialized()` - Check initialization status
- `resetAuthInitialization()` - Reset (testing only)

**Rules**:
- MUST call once at app startup
- MUST wait for initialization completion
- MUST handle initialization errors
- MUST not call multiple times
- MUST check status before operations

**MUST NOT**:
- Skip initialization
- Call in components (use app root)
- Initialize multiple times
- Skip status check
- Ignore initialization errors

**CALLBACKS**:
- `onAuthStateChanged(user)` - Called when auth state changes
- `onAuthError(error)` - Called on auth errors

---

### UserDocumentService

**PURPOSE**: Manage Firestore user documents

**IMPORT PATH**:
```typescript
import {
  ensureUserDocument,
  markUserDeleted,
  configureUserDocumentService
} from '@umituz/react-native-auth';
```

**File**: `UserDocumentService.ts`

**FUNCTIONS**:
- `ensureUserDocument(user, data?)` - Create/retrieve user document
- `markUserDeleted(userId)` - Mark user as deleted
- `configureUserDocumentService(config)` - Configure service

**Rules**:
- MUST create document on registration
- MUST check document existence
- MUST use server timestamps
- MUST support custom configuration
- MUST not delete documents permanently

**MUST NOT**:
- Skip document creation
- Overwrite existing data
- Use client timestamps
- Hardcode collection name
- Delete documents permanently

**CONFIGURATION**:
- `collection` - Firestore collection name (default: 'users')
- `timestamps` - Add createdAt/updatedAt fields
- `userData` - Custom fields to add to documents

**CUSTOM DATA**:
- Can add custom fields on document creation
- Merges with existing data
- Supports nested objects
- Preserves user-provided data

---

### AnonymousModeService

**PURPOSE**: Handle anonymous user authentication and upgrade

**IMPORT PATH**:
```typescript
import { AnonymousModeService } from '@umituz/react-native-auth';
```

**File**: `AnonymousModeService.ts`

**METHODS**:
- `signInAnonymously()` - Create anonymous user

**UPGRADE**:
- Handled via Firebase credential linking
- Converts anonymous to permanent account
- Preserves anonymous user data

**Rules**:
- MUST create temporary accounts
- MUST support upgrade to permanent account
- MUST warn about data loss
- MUST handle upgrade failures
- MUST not delete anonymous data on sign out

**MUST NOT**:
- Skip upgrade warnings
- Lose user data during upgrade
- Allow restricted operations without warning
- Make anonymous accounts permanent

**CONSTRAINTS**:
- Anonymous users have limited functionality
- Data lost if signed out without upgrade
- Upgrade requires valid credentials
- Cannot revert to anonymous after upgrade

---

### AuthEventService

**PURPOSE**: Pub/sub system for authentication events

**IMPORT PATH**:
```typescript
import { AuthEventService } from '@umituz/react-native-auth';
```

**File**: `AuthEventService.ts`

**METHODS**:
- `on(event, callback)` - Subscribe to event
- `emit(event, data)` - Emit event
- Returns unsubscribe function

**EVENTS**:
- `signIn` - User signed in (payload: AuthUser)
- `signUp` - New user registered (payload: AuthUser)
- `signOut` - User signed out (payload: undefined)
- `authStateChanged` - Auth state changed (payload: AuthUser | null)

**Rules**:
- MUST emit events on state changes
- MUST support multiple subscribers
- MUST provide unsubscribe function
- MUST not throw in event handlers
- MUST handle subscriber errors gracefully

**MUST NOT**:
- Skip critical events
- Block event emission on handler errors
- Throw unhandled errors
- Memory leak subscribers
- Modify event payload

**USAGE**:
- Subscribe returns unsubscribe function
- Multiple subscribers per event allowed
- Subscriber errors should not affect other subscribers
- Unsubscribe when done to prevent memory leaks

---

## Storage Adapter

### StorageProviderAdapter

**PURPOSE**: Interface for storage providers (AsyncStorage, MMKV, etc.)

**IMPORT PATH**:
```typescript
import {
  createStorageProvider,
  StorageProviderAdapter
} from '@umituz/react-native-auth';
```

**INTERFACE METHODS**:
- `getItem(key)` - Retrieve value (returns string | null)
- `setItem(key, value)` - Store value
- `removeItem(key)` - Delete value

**Rules**:
- MUST implement all three methods
- MUST handle async operations
- MUST return null for missing keys
- MUST handle storage errors
- MUST only store string values

**MUST NOT**:
- Throw for missing keys
- Skip error handling
- Assume synchronous operations
- Store non-string values
- Return undefined for missing keys

**IMPLEMENTATIONS**:
- AsyncStorage (React Native default)
- MMKV (faster alternative)
- SecureStorage (for sensitive data)
- Custom implementations allowed

---

## Validation

### AuthValidation Utilities

**PURPOSE**: Input validation for authentication forms

**IMPORT PATH**:
```typescript
import {
  validateEmail,
  validatePasswordForLogin,
  validatePasswordForRegister,
  validatePasswordConfirmation,
  validateDisplayName,
  DEFAULT_VAL_CONFIG
} from '@umituz/react-native-auth';
```

**VALIDATORS**:

**validateEmail(email)**
- Validates email format
- Returns: `{ isValid: boolean, error?: string }`

**validatePasswordForLogin(password)**
- Checks password not empty
- Returns: `{ isValid: boolean, error?: string }`

**validatePasswordForRegister(password)**
- Checks password complexity
- Returns: `{ isValid: boolean, error?: string, requirements: PasswordRequirements }`

**validatePasswordConfirmation(password, confirmation)**
- Checks passwords match
- Returns: `{ isValid: boolean, matches: boolean, error?: string }`

**validateDisplayName(name)**
- Validates display name
- Returns: `{ isValid: boolean, error?: string }`

**Rules**:
- MUST return validation result object
- MUST provide error messages
- MUST use configurable rules
- MUST not throw for invalid input
- MUST support internationalization

**MUST NOT**:
- Return boolean only
- Skip error messages
- Hardcode validation rules
- Throw on validation failure
- Assume required fields present

**DEFAULT CONFIG**:
- `password.minLength` - 8 characters
- `password.requireUppercase` - true
- `password.requireLowercase` - true
- `password.requireNumber` - true
- `password.requireSpecialChar` - true

---

## Migration Utilities

### User Data Migration

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

**Rules**:
- MUST configure before migrating
- MUST transform data correctly
- MUST handle migration errors
- MUST verify migration success
- MUST not delete source data automatically

**MUST NOT**:
- Skip configuration
- Lose data during migration
- Assume identical schemas
- Delete source without verification
- Migrate without backup

**CONFIGURATION**:
- `from` - Source collection name
- `to` - Target collection name
- `transform` - Data transformation function
- `verify` - Verification function (optional)

---

## Best Practices

### Service Initialization

**MUST**:
- Initialize services at app root
- Wait for initialization completion
- Handle initialization errors
- Check initialization status
- Configure before initialization

**MUST NOT**:
- Initialize in components
- Use before initialization
- Skip error handling
- Initialize multiple times
- Ignore status checks

---

### User Document Management

**MUST**:
- Create documents on registration
- Use server timestamps
- Handle existing documents
- Configure collection name
- Add custom fields appropriately

**MUST NOT**:
- Skip document creation
- Overwrite existing data unnecessarily
- Use client timestamps
- Hardcode collection names
- Delete documents permanently

---

### Event Handling

**MUST**:
- Emit events on all state changes
- Support multiple subscribers
- Provide unsubscribe function
- Handle subscriber errors gracefully
- Unsubscribe when done

**MUST NOT**:
- Skip critical events
- Block on subscriber errors
- Throw unhandled errors
- Memory leak subscribers
- Emit duplicate events

---

### Validation

**MUST**:
- Validate all user inputs
- Provide clear error messages
- Use consistent return types
- Support internationalization
- Configure rules appropriately

**MUST NOT**:
- Skip validation
- Return ambiguous results
- Hardcode rules
- Throw on invalid input
- Assume required fields present

---

## Error Handling

### Service Errors

**STRATEGY**:
- Map Firebase errors to domain errors
- Provide error context
- Log appropriately
- Show user-friendly messages
- Allow retry where appropriate

**Rules**:
- MUST map all Firebase errors
- MUST preserve error context
- MUST use domain error types
- MUST handle network failures
- MUST not expose implementation details

**MUST NOT**:
- Throw raw Firebase errors
- Lose error context
- Expose technical details
- Skip error logging
- Suppress errors silently

---

## Related Modules

- **Domain** (`../../domain/README.md`) - AuthUser entity, AuthError, AuthConfig
- **Application** (`../../application/README.md`) - IAuthService, IAuthProvider interfaces
- **Presentation** (`../../presentation/README.md`) - UI components and hooks
