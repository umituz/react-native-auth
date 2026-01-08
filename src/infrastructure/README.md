# Infrastructure Layer

React Native Auth package infrastructure layer. Contains implementations of application interfaces and external service integrations.

## Structure

```
infrastructure/
├── providers/
│   └── FirebaseAuthProvider.ts    # Firebase auth implementation
├── services/
│   ├── AuthService.ts              # Main auth service
│   ├── initializeAuth.ts           # Auth initialization
│   ├── UserDocumentService.ts      # User document management
│   ├── AnonymousModeService.ts     # Anonymous user service
│   └── AuthEventService.ts         # Event handling
├── adapters/
│   └── StorageProviderAdapter.ts   # Storage adapter
└── utils/
    └── AuthValidation.ts           # Validation utilities
```

## Overview

The infrastructure layer implements the interfaces defined in the application layer and handles all external integrations:

- **Firebase Authentication**: Primary auth provider implementation
- **Firestore**: User document storage
- **Firebase Storage**: Profile photo storage
- **Validation**: Input validation utilities

---

# FirebaseAuthProvider

Firebase Authentication implementation of `IAuthProvider`.

## Features

- Email/Password authentication
- Google sign-in
- Apple sign-in
- Anonymous authentication
- User state management

## Usage

```typescript
import { FirebaseAuthProvider } from '@umituz/react-native-auth';
import { getAuth } from 'firebase/auth';

const firebaseAuth = getAuth();
const provider = new FirebaseAuthProvider(firebaseAuth);

// Sign up
const user = await provider.signUp({
  email: 'user@example.com',
  password: 'password123',
  displayName: 'John Doe',
});

// Sign in
const user = await provider.signIn({
  email: 'user@example.com',
  password: 'password123',
});

// Sign out
await provider.signOut();

// Get current user
const currentUser = provider.getCurrentUser();
```

---

# AuthService

Main authentication service that orchestrates all auth operations.

## Features

- User authentication flow
- User document creation
- Error handling
- State management

## Usage

```typescript
import {
  AuthService,
  initializeAuthService,
  getAuthService,
  resetAuthService,
} from '@umituz/react-native-auth';

// Initialize (must be called once)
initializeAuthService({
  firebaseAuth: getAuth(),
  onAuthStateChanged: (user) => {
    console.log('Auth state changed:', user);
  },
});

// Get service instance
const authService = getAuthService();

// Sign in
const user = await authService.signIn({
  email: 'user@example.com',
  password: 'password123',
});

// Sign up
const user = await authService.signUp({
  email: 'user@example.com',
  password: 'password123',
  displayName: 'John Doe',
});

// Sign out
await authService.signOut();

// Reset (testing only)
resetAuthService();
```

## API

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `signIn` | `{ email, password }` | `Promise<AuthUser>` | Sign in with email/password |
| `signUp` | `{ email, password, displayName? }` | `Promise<AuthUser>` | Create new account |
| `signOut` | - | `Promise<void>` | Sign out current user |
| `getCurrentUser` | - | `AuthUser \| null` | Get current user |
| `sendPasswordResetEmail` | `email` | `Promise<void>` | Send password reset email |

---

# initializeAuth

Initializes the authentication system and sets up Firebase Auth state listener.

## Features

- Firebase Auth initialization
- Auth state listener setup
- Automatic user document creation
- Error handling

## Usage

### Basic Initialization

```typescript
import { initializeAuth } from '@umituz/react-native-auth';

function App() {
  useEffect(() => {
    const init = async () => {
      await initializeAuth({
        onAuthStateChanged: (user) => {
          console.log('Auth state changed:', user);
        },
      });
    };

    init();
  }, []);

  return <AppNavigator />;
}
```

### With Navigation Integration

```typescript
import { initializeAuth } from '@umituz/react-native-auth';

function App() {
  const navigation = useNavigation();

  useEffect(() => {
    initializeAuth({
      onAuthStateChanged: (user) => {
        if (user) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      },
      onAuthError: (error) => {
        console.error('Auth error:', error);
        Alert.alert('Auth Error', error.message);
      },
    });
  }, []);

  return <NavigationContainer>{/* Routes */}</NavigationContainer>;
}
```

### Check Initialization Status

```typescript
import { isAuthInitialized, resetAuthInitialization } from '@umituz/react-native-auth';

if (isAuthInitialized()) {
  console.log('Auth is initialized');
}

// Reset (testing only)
resetAuthInitialization();
```

---

# UserDocumentService

Manages user documents in Firestore.

## Features

- Automatic user document creation
- User data updates
- Account deletion marking
- Custom configuration

## Usage

### Ensure User Document

```typescript
import { ensureUserDocument } from '@umituz/react-native-auth';

// After user signs in/up, ensure document exists
const user = await signInWithEmailAndPassword(auth, email, password);
await ensureUserDocument(user);
```

### Mark User as Deleted

```typescript
import { markUserDeleted } from '@umituz/react-native-auth';

// When user deletes account
await markUserDeleted(userId);
```

### Configure Service

```typescript
import { configureUserDocumentService } from '@umituz/react-native-auth';

configureUserDocumentService({
  collection: 'customers', // Default: 'users'
  timestamps: true,        // Add createdAt, updatedAt
  userData: {
    source: 'app',
    version: '1.0.0',
  },
});
```

### Custom User Data

