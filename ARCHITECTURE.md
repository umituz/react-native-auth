# React Native Auth - DDD Architecture

## 📐 Architecture Overview

This package follows Domain-Driven Design (DDD) principles with clean architecture layers.

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Screens    │  │ Components   │  │    Hooks     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │    Stores    │  │ Navigation   │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Use Cases   │  │    Ports     │  │  DTOs        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Repositories │  │   Services   │  │   Adapters   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │    Mappers   │  │  Validators  │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Entities   │  │Value Objects │  │  Errors      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      SHARED LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Common     │  │   Types      │  │   Utils      │      │
│  │  Validation  │  │   Error      │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Directory Structure

```
src/
├── domain/                      # Domain Layer (Core Business Logic)
│   ├── entities/
│   │   ├── AuthUser.ts
│   │   └── UserProfile.ts
│   ├── value-objects/
│   │   ├── Email.ts
│   │   ├── Password.ts
│   │   └── AuthConfig.ts
│   ├── errors/
│   │   ├── AuthError.ts
│   │   └── ValidationError.ts
│   └── services/                # Domain Services (interfaces)
│       └── IAuthService.ts
│
├── application/                 # Application Layer (Use Cases)
│   ├── use-cases/
│   │   ├── SignUpUseCase.ts
│   │   ├── SignInUseCase.ts
│   │   ├── SignOutUseCase.ts
│   │   └── AnonymousModeUseCase.ts
│   ├── ports/                   # Interfaces for external dependencies
│   │   ├── IAuthRepository.ts
│   │   └── IAuthStorage.ts
│   ├── dto/                     # Data Transfer Objects
│   │   ├── AuthDTO.ts
│   │   └── UserDTO.ts
│   └── services/                # Application Services
│       └── AuthOrchestrator.ts
│
├── infrastructure/              # Infrastructure Layer (Implementation)
│   ├── repositories/
│   │   └── AuthRepository.ts
│   ├── services/
│   │   ├── FirebaseService.ts
│   │   └── AnonymousModeService.ts
│   ├── adapters/
│   │   ├── FirebaseAdapter.ts
│   │   └── StorageAdapter.ts
│   ├── mappers/
│   │   ├── UserMapper.ts
│   │   └── ErrorMapper.ts
│   └── validators/              # Implementation-specific validators
│       └── SchemaValidator.ts
│
├── presentation/                # Presentation Layer (UI)
│   ├── screens/
│   │   ├── LoginScreen/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── useLoginForm.ts
│   │   │   └── types.ts
│   │   ├── RegisterScreen/
│   │   ├── AccountScreen/
│   │   └── PasswordPromptScreen/
│   ├── components/
│   │   ├── forms/
│   │   │   ├── FormField/
│   │   │   │   ├── FormField.tsx
│   │   │   │   ├── useFormField.ts
│   │   │   │   └── types.ts
│   │   │   ├── LoginForm/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── hooks.ts
│   │   │   └── RegisterForm/
│   │   ├── auth/
│   │   │   ├── AuthBottomSheet/
│   │   │   ├── AuthHeader/
│   │   │   └── SocialLoginButtons/
│   │   └── profile/
│   ├── hooks/                   # Custom React hooks
│   │   ├── auth/
│   │   │   ├── useAuth.ts
│   │   │   ├── useSignIn.ts
│   │   │   └── useSignUp.ts
│   │   └── form/
│   │       ├── useFieldState.ts
│   │       └── useFormState.ts
│   ├── stores/                  # State management
│   │   ├── authStore/
│   │   │   ├── authStore.ts
│   │   │   ├── selectors.ts
│   │   │   └── actions.ts
│   │   └── authModalStore/
│   ├── navigation/
│   │   └── AuthNavigator.tsx
│   └── providers/
│       └── AuthProvider.tsx
│
├── shared/                      # Shared Layer (Cross-cutting)
│   ├── validation/
│   │   ├── validators/
│   │   │   ├── EmailValidator.ts
│   │   │   ├── PasswordValidator.ts
│   │   │   └── NameValidator.ts
│   │   ├── sanitizers/
│   │   │   ├── EmailSanitizer.ts
│   │   │   └── PasswordSanitizer.ts
│   │   ├── rules/
│   │   │   ├── ValidationRule.ts
│   │   │   └── commonRules.ts
│   │   └── index.ts
│   ├── error-handling/
│   │   ├── handlers/
│   │   │   ├── ErrorHandler.ts
│   │   │   └── FormErrorHandler.ts
│   │   ├── mappers/
│   │   │   ├── ErrorMapper.ts
│   │   │   └── FieldErrorMapper.ts
│   │   ├── types/
│   │   │   └── ErrorTypes.ts
│   │   └── index.ts
│   ├── form/
│   │   ├── builders/
│   │   │   ├── FormBuilder.ts
│   │   │   └── FieldBuilder.ts
│   │   ├── state/
│   │   │   ├── FormState.ts
│   │   │   └── FieldState.ts
│   │   └── utils/
│   │       ├── formUtils.ts
│   │       └── fieldUtils.ts
│   ├── state/
│   │   ├── calculators/
│   │   │   ├── StateCalculator.ts
│   │   │   └── Derivations.ts
│   │   └── transformers/
│   │       └── StateTransformer.ts
│   ├── types/
│   │   ├── common.ts
│   │   └── generics.ts
│   └── utils/
│       ├── callback.ts
│       └── async.ts
│
└── index.ts                     # Public API exports
```

