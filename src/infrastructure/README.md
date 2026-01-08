# Infrastructure Layer

Implements application interfaces and handles external service integrations.

---

## Strategy

**Purpose**: Provides concrete implementations of domain and application layer interfaces. Handles all external dependencies and integrations.

**When to Use**:
- Understanding Firebase integration
- Implementing custom services
- Debugging infrastructure issues
- Learning about external dependencies

**Location**: `src/infrastructure/`

---

## Structure

### Services

**AuthService.ts** - Main authentication service
**Purpose**: Orchestrates all authentication operations

**IMPORT PATH**:
```typescript
import { AuthService, initializeAuth } from '@umituz/react-native-auth';
```

**Rules**:
- MUST implement IAuthService interface
- MUST initialize before use
- MUST handle Firebase errors
- MUST create user documents
- MUST not expose Firebase internals

**MUST NOT**:
- Skip initialization
- Expose Firebase types
- Ignore error handling
- Create multiple instances

---

### UserDocumentService

**Purpose**: Manages Firestore user documents

**IMPORT PATH**:
```typescript
import {
  ensureUserDocument,
  markUserDeleted,
  configureUserDocumentService
} from '@umituz/react-native-auth';
```

**OPERATIONS**:
- `ensureUserDocument(user, data?)` - Create/retrieve user document
- `markUserDeleted(userId)` - Mark user as deleted
- `configureUserDocumentService(config)` - Configure service

**Rules**:
- MUST create document on registration
- MUST handle document existence
- MUST use server timestamps
- MUST support custom configuration
- MUST not delete documents permanently

**MUST NOT**:
- Skip document creation
- Overwrite existing data
- Use client timestamps
- Hardcode collection name

**CONFIGURATION**:
- `collection` - Firestore collection name (default: 'users')
- `timestamps` - Add createdAt/updatedAt fields
- `userData` - Custom fields to add

---

### AnonymousModeService

**Purpose**: Handles anonymous user authentication and upgrade

**IMPORT PATH**:
```typescript
import { AnonymousModeService } from '@umituz/react-native-auth';
```

**OPERATIONS**:
- `signInAnonymously()` - Create anonymous user
- User upgrade via Firebase credential linking

**Rules**:
- MUST create temporary accounts
- MUST support upgrade path
- MUST warn about data loss
- MUST handle upgrade failures
- MUST not delete anonymous data

**MUST NOT**:
- Skip upgrade warnings
- Lose user data on upgrade
- Allow anonymous operations without warning
- Make anonymous permanent

**Constraints**:
- Anonymous users have limited functionality
- Data lost if sign out without upgrade
- Upgrade requires credentials
- Cannot revert to anonymous after upgrade

---

### AuthEventService

**Purpose**: Pub/sub system for authentication events

**IMPORT PATH**:
```typescript
import { AuthEventService } from '@umituz/react-native-auth';
```

**OPERATIONS**:
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
- MUST allow multiple subscribers
- MUST provide unsubscribe function
- MUST not throw in event handlers
- MUST handle subscriber errors

**MUST NOT**:
- Skip critical events
- Block on event handlers
- Throw unhandled errors
- Memory leak subscribers

---

### StorageProviderAdapter

**Purpose**: Adapter interface for storage providers

**IMPORT PATH**:
```typescript
import {
  createStorageProvider,
  StorageProviderAdapter
} from '@umituz/react-native-auth';
```

**INTERFACE METHODS**:
- `getItem(key)` - Retrieve value
- `setItem(key, value)` - Store value
- `removeItem(key)` - Delete value

**Rules**:
- MUST implement all methods
- MUST handle async operations
- MUST return null for missing keys
- MUST handle storage errors
- MUST support string values only

**MUST NOT**:
- Throw for missing keys
- Skip error handling
- Assume synchronous operations
- Store non-string values

**IMPLEMENTATIONS**:
- AsyncStorage
- MMKV
- SecureStorage
- Custom implementations

---

## Validation Utilities

### AuthValidation

**Purpose**: Input validation for authentication

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
- `validateEmail(email)` - Email format validation
- `validatePasswordForLogin(password)` - Login password check
- `validatePasswordForRegister(password)` - Registration password complexity
- `validatePasswordConfirmation(password, confirmation)` - Password match
- `validateDisplayName(name)` - Display name validation

**RETURN TYPE**:
```typescript
{
  isValid: boolean;
  error?: string;
  // Additional fields for specific validators
}
```

**Rules**:
- MUST return validation result object
- MUST provide error messages
- MUST use configurable rules
- MUST support internationalization
- MUST not throw for invalid input

**MUST NOT**:
- Return boolean only
- Skip error messages
- Hardcode validation rules
- Throw on validation failure

**DEFAULT CONFIG**:
- `password.minLength` - 8 characters
- `password.requireUppercase` - true
- `password.requireLowercase` - true
- `password.requireNumber` - true
- `password.requireSpecialChar` - true

---

## Firebase Integration

### FirebaseAuthProvider

**Purpose**: Firebase Authentication implementation

