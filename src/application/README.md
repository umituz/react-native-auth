# Application Layer

React Native Auth package application layer. Defines ports and interfaces for authentication operations.

## Structure

```
application/
└── ports/
    ├── IAuthService.ts      # Authentication service interface
    └── IAuthProvider.ts     # Auth provider interface
```

## Overview

The application layer defines the contracts (interfaces) for authentication operations. It follows the Hexagonal Architecture (Ports and Adapters) pattern:

- **Ports**: Interfaces that define what the application can do
- **Adapters**: Implementations that connect to external services (Firebase, etc.)

---

# IAuthService

Authentication service interface defining all auth operations.

## Interface

```typescript
import type { IAuthService, SignUpParams, SignInParams } from '@umituz/react-native-auth';

interface IAuthService {
  // Sign up new user
  signUp(params: SignUpParams): Promise<AuthUser>;

  // Sign in existing user
  signIn(params: SignInParams): Promise<AuthUser>;

  // Sign out current user
  signOut(): Promise<void>;

  // Get current user
  getCurrentUser(): AuthUser | null;
}

interface SignUpParams {
  email: string;
  password: string;
  displayName?: string;
}

interface SignInParams {
  email: string;
  password: string;
}
```

## Usage Example

### Implementing IAuthService

```typescript
import { IAuthService, SignUpParams, SignInParams } from '@umituz/react-native-auth';

class FirebaseAuthService implements IAuthService {
  constructor(private firebaseAuth: Auth) {}

  async signUp(params: SignUpParams): Promise<AuthUser> {
    const userCredential = await createUserWithEmailAndPassword(
      this.firebaseAuth,
      params.email,
      params.password
    );

    // Update profile if displayName provided
    if (params.displayName) {
      await updateProfile(userCredential.user, {
        displayName: params.displayName,
      });
    }

    return this.mapToAuthUser(userCredential.user);
  }

  async signIn(params: SignInParams): Promise<AuthUser> {
    const userCredential = await signInWithEmailAndPassword(
      this.firebaseAuth,
      params.email,
      params.password
    );

    return this.mapToAuthUser(userCredential.user);
  }

  async signOut(): Promise<void> {
    await signOut(this.firebaseAuth);
  }

  getCurrentUser(): AuthUser | null {
    const user = this.firebaseAuth.currentUser;
    return user ? this.mapToAuthUser(user) : null;
  }

  private mapToAuthUser(firebaseUser: FirebaseUser): AuthUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      isAnonymous: firebaseUser.isAnonymous,
      emailVerified: firebaseUser.emailVerified,
      photoURL: firebaseUser.photoURL,
      provider: firebaseUser.providerData[0]?.providerId || 'unknown',
    };
  }
}
```

### Using IAuthService

```typescript
function LoginComponent({ authService }: { authService: IAuthService }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const user = await authService.signIn({ email, password });
      console.log('Signed in:', user.displayName);
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button onPress={handleSignIn}>Sign In</Button>
    </View>
  );
}
```

---

# IAuthProvider

Auth provider interface for different authentication methods (Firebase, custom backend, etc.).

## Interface

```typescript
import type { IAuthProvider, AuthCredentials, SignUpCredentials, SocialSignInResult } from '@umituz/react-native-auth';

interface IAuthProvider {
  // Sign up with email/password
  signUp(credentials: SignUpCredentials): Promise<AuthUser>;

  // Sign in with email/password
  signIn(credentials: AuthCredentials): Promise<AuthUser>;

  // Sign in with social provider
  signInWithSocial(provider: 'google' | 'apple'): Promise<SocialSignInResult>;

  // Sign out
  signOut(): Promise<void>;

  // Get current user
  getCurrentUser(): AuthUser | null;
}

interface AuthCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials extends AuthCredentials {
  displayName?: string;
}

interface SocialSignInResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}
```

## Usage Example

### Firebase Provider Implementation

```typescript
import { IAuthProvider } from '@umituz/react-native-auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

class FirebaseAuthProvider implements IAuthProvider {
  constructor(private firebaseAuth: Auth) {}

  async signUp(credentials: SignUpCredentials): Promise<AuthUser> {
    const userCredential = await createUserWithEmailAndPassword(
      this.firebaseAuth,
      credentials.email,
      credentials.password
    );

    if (credentials.displayName) {
      await updateProfile(userCredential.user, {
        displayName: credentials.displayName,
      });
    }

    return this.mapUser(userCredential.user);
  }

  async signIn(credentials: AuthCredentials): Promise<AuthUser> {
    const userCredential = await signInWithEmailAndPassword(
      this.firebaseAuth,
      credentials.email,
      credentials.password
    );

    return this.mapUser(userCredential.user);
  }

  async signInWithSocial(provider: 'google' | 'apple'): Promise<SocialSignInResult> {
    try {
      let authProvider: GoogleAuthProvider | OAuthProvider;

      if (provider === 'google') {
        authProvider = new GoogleAuthProvider();
      } else {
        authProvider = new OAuthProvider('apple.com');
      }

      const result = await signInWithPopup(this.firebaseAuth, authProvider);
      const user = this.mapUser(result.user);

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Social sign in failed',
      };
    }
  }

  async signOut(): Promise<void> {
    await signOut(this.firebaseAuth);
  }

  getCurrentUser(): AuthUser | null {
    const user = this.firebaseAuth.currentUser;
    return user ? this.mapUser(user) : null;
  }

  private mapUser(firebaseUser: FirebaseUser): AuthUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      isAnonymous: firebaseUser.isAnonymous,
      emailVerified: firebaseUser.emailVerified,
      photoURL: firebaseUser.photoURL,
      provider: firebaseUser.providerData[0]?.providerId || 'unknown',
    };
  }
}
```

