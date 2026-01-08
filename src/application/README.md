# Application Layer

Defines ports and interfaces for authentication operations following Hexagonal Architecture (Ports and Adapters).

---

## Strategy

**Purpose**: Establishes contracts between domain logic and external implementations. Defines what operations the application can perform without specifying how.

**When to Use**:
- Implementing custom auth providers
- Creating test doubles/mocks
- Understanding available auth operations
- Designing alternative implementations

**Location**: `src/application/`

**Structure**:
- `ports/` - Interface definitions
- `IAuthService.ts` - Authentication service interface
- `IAuthProvider.ts` - Auth provider interface

---

## Architecture Pattern

### Hexagonal Architecture (Ports and Adapters)

**PURPOSE**: Decouple business logic from external dependencies

**PORTS**:
- Interfaces defining operations
- Define what the application does
- Independent of implementations

**ADAPTERS**:
- Implementations of ports
- Connect to external services
- Firebase, custom backend, mocks

**Rules**:
- MUST depend on interfaces, not implementations
- MUST define clear operation contracts
- MUST support multiple implementations
- MUST not leak implementation details

---

## Ports

### IAuthService

**PURPOSE**: Authentication service interface defining core auth operations

**IMPORT PATH**:
```typescript
import type { IAuthService } from '@umituz/react-native-auth';
```

**OPERATIONS**:
- `signUp(params)` - Create new user account
- `signIn(params)` - Authenticate existing user
- `signOut()` - End user session
- `getCurrentUser()` - Retrieve current user
- `resetPassword(email)` - Initiate password reset
- `updateEmail(email)` - Change user email
- `updatePassword(password)` - Change user password

**Rules**:
- MUST implement all defined methods
- MUST return domain entities (AuthUser)
- MUST throw domain errors (AuthError)
- MUST handle async operations
- MUST validate inputs

**MUST NOT**:
- Expose Firebase-specific types
- Return raw provider responses
- Skip error handling
- Use synchronous operations

**PARAMS**:
- `SignUpParams` - email, password, displayName?
- `SignInParams` - email, password

---

### IAuthProvider

**PURPOSE**: Provider interface for different authentication backends

**IMPORT PATH**:
```typescript
import type { IAuthProvider } from '@umituz/react-native-auth';
```

**OPERATIONS**:
- `signUp(credentials)` - Register new user
- `signIn(credentials)` - Authenticate user
- `signInWithSocial(provider)` - Social authentication
- `signOut()` - Sign out user
- `getCurrentUser()` - Get current user

**SOCIAL PROVIDERS**:
- `google` - Google OAuth
- `apple` - Apple Sign-In
- `anonymous` - Anonymous session

**Rules**:
- MUST support defined providers
- MUST return consistent AuthUser format
- MUST handle provider-specific errors
- MUST normalize user data
- MUST support multiple providers

**MUST NOT**:
- Mix provider implementations
- Return inconsistent user shapes
- Ignore provider constraints
- Skip error normalization

**CREDENTIALS**:
- `AuthCredentials` - email, password
- `SignUpCredentials` - email, password, displayName?
- `SocialSignInResult` - success, user?, error?

---

## Implementation Guidelines

### Creating Custom Provider

**RULES**:
- MUST implement IAuthService or IAuthProvider
- MUST map to domain AuthUser entity
- MUST convert errors to domain errors
- MUST follow interface contract
- MUST handle edge cases

**MUST NOT**:
- Change method signatures
- Return provider-specific types
- Skip input validation
- Ignore error handling

**Constraints**:
- Async operations only
- Consistent return types
- Proper error mapping
- User data normalization

---

### Firebase Implementation

**LOCATION**: `src/infrastructure/services/AuthService.ts`

**Rules**:
- MUST implement IAuthService
- MUST wrap Firebase SDK
- MUST map Firebase errors to domain
- MUST convert Firebase User to AuthUser
- MUST handle Firebase lifecycle

**MUST NOT**:
- Expose Firebase types publicly
- Bypass domain layer
- Skip error mapping
- Ignore Firebase events

---

### Custom Backend Implementation