```typescript
await ensureUserDocument(user, {
  role: 'premium',
  subscription: 'monthly',
  preferences: {
    newsletter: true,
    notifications: true,
  },
});
```

---

# AnonymousModeService

Handles anonymous user authentication.

## Features

- Anonymous account creation
- Anonymous user upgrade to regular account
- Anonymous state management

## Usage

```typescript
import { AnonymousModeService } from '@umituz/react-native-auth';

const anonymousService = new AnonymousModeService();

// Sign in anonymously
const user = await anonymousService.signInAnonymously();
console.log('Anonymous user:', user.uid);

// Convert anonymous user to regular user
const credential = EmailAuthProvider.credential(email, password);
await linkWithCredential(user, credential);
console.log('User upgraded:', user.email);
```

---

# AuthEventService

Manages authentication events and provides pub/sub functionality.

## Features

- Event emission
- Event subscription
- Type-safe events

## Usage

```typescript
import { AuthEventService } from '@umituz/react-native-auth';

const eventService = new AuthEventService();

// Subscribe to events
const unsubscribe = eventService.on('signIn', (user) => {
  console.log('User signed in:', user);
});

// Emit events
eventService.emit('signIn', user);

// Unsubscribe
unsubscribe();
```

### Available Events

| Event | Payload | Description |
|-------|---------|-------------|
| `signIn` | `AuthUser` | User signed in |
| `signUp` | `AuthUser` | New user registered |
| `signOut` | `undefined` | User signed out |
| `authStateChanged` | `AuthUser \| null` | Auth state changed |

---

# StorageProviderAdapter

Adapter for storage providers (AsyncStorage, MMKV, etc.).

## Usage

```typescript
import {
  createStorageProvider,
  StorageProviderAdapter,
} from '@umituz/react-native-auth';

// Custom implementation
class CustomStorageAdapter implements StorageProviderAdapter {
  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}

// Create provider
const storageProvider = createStorageProvider(new CustomStorageAdapter());
```

---

# Validation Utilities

Input validation utilities for authentication.

## Available Validators

```typescript
import {
  validateEmail,
  validatePasswordForLogin,
  validatePasswordForRegister,
  validatePasswordConfirmation,
  validateDisplayName,
  DEFAULT_VAL_CONFIG,
} from '@umituz/react-native-auth';
```

### Email Validation

```typescript
const result = validateEmail('test@example.com');
// { isValid: true }

const result = validateEmail('invalid-email');
// { isValid: false, error: 'Invalid email format' }
```

### Password Validation (Login)

```typescript
const result = validatePasswordForLogin('password123');
// { isValid: true }

const result = validatePasswordForLogin('');
// { isValid: false, error: 'Password is required' }
```

### Password Validation (Register)

```typescript
const result = validatePasswordForRegister('MyPass123!');
// {
//   isValid: true,
//   requirements: {
//     hasMinLength: true,
//     hasUppercase: true,
//     hasLowercase: true,
//     hasNumber: true,
//     hasSpecialChar: true
//   }
// }

const result = validatePasswordForRegister('weak');
// {
//   isValid: false,
//   requirements: { ... },
//   error: 'Password does not meet requirements'
// }
```

### Password Confirmation

```typescript
const result = validatePasswordConfirmation('password123', 'password123');
// { isValid: true, matches: true }

const result = validatePasswordConfirmation('password123', 'different');
// { isValid: false, matches: false, error: 'Passwords do not match' }
```

### Display Name Validation

```typescript
const result = validateDisplayName('John Doe');
// { isValid: true }

const result = validateDisplayName('');
// { isValid: false, error: 'Display name is required' }
```

### Custom Validation Config

```typescript
import { DEFAULT_VAL_CONFIG } from '@umituz/react-native-auth';

// Default config
DEFAULT_VAL_CONFIG;
// {
//   password: {
//     minLength: 8,
//     requireUppercase: true,
//     requireLowercase: true,
//     requireNumber: true,
//     requireSpecialChar: true,
//   }
// }
```

---

# Error Handling

## Firebase Error Mapping

```typescript
import {
  mapFirebaseError,
  AuthUserNotFoundError,
  AuthWrongPasswordError,
} from '@umituz/react-native-auth';

try {
  await signInWithEmailAndPassword(auth, email, password);
} catch (error) {
  const authError = mapFirebaseError(error);

  if (authError instanceof AuthUserNotFoundError) {
    Alert.alert('Error', 'User not found');
  } else if (authError instanceof AuthWrongPasswordError) {
    Alert.alert('Error', 'Wrong password');
  }
}
```

---

# Best Practices

## 1. Initialize Early

```typescript
// ✅ Good - Initialize in app root
function App() {
  useEffect(() => {
    initializeAuth();
  }, []);

  return <Navigator />;
}

// ❌ Bad - Initialize in component
function LoginComponent() {
  useEffect(() => {
    initializeAuth(); // Too late!
  }, []);
}
```

## 2. Handle Initialization State

```typescript
function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeAuth().then(() => setIsInitialized(true));
  }, []);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <AppNavigator />;
}
```

## 3. Check Auth Before Operations

```typescript
async function protectedOperation() {
  const authService = getAuthService();
  const user = authService.getCurrentUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Proceed with operation
}
```

## Related Modules

- **[Domain](../domain/README.md)** - Domain entities
- **[Application](../application/README.md)** - Application interfaces
- **[Presentation](../presentation/README.md)** - UI components and hooks