## 🎯 Key Principles

### 1. Single Responsibility Principle
- Each module/file has ONE clear purpose
- Max 150 lines per file
- Folders group related functionality

### 2. Dependency Inversion Principle
- High-level modules don't depend on low-level modules
- Both depend on abstractions (interfaces in `application/ports`)
- Presentation → Application → Domain
- Infrastructure implements Application interfaces

### 3. Don't Repeat Yourself (DRY)
- Common logic in `shared/` layer
- Generic, reusable components
- Validation and error handling centralized

### 4. Separation of Concerns
- **Domain**: Pure business logic, no external dependencies
- **Application**: Use cases and orchestration
- **Infrastructure**: External integrations (Firebase, storage)
- **Presentation**: UI and user interactions
- **Shared**: Cross-cutting concerns

## 🔄 Data Flow

```
User Interaction (Presentation)
    ↓
Use Case (Application)
    ↓
Repository Port (Application)
    ↓
Repository Implementation (Infrastructure)
    ↓
External Service (Firebase, etc.)
    ↓
Domain Entity
    ↓
Mapper to DTO
    ↓
Presenter/Store
    ↓
UI Update
```

## 📦 Module Examples

### Validation Module (Shared)
```typescript
// shared/validation/validators/EmailValidator.ts
export class EmailValidator {
  validate(email: string): ValidationResult {
    // Pure validation logic
  }
}

// shared/validation/rules/ValidationRule.ts
export interface ValidationRule<T> {
  validate(value: T): ValidationResult;
}
```

### Use Case (Application)
```typescript
// application/use-cases/SignUpUseCase.ts
export class SignUpUseCase {
  constructor(
    private authRepo: IAuthRepository,
    private validator: Validator
  ) {}

  execute(dto: SignUpDTO): Promise<AuthUser> {
    // Business logic orchestration
  }
}
```

### Repository (Infrastructure)
```typescript
// infrastructure/repositories/AuthRepository.ts
export class AuthRepository implements IAuthRepository {
  // Implements port interface
  // Handles Firebase integration
}
```

## 🚨 Eliminating Code Duplication

### Before: 4 validation files
- `AuthValidation.ts`
- `validationHelpers.ts`
- `formValidators.ts`
- `formValidation.utils.ts`

### After: Single validation module
```
shared/validation/
├── validators/        # Reusable validator classes
├── sanitizers/        # Input sanitization
├── rules/            # Validation rules
└── index.ts          # Public API
```

### Before: Scattered error handling
- `getAuthErrorMessage.ts`
- `formErrorCollection.ts`
- `useAuthErrorHandler.ts`

### After: Centralized error module
```
shared/error-handling/
├── handlers/         # Error handling logic
├── mappers/          # Error → Message mapping
└── types/            # Error types
```

## 📏 File Size Guidelines

- **Target**: 50-120 lines per file
- **Maximum**: 150 lines (hard limit)
- **If larger**: Split into smaller modules

### Splitting Strategy
1. Extract related functionality into separate files
2. Group in folder by feature
3. Create index.ts for clean imports
4. Use composition over large classes

## 🧪 Testing Strategy

Each layer can be tested independently:

- **Domain**: Unit tests, no mocks needed
- **Application**: Unit tests with mock repositories
- **Infrastructure**: Integration tests with Firebase
- **Presentation**: Component tests with mock stores
- **Shared**: Pure unit tests

## 📝 Migration Path

1. ✅ Create new folder structure
2. ✅ Extract shared utilities
3. ✅ Refactor domain layer
4. ✅ Create use cases
5. ✅ Implement repositories
6. ✅ Refactor presentation components
7. ✅ Update public API
8. ✅ Remove old code
9. ✅ Update tests

## 🎨 Naming Conventions

- **Files**: PascalCase for types/classes, camelCase for utilities
- **Folders**: plural for collections (validators, handlers)
- **Interfaces**: Prefix with `I` (IAuthRepository)
- **Types**: PascalCase (ValidationResult)
- **Functions**: camelCase (validateEmail)
- **Constants**: UPPER_SNAKE_CASE (DEFAULT_CONFIG)