**USE CASES**:
- Custom authentication server
- Additional business logic
- Enhanced security requirements
- Legacy system integration

**Rules**:
- MUST implement IAuthProvider
- MUST handle HTTP errors properly
- MUST normalize API responses
- MUST implement retry logic
- MUST handle network failures

**MUST NOT**:
- Expose API details to domain
- Skip authentication tokens
- Ignore server errors
- Hardcode endpoints

---

## Dependency Injection

### Provider Pattern

**PURPOSE**: Enable swapping implementations without changing application code

**RULES**:
- MUST inject interfaces, not implementations
- MUST configure at app root
- MUST use single instance
- MUST not create multiple instances
- MUST handle initialization properly

**MUST NOT**:
- Instantiate providers in components
- Mix provider types
- Skip initialization
- Create circular dependencies

---

## Testing Strategy

### Mock Implementations

**PURPOSE**: Enable testing without real backend

**RULES**:
- MUST implement IAuthProvider interface
- MUST return valid AuthUser objects
- MUST simulate realistic behavior
- MUST support test scenarios
- MUST be deterministic

**MUST NOT**:
- Return invalid data
- Have undefined behavior
- Skip error scenarios
- Break interface contract

**USE CASES**:
- Unit testing
- Integration testing
- Storybook development
- CI/CD pipelines

---

## Error Handling

### Error Mapping

**RULES**:
- MUST map provider errors to domain errors
- MUST preserve error context
- MUST use domain error types
- MUST include helpful messages
- MUST not expose implementation details

**MUST NOT**:
- Throw raw provider errors
- Expose stack traces
- Lose error context
- Use generic error types

**DOMAIN ERRORS**:
- AuthUserNotFoundError
- AuthWrongPasswordError
- AuthEmailAlreadyInUseError
- AuthWeakPasswordError
- AuthInvalidEmailError
- AuthNetworkError

---

## Best Practices

### Interface Compliance

**MUST**:
- Implement all interface methods
- Match exact signatures
- Return promised types
- Handle all error cases
- Follow async patterns

**MUST NOT**:
- Modify interface definitions
- Skip optional methods
- Change parameter types
- Break backward compatibility

---

### Error Boundaries

**MUST**:
- Wrap provider calls in try-catch
- Map all errors to domain
- Provide context
- Allow retry where appropriate
- Log appropriately

**MUST NOT**:
- Let provider errors escape
- Expose implementation details
- Skip error handling
- Suppress errors silently

---

### User Data Normalization

**MUST**:
- Convert to AuthUser entity
- Normalize provider data
- Handle missing fields
- Validate required fields
- Preserve important metadata

**MUST NOT**:
- Return raw provider data
- Skip null handling
- Assume field presence
- Lose user context

---

## Constraints

### Platform Limitations

**PROVIDER AVAILABILITY**:
- Google: All platforms
- Apple: iOS only
- Anonymous: All platforms

**Rules**:
- MUST check platform before use
- MUST provide fallback for unavailable
- MUST not crash on unsupported
- MUST document platform restrictions

---

### Security Requirements

**MUST**:
- Validate all inputs
- Use HTTPS for remote calls
- Securely store credentials
- Handle tokens properly
- Implement proper error handling

**MUST NOT**:
- Log sensitive data
- Expose credentials
- Skip validation
- Use insecure protocols

---

## Related Modules

- **Domain** (`../domain/README.md`) - AuthUser entity, AuthConfig, AuthError
- **Infrastructure** (`../infrastructure/README.md`) - Firebase implementation
- **Presentation** (`../presentation/README.md`) - UI components and hooks

---

## Port Documentation

### IAuthService Documentation

**File**: `ports/IAuthService.ts`

**Purpose**: Core authentication service interface

**Implementations**:
- `FirebaseAuthService` - Firebase implementation
- Custom implementations allowed

**See Also**: Infrastructure services documentation

---

### IAuthProvider Documentation

**File**: `ports/IAuthProvider.ts`

**Purpose**: Provider abstraction for different auth backends

**Implementations**:
- Firebase provider
- Custom backend provider
- Mock provider (testing)

**See Also**: Infrastructure services documentation
