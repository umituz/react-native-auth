# @umituz/react-native-auth

Authentication service for React Native applications with secure, type-safe, and production-ready implementation.

---

## Strategy

**Purpose**: Provides comprehensive authentication solution for React Native apps with Domain-Driven Design architecture, supporting multiple authentication methods and providers.

**When to Use**:
- Building React Native apps requiring authentication
- Need multiple auth methods (email, social, anonymous)
- Want type-safe auth implementation
- Prefer DDD architecture
- Need production-ready auth solution

**Package Location**: `/src`

**Documentation**: See `/src/[layer]/README.md` for detailed documentation

---

## Core Features

### Authentication Methods

**SUPPORTED METHODS**:
- Email/Password authentication
- Google OAuth integration
- Apple Sign-In (iOS)
- Anonymous user sessions
- Account upgrade (anonymous → registered)

### Architecture

**DOMAIN-DRIVEN DESIGN LAYERS**:
- **Domain**: Core business logic and entities
- **Application**: Use cases and interfaces
- **Infrastructure**: External integrations
- **Presentation**: UI components and hooks

---

## Installation

### Package Installation

**NPM**:
```bash
npm install @umituz/react-native-auth
```

**Yarn**:
```bash
yarn add @umituz/react-native-auth
```

### Peer Dependencies

**REQUIRED PACKAGES**:
- `firebase`: >= 11.0.0
- `react`: >= 18.2.0
- `react-native`: >= 0.74.0
- `@tanstack/react-query`: >= 5.0.0
- `zustand`: >= 4.0.0

**EXTERNAL DEPENDENCIES**:
- `@umituz/react-native-firebase` - Firebase integration
- `@umituz/react-native-design-system` - UI components

---

## Configuration

### Firebase Setup

**Rules**:
- MUST create Firebase project
- MUST enable Authentication
- MUST enable Firestore (for user documents)
- MUST configure OAuth providers

**MUST NOT**:
- Skip Firebase console setup
- Use production keys in development
- Forget to enable required providers

**Steps**:
1. Create Firebase project at console.firebase.google.com
2. Enable Authentication
3. Enable Google Sign-In
4. Enable Apple Sign-In (for iOS)
5. Enable Firestore
6. Download config files

---

## Layer Overview

### Domain Layer

**Location**: `src/domain/`

**Purpose**: Core business logic and entities

**CONTAINS**:
- `AuthUser` entity
- `UserProfile` entity
- `AuthConfig` value object
- `AuthError` hierarchy

**Documentation**: `src/domain/README.md`

---

### Application Layer

**Location**: `src/application/`

**Purpose**: Use cases and interfaces

**CONTAINS**:
- Authentication ports
- User profile ports
- Account management ports

**Documentation**: `src/application/README.md`

---

### Infrastructure Layer

**Location**: `src/infrastructure/`

**Purpose**: External integrations and implementations

**CONTAINS**:
- Firebase Auth service
- Firestore repositories
- Validation utilities
- Provider implementations

**Documentation**:
- `src/infrastructure/README.md`
- `src/infrastructure/services/README.md`

---

### Presentation Layer

**Location**: `src/presentation/`

**Purpose**: UI components and hooks

**CONTAINS**:
- React hooks for auth
- Pre-built components
- Screen components
- State management (Zustand)

**Documentation**:
- `src/presentation/README.md`
- `src/presentation/hooks/README.md`
- `src/presentation/components/README.md`
- `src/presentation/screens/README.md`

---

## Usage Guidelines

### Authentication Hooks

**PRIMARY HOOK**: `useAuth`
**Location**: `src/presentation/hooks/useAuth.ts`

**When to Use**:
- Need authentication state
- Require user information
- Performing auth operations
- Checking auth status

**Import Path**:
```typescript
import { useAuth } from '@umituz/react-native-auth';
```

**Rules**:
- MUST initialize AuthProvider before use
- MUST handle loading state
- MUST check auth readiness
- MUST handle errors appropriately

---

### Components

**AVAILABLE COMPONENTS**:
- `LoginForm` - Email/password login
- `RegisterForm` - User registration
- `SocialLoginButtons` - Google/Apple buttons
- `ProfileSection` - Profile display
- `AccountActions` - Account management

