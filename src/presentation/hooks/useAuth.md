# useAuth

Primary authentication hook for managing auth state and operations.

## Features

- Centralized Zustand store for auth state
- Email/password authentication
- Anonymous mode support
- Type-safe API
- Automatic error handling

## Usage

```typescript
import { useAuth } from '@umituz/react-native-auth';

function MyComponent() {
  const {
    user,
    userId,
    userType,
    loading,
    isAuthReady,
    isAnonymous,
    isAuthenticated,
    error,
    signIn,
    signUp,
    signOut,
    continueAnonymously,
    setError,
  } = useAuth();

  // Handle loading state
  if (loading) return <LoadingSpinner />;

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <View>
      <Text>Welcome, {user?.email}</Text>
      <Button onPress={signOut}>Sign Out</Button>
    </View>
  );
}
```

## API

### Return Value

| Prop | Type | Description |
|------|------|-------------|
| `user` | `AuthUser \| null` | Current authenticated user |
| `userId` | `string \| null` | Current user ID (uid) |
| `userType` | `UserType` | Current user type |
| `loading` | `boolean` | Whether auth state is loading |
| `isAuthReady` | `boolean` | Whether auth is ready (initialized and not loading) |
| `isAnonymous` | `boolean` | Whether user is anonymous |
| `isAuthenticated` | `boolean` | Whether user is authenticated (not anonymous) |
| `error` | `string \| null` | Current error message |
| `signIn` | `(email, password) => Promise<void>` | Sign in function |
| `signUp` | `(email, password, displayName?) => Promise<void>` | Sign up function |
| `signOut` | `() => Promise<void>` | Sign out function |
| `continueAnonymously` | `() => Promise<void>` | Continue anonymously function |
| `setError` | `(error: string \| null) => void` | Set error manually |

## Examples

### Login Form

```typescript
function LoginForm() {
  const { signIn, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      // Navigate to home on success
    } catch (err) {
      // Error is automatically set in error state
    }
  };

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button onPress={handleLogin} disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </View>
  );
}
```

### Registration Form

```typescript
function RegisterForm() {
  const { signUp, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleRegister = async () => {
    try {
      await signUp(email, password, displayName);
      // Success - user is automatically signed in
    } catch (err) {
      // Error handling
    }
  };

  return (
    <View>
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Full Name"
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Button onPress={handleRegister} disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </Button>
    </View>
  );
}
```

### Anonymous Mode

```typescript
function AnonymousPrompt() {
  const { continueAnonymously, loading } = useAuth();

  return (
    <View>
      <Text>Continue without an account?</Text>
      <Button onPress={continueAnonymously} disabled={loading}>
        {loading ? 'Starting...' : 'Continue as Guest'}
      </Button>
    </View>
  );
}
```

### Auth State Checking

```typescript
function ProtectedContent() {
  const { isAuthenticated, isAuthReady, user } = useAuth();

  // Show loading while auth initializes
  if (!isAuthReady) {
    return <LoadingScreen />;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Show protected content
  return (
    <View>
      <Text>Welcome, {user?.email}</Text>
      <ProtectedContent />
    </View>
  );
}
```

### Sign Out

```typescript
function ProfileScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          onPress: async () => {
            try {
              await signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  return (
    <View>
      <Text>{user?.email}</Text>
      <Button onPress={handleSignOut}>Sign Out</Button>
    </View>
  );
}
```

## Important Notes

1. **initializeAuthListener()**: Must be called once in app root
2. **Centralized State**: All components share the same state via Zustand
3. **Error Handling**: Errors are automatically set in the `error` state
4. **Loading States**: `loading` is true during operations

## Related Hooks

- [`useAuthRequired`](./useAuthRequired.md) - For components requiring auth
- [`useRequireAuth`](./useAuthRequired.md#userequireauth) - Route protection
- [`useUserProfile`](./useUserProfile.md) - User profile data
