# Social Login Hooks

Hooks for Google and Apple social authentication.

---

## useSocialLogin

General social login functionality. Wraps `@umituz/react-native-firebase`'s `useSocialAuth`.

### Usage

```typescript
import { useSocialLogin } from '@umituz/react-native-auth';

function LoginScreen() {
  const {
    signInWithGoogle,
    signInWithApple,
    googleLoading,
    appleLoading,
    googleConfigured,
    appleAvailable,
  } = useSocialLogin({
    google: {
      webClientId: 'your-web-client-id',
      iosClientId: 'your-ios-client-id',
    },
    apple: { enabled: true },
  });

  return (
    <View>
      <Button onPress={signInWithGoogle} disabled={googleLoading || !googleConfigured}>
        {googleLoading ? 'Signing in...' : 'Sign in with Google'}
      </Button>

      <Button onPress={signInWithApple} disabled={appleLoading || !appleAvailable}>
        {appleLoading ? 'Signing in...' : 'Sign in with Apple'}
      </Button>
    </View>
  );
}
```

### API

| Prop | Type | Description |
|------|------|-------------|
| `signInWithGoogle` | `() => Promise<SocialAuthResult>` | Google sign-in (use `useGoogleAuth` for OAuth) |
| `signInWithApple` | `() => Promise<SocialAuthResult>` | Apple sign-in |
| `googleLoading` | `boolean` | Google loading state |
| `appleLoading` | `boolean` | Apple loading state |
| `googleConfigured` | `boolean` | Google is configured |
| `appleAvailable` | `boolean` | Apple is available (iOS only) |

---

## useGoogleAuth

Handles complete Google OAuth flow with `expo-auth-session`.

### Usage

```typescript
import { useGoogleAuth } from '@umituz/react-native-auth';

function LoginScreen() {
  const { signInWithGoogle, googleLoading, googleConfigured } = useGoogleAuth({
    iosClientId: 'your-ios-client-id.apps.googleusercontent.com',
    webClientId: 'your-web-client-id.apps.googleusercontent.com',
  });

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();

    if (result.success) {
      console.log('Google sign-in successful');
    } else {
      Alert.alert('Error', result.error || 'Sign-in failed');
    }
  };

  return (
    <Button onPress={handleGoogleSignIn} disabled={googleLoading || !googleConfigured}>
      Sign in with Google
    </Button>
  );
}
```

### API

#### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `iosClientId` | `string` | No* | iOS Google Client ID |
| `webClientId` | `string` | No* | Web Google Client ID |
| `androidClientId` | `string` | No* | Android Google Client ID |

*At least one must be provided

#### Return Value

| Prop | Type | Description |
|------|------|-------------|
| `signInWithGoogle` | `() => Promise<SocialAuthResult>` | Google sign-in function |
| `googleLoading` | `boolean` | Loading state |
| `googleConfigured` | `boolean` | Is configured |

### Examples

#### Google Sign-In Screen

```typescript
function SocialLoginScreen() {
  const { signInWithGoogle, googleLoading } = useGoogleAuth({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  });

  const { signInWithApple, appleLoading, appleAvailable } = useAppleAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={signInWithGoogle}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <GoogleIcon />
            <Text>Continue with Google</Text>
          </>
        )}
      </TouchableOpacity>

      {Platform.OS === 'ios' && appleAvailable && (
        <TouchableOpacity
          style={styles.appleButton}
          onPress={signInWithApple}
          disabled={appleLoading}
        >
          {appleLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              <AppleIcon />
              <Text>Continue with Apple</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
```

#### Error Handling

```typescript
function LoginWithErrorHandling() {
  const { signInWithGoogle, googleLoading } = useGoogleAuth({
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  });

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();

      if (result.success) {
        navigation.navigate('Home');
      } else {
        // User cancelled or error
        if (result.error?.includes('cancelled')) {
          return; // Silent cancel
        }
        Alert.alert('Error', result.error || 'Google sign-in failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return <Button onPress={handleGoogleSignIn} />;
}
```

---

## useAppleAuth

Convenience wrapper for Apple Sign-In.

### Usage

```typescript
import { useAppleAuth } from '@umituz/react-native-auth';
import { Platform } from 'react-native';

function LoginScreen() {
  const { signInWithApple, appleLoading, appleAvailable } = useAppleAuth();

  if (Platform.OS !== 'ios' || !appleAvailable) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={signInWithApple}
      disabled={appleLoading}
      style={styles.appleButton}
    >
      {appleLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <AppleIcon />
          <Text>Sign in with Apple</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
```

### API

| Prop | Type | Description |
|------|------|-------------|
| `signInWithApple` | `() => Promise<SocialAuthResult>` | Apple sign-in function |
| `appleLoading` | `boolean` | Loading state |
| `appleAvailable` | `boolean` | Apple Sign-In is available (iOS only) |

### Platform-Specific Button

```typescript
function SocialLoginButtons() {
  const { signInWithApple, appleLoading, appleAvailable } = useAppleAuth();
  const { signInWithGoogle, googleLoading } = useGoogleAuth({
    webClientId: Config.GOOGLE_WEB_CLIENT_ID,
  });

  return (
    <View>
      {/* Google - all platforms */}
      <SocialButton
        provider="google"
        onPress={signInWithGoogle}
        loading={googleLoading}
      />

      {/* Apple - iOS only */}
      {Platform.OS === 'ios' && appleAvailable && (
        <SocialButton
          provider="apple"
          onPress={signInWithApple}
          loading={appleLoading}
        />
      )}
    </View>
  );
}
```

### Apple Sign-In with Error Handling

```typescript
function AppleLoginButton() {
  const { signInWithApple, appleLoading, appleAvailable } = useAppleAuth();

  const handleAppleSignIn = async () => {
    const result = await signInWithApple();

    if (result.success) {
      console.log('Apple sign-in successful');
    } else {
      // Handle error
      if (result.error?.includes('cancelled')) {
        console.log('User cancelled');
      } else {
        Alert.alert('Error', result.error || 'Apple sign-in failed');
      }
    }
  };

  if (!appleAvailable) {
    return null;
  }

  return (
    <TouchableOpacity onPress={handleAppleSignIn} disabled={appleLoading}>
      <Text>Sign in with Apple</Text>
    </TouchableOpacity>
  );
}
```

## SocialAuthResult

All social login functions return the same type:

```typescript
interface SocialAuthResult {
  success: boolean;
  error?: string;
  user?: AuthUser;
}
```

## Configuration

### Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to "APIs & Services" > "Credentials"
4. Create "OAuth 2.0 Client IDs":
   - **iOS**: For your iOS app
   - **Android**: For your Android app
   - **Web**: For Expo/web

### Configure Apple Sign-In

1. Go to [Apple Developer](https://developer.apple.com/)
2. Navigate to "Certificates, Identifiers & Profiles" > "Identifiers"
3. Select your App ID and enable "Sign In with Apple"
4. Enable Apple Sign-In in Firebase Console

## Important Notes

### Google
- Requires `expo-web-browser` setup
- `WebBrowser.maybeCompleteAuthSession()` must be called in app root
- At least one client ID must be provided

### Apple
- Only available on iOS
- Requires `expo-apple-authentication` setup
- Requires Apple Developer account
- Testing requires a physical device (may not work in simulator)

## Related Hooks

- [`useAuth`](./useAuth.md) - Main auth state management
- [`useSocialLogin`](#usesociallogin) - General social login

## Related Components

- [`SocialLoginButtons`](../components/SocialLoginButtons.md) - Social login button component