**Location**: `providers/FirebaseAuthProvider.ts`

**Rules**:
- MUST implement IAuthProvider
- MUST wrap Firebase SDK
- MUST handle Firebase lifecycle
- MUST map to domain entities
- MUST convert Firebase errors

**MUST NOT**:
- Expose Firebase types
- Bypass error mapping
- Skip Firebase initialization
- Ignore auth state changes

---

### Error Mapping

**Purpose**: Convert Firebase errors to domain errors

**IMPORT PATH**:
```typescript
import { mapFirebaseError } from '@umituz/react-native-auth';
```

**MAPPING**:
- `auth/user-not-found` → AuthUserNotFoundError
- `auth/wrong-password` → AuthWrongPasswordError
- `auth/email-already-in-use` → AuthEmailAlreadyInUseError
- `auth/weak-password` → AuthWeakPasswordError
- `auth/invalid-email` → AuthInvalidEmailError
- `auth/network-request-failed` → AuthNetworkError

**Rules**:
- MUST map all Firebase errors
- MUST preserve error context
- MUST use domain error types
- MUST not lose error information
- MUST handle unknown errors

**MUST NOT**:
- Throw raw Firebase errors
- Skip error mapping
- Lose error context
- Use generic error type

---

## Initialization

### initializeAuth

**Purpose**: Initialize authentication system

**IMPORT PATH**:
```typescript
import { initializeAuth } from '@umituz/react-native-auth';
```

**PARAMETERS**:
- `onAuthStateChanged` - Auth state callback
- `onAuthError` - Error callback (optional)

**Rules**:
- MUST call once at app startup
- MUST wait for initialization
- MUST handle initialization errors
- MUST not call multiple times
- MUST check initialization status

**MUST NOT**:
- Skip initialization
- Call in components
- Initialize multiple times
- Ignore initialization status

**CHECK FUNCTIONS**:
- `isAuthInitialized()` - Check if initialized
- `resetAuthInitialization()` - Reset (testing only)

---

## Configuration

### Service Configuration

**AuthService Configuration**:
- Firebase Auth instance
- Auth state callbacks
- Error handlers

**UserDocumentService Configuration**:
- Collection name
- Timestamps
- Custom user data

**Validation Configuration**:
- Password requirements
- Email validation rules
- Display name constraints

**Rules**:
- MUST configure before use
- MUST use valid configuration
- MUST handle config errors
- MUST not change after initialization
- MUST validate configuration

**MUST NOT**:
- Skip configuration
- Use invalid config
- Change after initialization
- Ignore config errors

---

## Best Practices

### Initialization

**MUST**:
- Initialize at app root
- Wait for initialization
- Handle initialization errors
- Check initialization status
- Configure properly

**MUST NOT**:
- Initialize in components
- Skip initialization check
- Ignore initialization errors
- Initialize multiple times
- Use default config blindly

---

### Error Handling

**MUST**:
- Map Firebase errors to domain
- Provide context
- Log appropriately
- Show user-friendly messages
- Handle network failures

**MUST NOT**:
- Expose Firebase errors
- Show technical details
- Skip error mapping
- Suppress errors
- Log sensitive data

---

### User Documents

**MUST**:
- Create document on registration
- Use server timestamps
- Handle existing documents
- Configure collection name
- Add custom fields

**MUST NOT**:
- Skip document creation
- Overwrite data
- Use client timestamps
- Hardcode collection name
- Delete documents permanently

---

## Security

### Data Protection

**MUST**:
- Validate all inputs
- Use HTTPS
- Handle tokens properly
- Secure credentials
- Log appropriately

**MUST NOT**:
- Log passwords
- Expose tokens
- Skip validation
- Store credentials insecurely
- Log sensitive data

---

### Firebase Security

**MUST**:
- Use Firebase security rules
- Enable required providers
- Configure properly
- Monitor usage
- Handle errors

**MUST NOT**:
- Skip Firebase setup
- Ignore security rules
- Expose API keys
- Leave unconfigured
- Ignore Firebase errors

---

## Constraints

### Platform Limitations

**Firebase Dependencies**:
- Requires Firebase project
- Requires Firebase SDK
- Requires network connection
- Platform-specific features

**Rules**:
- MUST check platform availability
- MUST handle platform differences
- MUST not crash on unsupported
- MUST document platform constraints

---

### Network Requirements

**MUST**:
- Handle network failures
- Provide offline fallback
- Show network errors
- Allow retry
- Check connectivity

**MUST NOT**:
- Assume always online
- Skip network errors
- Crash on network failure
- Prevent offline usage

---

## Related Modules

- **Domain** (`../domain/README.md`) - AuthUser entity, errors, config
- **Application** (`../application/README.md`) - Interfaces and ports
- **Presentation** (`../presentation/README.md`) - UI components

---

## Service Documentation

### Detailed Service Docs

**See**: `services/README.md` for detailed service documentation

**Services Covered**:
- AuthService
- UserDocumentService
- AnonymousModeService
- AuthEventService
- Validation utilities
