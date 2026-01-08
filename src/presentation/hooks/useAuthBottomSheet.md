# useAuthBottomSheet

Hook for authentication bottom sheet management. Handles login/register modal display and social authentication.

## Features

- Bottom sheet modal management
- Login/Register mode switching
- Social authentication integration
- Auto-close on successful auth
- Pending callback management

## Usage

```typescript
import { useAuthBottomSheet } from '@umituz/react-native-auth';
import { BottomSheetModal } from '@umituz/react-native-design-system';

function AuthBottomSheet() {
  const {
    modalRef,
    mode,
    providers,
    googleLoading,
    appleLoading,
    handleDismiss,
    handleClose,
    handleNavigateToRegister,
    handleNavigateToLogin,
    handleGoogleSignIn,
    handleAppleSignIn,
  } = useAuthBottomSheet({
    socialConfig: {
      google: {
        iosClientId: 'your-ios-client-id',
        webClientId: 'your-web-client-id',
      },
      apple: { enabled: true },
    },
  });

  return (
    <BottomSheetModal ref={modalRef} onDismiss={handleDismiss}>
      {mode === 'login' ? (
        <LoginForm
          onRegisterPress={handleNavigateToRegister}
          onGoogleSignIn={handleGoogleSignIn}
          onAppleSignIn={handleAppleSignIn}
          googleLoading={googleLoading}
          appleLoading={appleLoading}
        />
      ) : (
        <RegisterForm
          onLoginPress={handleNavigateToLogin}
          onGoogleSignIn={handleGoogleSignIn}
          onAppleSignIn={handleAppleSignIn}
          googleLoading={googleLoading}
          appleLoading={appleLoading}
        />
      )}
    </BottomSheetModal>
  );
}
```

## API

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `socialConfig` | `SocialAuthConfiguration` | No | Social auth configuration |
| `onGoogleSignIn` | `() => Promise<void>` | No | Custom Google sign-in handler |
| `onAppleSignIn` | `() => Promise<void>` | No | Custom Apple sign-in handler |

### SocialAuthConfiguration

```typescript
interface SocialAuthConfiguration {
  google?: GoogleAuthConfig;
  apple?: { enabled: boolean };
}
```

### Return Value

| Prop | Type | Description |
|------|------|-------------|
| `modalRef` | `RefObject<BottomSheetModalRef>` | Bottom sheet modal reference |
| `mode` | `'login' \| 'register'` | Current mode |
| `providers` | `SocialAuthProvider[]` | Available social providers |
| `googleLoading` | `boolean` | Google loading state |
| `appleLoading` | `boolean` | Apple loading state |
| `handleDismiss` | `() => void` | Dismiss modal |
| `handleClose` | `() => void` | Close modal and cleanup |
| `handleNavigateToRegister` | `() => void` | Switch to register mode |
| `handleNavigateToLogin` | `() => void` | Switch to login mode |
| `handleGoogleSignIn` | `() => Promise<void>` | Google sign-in handler |
| `handleAppleSignIn` | `() => Promise<void>` | Apple sign-in handler |

## Examples

### Basic Auth Bottom Sheet

```typescript
function AuthModal() {
  const {
    modalRef,
    mode,
    handleDismiss,
    handleNavigateToRegister,
    handleNavigateToLogin,
  } = useAuthBottomSheet();

  return (
    <BottomSheetModal ref={modalRef} snapPoints={['80%']} onDismiss={handleDismiss}>
      <View>
        {mode === 'login' ? (
          <>
            <Text>Sign In</Text>
            <LoginForm />
            <Button onPress={handleNavigateToRegister}>
              Don't have an account? Sign Up
            </Button>
          </>
        ) : (
          <>
            <Text>Sign Up</Text>
            <RegisterForm />
            <Button onPress={handleNavigateToLogin}>
              Already have an account? Sign In
            </Button>
          </>
        )}
      </View>
    </BottomSheetModal>
  );
}
```

### With Social Login

```typescript
function AuthBottomSheetWithSocial() {
  const {
    modalRef,
    mode,
    providers,
    googleLoading,
    appleLoading,
    handleDismiss,
    handleNavigateToRegister,
    handleNavigateToLogin,
    handleGoogleSignIn,
    handleAppleSignIn,
  } = useAuthBottomSheet({
    socialConfig: {
      google: {
        webClientId: Config.GOOGLE_WEB_CLIENT_ID,
        iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
      },
      apple: { enabled: Platform.OS === 'ios' },
    },
  });

  return (
    <BottomSheetModal ref={modalRef} snapPoints={['90%']} onDismiss={handleDismiss}>
      <View>
        {mode === 'login' ? (
          <>
            <LoginForm />

            {/* Social login buttons */}
            {providers.includes('google') && (
              <SocialButton
                provider="google"
                onPress={handleGoogleSignIn}
                loading={googleLoading}
              />
            )}

            {providers.includes('apple') && (
              <SocialButton
                provider="apple"
                onPress={handleAppleSignIn}
                loading={appleLoading}
              />
            )}

            <Button onPress={handleNavigateToRegister}>
              Sign Up
            </Button>
          </>
        ) : (
          <>
            <RegisterForm />

            {/* Social login buttons */}
            {providers.includes('google') && (
              <SocialButton
                provider="google"
                onPress={handleGoogleSignIn}
                loading={googleLoading}
              />
            )}

            {providers.includes('apple') && (
              <SocialButton
                provider="apple"
                onPress={handleAppleSignIn}
                loading={appleLoading}
              />
            )}

            <Button onPress={handleNavigateToLogin}>
              Sign In
            </Button>
          </>
        )}
      </View>
    </BottomSheetModal>
  );
}
```