### Custom Backend Provider

```typescript
import { IAuthProvider } from '@umituz/react-native-auth';

class BackendAuthProvider implements IAuthProvider {
  constructor(private apiBaseUrl: string) {}

  async signUp(credentials: SignUpCredentials): Promise<AuthUser> {
    const response = await fetch(`${this.apiBaseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Sign up failed');
    }

    const data = await response.json();
    return data.user; // Assuming API returns { user: AuthUser }
  }

  async signIn(credentials: AuthCredentials): Promise<AuthUser> {
    const response = await fetch(`${this.apiBaseUrl}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Sign in failed');
    }

    const data = await response.json();
    return data.user;
  }

  async signInWithSocial(provider: 'google' | 'apple'): Promise<SocialSignInResult> {
    // Implement social sign-in with your backend
    const response = await fetch(`${this.apiBaseUrl}/auth/social/${provider}`, {
      method: 'POST',
    });

    const data = await response.json();
    return data;
  }

  async signOut(): Promise<void> {
    await fetch(`${this.apiBaseUrl}/auth/signout`, { method: 'POST' });
  }

  getCurrentUser(): AuthUser | null {
    // Return cached user or fetch from backend
    return null;
  }
}
```

---

# Dependency Injection

Using interfaces allows for easy dependency injection and testing.

## Provider Pattern

```typescript
import { IAuthProvider } from '@umituz/react-native-auth';

interface AuthProviderContextType {
  authProvider: IAuthProvider;
}

const AuthProviderContext = createContext<AuthProviderContextType | null>(null);

export function AuthProvider({ children, provider }: { children: ReactNode; provider: IAuthProvider }) {
  return (
    <AuthProviderContext.Provider value={{ authProvider: provider }}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export function useAuthProvider(): IAuthProvider {
  const context = useContext(AuthProviderContext);
  if (!context) {
    throw new Error('useAuthProvider must be used within AuthProvider');
  }
  return context.authProvider;
}
```

## App Configuration

```typescript
import { FirebaseAuthProvider } from './providers/FirebaseAuthProvider';
import { BackendAuthProvider } from './providers/BackendAuthProvider';

// Choose provider based on environment
const authProvider = __DEV__
  ? new BackendAuthProvider('https://dev-api.example.com')
  : new FirebaseAuthProvider(getAuth());

function App() {
  return (
    <AuthProvider provider={authProvider}>
      <AppNavigator />
    </AuthProvider>
  );
}
```

---

# Testing with Mocks

## Mock Implementation

```typescript
import { IAuthProvider } from '@umituz/react-native-auth';

class MockAuthProvider implements IAuthProvider {
  private mockUser: AuthUser | null = null;

  async signUp(credentials: SignUpCredentials): Promise<AuthUser> {
    this.mockUser = {
      uid: 'mock-123',
      email: credentials.email,
      displayName: credentials.displayName || 'Mock User',
      isAnonymous: false,
      emailVerified: false,
      photoURL: null,
      provider: 'password',
    };
    return this.mockUser;
  }

  async signIn(credentials: AuthCredentials): Promise<AuthUser> {
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      this.mockUser = {
        uid: 'mock-123',
        email: credentials.email,
        displayName: 'Test User',
        isAnonymous: false,
        emailVerified: true,
        photoURL: null,
        provider: 'password',
      };
      return this.mockUser;
    }
    throw new Error('Invalid credentials');
  }

  async signInWithSocial(provider: 'google' | 'apple'): Promise<SocialSignInResult> {
    this.mockUser = {
      uid: `mock-${provider}-123`,
      email: `${provider}@example.com`,
      displayName: `${provider} User`,
      isAnonymous: false,
      emailVerified: true,
      photoURL: null,
      provider: provider === 'google' ? 'google.com' : 'apple.com',
    };
    return { success: true, user: this.mockUser };
  }

  async signOut(): Promise<void> {
    this.mockUser = null;
  }

  getCurrentUser(): AuthUser | null {
    return this.mockUser;
  }
}

// Usage in tests
const mockProvider = new MockAuthProvider();
render(
  <AuthProvider provider={mockProvider}>
    <LoginComponent />
  </AuthProvider>
);
```

---

# Best Practices

## 1. Always Use Interfaces

```typescript
// ✅ Good
function authenticateUser(authProvider: IAuthProvider, credentials: AuthCredentials) {
  return authProvider.signIn(credentials);
}

// ❌ Bad - couples to Firebase
function authenticateUser(auth: Auth, credentials: AuthCredentials) {
  return signInWithEmailAndPassword(auth, credentials.email, credentials.password);
}
```

## 2. Dependency Injection

```typescript
// ✅ Good - injectable
class UserService {
  constructor(private authProvider: IAuthProvider) {}
}

// ❌ Bad - tight coupling
import { getAuth } from 'firebase/auth';
class UserService {
  private auth = getAuth();
}
```

## 3. Error Handling

```typescript
// ✅ Good - abstract errors
async function signUp(authProvider: IAuthProvider, params: SignUpParams) {
  try {
    return await authProvider.signUp(params);
  } catch (error) {
    if (error instanceof AuthEmailAlreadyInUseError) {
      // Handle specific error
    }
    throw error;
  }
}
```

## Related Modules

- **[Domain](../domain/README.md)** - Domain entities and value objects
- **[Infrastructure](../infrastructure/README.md)** - Infrastructure implementations
- **[Presentation](../presentation/README.md)** - UI components and hooks