**Import Path**:
```typescript
import {
  LoginForm,
  RegisterForm,
  SocialLoginButtons
} from '@umituz/react-native-auth';
```

**Rules**:
- MUST follow component documentation
- MUST provide required props
- MUST handle events appropriately
- MUST NOT override internal logic

---

## Platform Support

### Supported Platforms

**iOS**: ✅ Full support
- All authentication methods
- Apple Sign-In available
- Google Sign-In available

**Android**: ✅ Full support
- All authentication methods (except Apple)
- Google Sign-In available

**Web**: ✅ Full support
- All authentication methods (except Apple)
- Google Sign-In available

---

## Security Requirements

### Rules

**MUST**:
- Validate all inputs
- Use HTTPS for all operations
- Implement proper error handling
- Follow Firebase security best practices
- Use secure token storage
- Validate tokens server-side

**MUST NOT**:
- Store tokens in AsyncStorage
- Log passwords or tokens
- Expose sensitive data in errors
- Skip validation
- Use HTTP for auth operations

---

## Architecture Principles

### Domain-Driven Design

**PRINCIPLES**:
- Business logic in domain layer
- Infrastructure concerns isolated
- Presentation layer UI-focused
- Application layer orchestrates

**BENEFITS**:
- Testable business logic
- Swappable providers
- Clear separation of concerns
- Maintainable codebase

---

## Error Handling

### Strategy

**Purpose**: Comprehensive error handling throughout application.

**Rules**:
- MUST handle auth errors gracefully
- MUST show user-friendly messages
- MUST allow retry after failures
- MUST log errors for debugging
- MUST not expose sensitive data

**Error Hierarchy**:
- `AuthError` - Base error class
- `ValidationError` - Input validation errors
- `AuthenticationError` - Auth operation errors
- `NetworkError` - Network issues

---

## Validation Strategy

### Purpose

**Purpose**: Ensure data integrity and security.

**Rules**:
- MUST validate email format
- MUST validate password complexity
- MUST validate required fields
- MUST provide clear error messages
- MUST prevent invalid submissions

**Validation Location**: `src/infrastructure/utils/AuthValidation.ts`

---

## Migration Guide

### From Previous Versions

**Breaking Changes**:
- See changelog for details
- Follow migration steps
- Update component props
- Update hook usage

**Rules**:
- MUST read migration guide
- MUST test thoroughly after upgrade
- MUST update dependencies
- MUST check deprecated features

---

## Performance Considerations

### Optimization

**Rules**:
- MUST memoize expensive computations
- MUST minimize re-renders
- MUST optimize state updates
- MUST use efficient selectors

**Constraints**:
- Auth state single source of truth
- Minimal network requests
- Efficient validation checks
- Optimized component rendering

---

## Testing Strategy

### Unit Testing

**WHAT TO TEST**:
- Domain logic and entities
- Validation utilities
- Hook behavior
- Component rendering

**RULES**:
- MUST test auth operations
- MUST test validation
- MUST test error handling
- MUST mock Firebase dependencies

---

## Contributing

### Development Setup

**RULES**:
- MUST follow DDD principles
- MUST maintain type safety
- MUST update documentation
- MUST add tests for new features
- MUST follow existing patterns

**MUST NOT**:
- Break DDD layer boundaries
- Skip documentation
- Add code without tests
- Introduce breaking changes without major version bump

---

## License

MIT License - See LICENSE file for details

---

## Support and Documentation

### Documentation Structure

**MAIN README**: This file

**LAYER DOCUMENTATION**:
- `src/domain/README.md` - Domain layer details
- `src/application/README.md` - Application layer details
- `src/infrastructure/README.md` - Infrastructure details
- `src/presentation/README.md` - Presentation layer details

**COMPONENT/HOOK DOCUMENTATION**:
- Each component has dedicated .md file
- Each hook has dedicated .md file
- Follows Strategy/Rules/Constraints format

### Getting Help

- Read documentation first
- Check existing issues
- Review examples in docs
- Follow AI agent guidelines

---

## Changelog

See CHANGELOG.md for version history and changes.