### Custom Social Login Handlers

```typescript
function AuthBottomSheetWithCustomHandlers() {
  const { showAuthModal } = useAuthModalStore();

  const handleCustomGoogleSignIn = async () => {
    try {
      const result = await customGoogleSignInFlow();

      if (result.success) {
        // Modal auto-closes on successful auth
        console.log('Google sign-in successful');
      }
    } catch (error) {
      Alert.alert('Error', 'Google sign-in failed');
    }
  };

  const handleCustomAppleSignIn = async () => {
    try {
      const result = await customAppleSignInFlow();

      if (result.success) {
        console.log('Apple sign-in successful');
      }
    } catch (error) {
      Alert.alert('Error', 'Apple sign-in failed');
    }
  };

  const {
    modalRef,
    mode,
    googleLoading,
    appleLoading,
    handleDismiss,
    handleNavigateToRegister,
    handleNavigateToLogin,
    handleGoogleSignIn,
    handleAppleSignIn,
  } = useAuthBottomSheet({
    onGoogleSignIn: handleCustomGoogleSignIn,
    onAppleSignIn: handleCustomAppleSignIn,
  });

  return (
    <BottomSheetModal ref={modalRef} onDismiss={handleDismiss}>
      {/* Auth form content */}
    </BottomSheetModal>
  );
}
```

### Triggering Auth Modal

```typescript
function RequireAuthButton() {
  const { showAuthModal } = useAuthModalStore();
  const { isAuthenticated } = useAuth();

  const handlePress = () => {
    if (!isAuthenticated) {
      // Show login modal
      showAuthModal(undefined, 'login');
      return;
    }

    // Perform auth-required action
    console.log('Action successful');
  };

  return (
    <Button onPress={handlePress}>
      Auth Required Action
    </Button>
  );
}
```

### With Pending Callback

```typescript
function AddToFavoritesButton() {
  const { showAuthModal } = useAuthModalStore();
  const { isAuthenticated } = useAuth();

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      // Save callback to run after successful auth
      showAuthModal(async () => {
        await addToFavorites(postId);
        Alert.alert('Success', 'Added to favorites');
      }, 'login');
      return;
    }

    // User authenticated, perform action directly
    await addToFavorites(postId);
    Alert.alert('Success', 'Added to favorites');
  };

  return (
    <Button onPress={handleAddToFavorites}>
      Add to Favorites
    </Button>
  );
}
```

## Auto-Close Behavior

The hook automatically closes the modal after successful authentication:

- **Not authenticated → Authenticated**: User signs in/logs in
- **Anonymous → Authenticated**: Anonymous user registers

```typescript
// User signs in
// → useAuth store updates
// → useAuthBottomSheet detects this
// → Modal auto-closes
// → Pending callback executes
```

## Provider Detection

The hook automatically determines which providers are available:

```typescript
const { providers } = useAuthBottomSheet({
  socialConfig: {
    google: { webClientId: '...' },
    apple: { enabled: true },
  },
});

// iOS: ['apple', 'google'] or ['google']
// Android: ['google']
// Web: ['google']
```

## Error Handling

```typescript
function AuthBottomSheetWithErrorHandling() {
  const {
    modalRef,
    mode,
    handleGoogleSignIn,
    handleAppleSignIn,
  } = useAuthBottomSheet({
    socialConfig: {
      google: { webClientId: Config.GOOGLE_WEB_CLIENT_ID },
      apple: { enabled: true },
    },
  });

  const handleGoogleSignInWithErrorHandling = async () => {
    try {
      await handleGoogleSignIn();
    } catch (error) {
      // Additional error handling if needed
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <BottomSheetModal ref={modalRef}>
      <Button onPress={handleGoogleSignInWithErrorHandling}>
        Sign in with Google
      </Button>
    </BottomSheetModal>
  );
}
```

## Related Components

- [`AuthBottomSheet`](../components/AuthBottomSheet.md) - Bottom sheet component
- [`useAuthModalStore`](../stores/authModalStore.md) - Auth modal state store
- [`LoginForm`](../components/LoginForm.md) - Login form component
- [`RegisterForm`](../components/RegisterForm.md) - Register form component

## Related Hooks

- [`useGoogleAuth`](./useSocialLogin.md#usegoogleauth) - Google auth hook
- [`useAppleAuth`](./useSocialLogin.md#useappleauth) - Apple auth hook
- [`useAuth`](./useAuth.md) - Main auth state management
